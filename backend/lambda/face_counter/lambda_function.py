"""
AWS FaceVision - Face Counter Lambda Function
Processes S3 ObjectCreated events, invokes Amazon Rekognition DetectFaces,
logs structured records to CloudWatch, and persists results in DynamoDB.
"""

import os
import json
import logging
import urllib.parse
from datetime import datetime, timezone
import boto3
from botocore.exceptions import ClientError

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS SDK clients
rekognition_client = boto3.client('rekognition')
dynamodb = boto3.resource('dynamodb')

# Supported image file extensions
SUPPORTED_EXTENSIONS = {'.jpg', '.jpeg', '.png'}
DYNAMODB_TABLE_NAME = os.environ.get('DYNAMODB_TABLE', 'facevision-results')


def lambda_handler(event, context):
    """
    Main Lambda handler triggered by Amazon S3 ObjectCreated events.
    """
    logger.info("Received event: %s", json.dumps(event))

    records = event.get('Records', [])
    if not records:
        logger.warning("No S3 records found in event.")
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "No records in event"})
        }

    processed_items = []

    for record in records:
        # Extract bucket name and object key
        bucket_name = record.get('s3', {}).get('bucket', {}).get('name')
        raw_key = record.get('s3', {}).get('object', {}).get('key', '')
        # Unquote URL-encoded keys (e.g., 'uploads/group+photo.jpg' -> 'uploads/group photo.jpg')
        object_key = urllib.parse.unquote_plus(raw_key)

        timestamp_iso = datetime.now(timezone.utc).isoformat()
        image_name = os.path.basename(object_key)

        # Validate file extension
        _, ext = os.path.splitext(object_key.lower())
        if ext not in SUPPORTED_EXTENSIONS:
            logger.warning("Skipping unsupported file: %s (Extension: %s)", object_key, ext)
            log_structured_output(
                bucket_name=bucket_name,
                image_key=object_key,
                status="IGNORED",
                faces_count=0,
                processed_at=timestamp_iso,
                error_msg=f"Unsupported extension '{ext}'. Supported: {', '.join(SUPPORTED_EXTENSIONS)}"
            )
            continue

        try:
            logger.info("Calling Amazon Rekognition DetectFaces for s3://%s/%s", bucket_name, object_key)

            # Call Rekognition DetectFaces with ALL facial attributes
            response = rekognition_client.detect_faces(
                Image={
                    'S3Object': {
                        'Bucket': bucket_name,
                        'Name': object_key
                    }
                },
                Attributes=['ALL']
            )

            face_details = response.get('FaceDetails', [])
            face_count = len(face_details)

            # Parse rich facial telemetry (Emotions, Age, Smile, BoundingBox)
            parsed_faces = []
            for face in face_details:
                emotions = face.get('Emotions', [])
                top_emotion = max(emotions, key=lambda e: e.get('Confidence', 0)) if emotions else {'Type': 'UNKNOWN', 'Confidence': 0}
                age_range = face.get('AgeRange', {})
                smile = face.get('Smile', {})
                gender = face.get('Gender', {})
                eyeglasses = face.get('Eyeglasses', {})
                box = face.get('BoundingBox', {})

                parsed_faces.append({
                    'bounding_box': {
                        'width': round(float(box.get('Width', 0)), 4),
                        'height': round(float(box.get('Height', 0)), 4),
                        'left': round(float(box.get('Left', 0)), 4),
                        'top': round(float(box.get('Top', 0)), 4),
                    },
                    'age_range': {
                        'low': int(age_range.get('Low', 0)),
                        'high': int(age_range.get('High', 0)),
                    },
                    'smile': bool(smile.get('Value', False)),
                    'gender': gender.get('Value', 'UNKNOWN'),
                    'eyeglasses': bool(eyeglasses.get('Value', False)),
                    'top_emotion': {
                        'type': top_emotion.get('Type', 'UNKNOWN'),
                        'confidence': round(float(top_emotion.get('Confidence', 0)), 1)
                    }
                })

            # Log formatted output to CloudWatch
            log_structured_output(
                bucket_name=bucket_name,
                image_key=object_key,
                status="SUCCESS",
                faces_count=face_count,
                processed_at=timestamp_iso
            )

            # Persist record in DynamoDB with telemetry
            item_record = {
                'image_id': f"{object_key}#{int(datetime.now(timezone.utc).timestamp())}",
                'image_name': image_name,
                's3_key': object_key,
                'bucket_name': bucket_name,
                'face_count': face_count,
                'faces': parsed_faces,
                'status': 'SUCCESS',
                'processed_at': timestamp_iso
            }
            save_to_dynamodb(item_record)
            processed_items.append(item_record)

        except ClientError as err:
            error_code = err.response.get('Error', {}).get('Code', 'Unknown')
            error_msg = err.response.get('Error', {}).get('Message', str(err))

            logger.error("AWS ClientError processing %s: [%s] %s", object_key, error_code, error_msg)
            log_structured_output(
                bucket_name=bucket_name,
                image_key=object_key,
                status="FAILED",
                faces_count=0,
                processed_at=timestamp_iso,
                error_msg=f"[{error_code}] {error_msg}"
            )

            failed_record = {
                'image_id': f"{object_key}#{int(datetime.now(timezone.utc).timestamp())}",
                'image_name': image_name,
                's3_key': object_key,
                'bucket_name': bucket_name,
                'status': 'FAILED',
                'error_message': f"[{error_code}] {error_msg}",
                'processed_at': timestamp_iso
            }
            save_to_dynamodb(failed_record)
            processed_items.append(failed_record)

        except Exception as exc:
            logger.error("Unexpected error processing %s: %s", object_key, str(exc))
            log_structured_output(
                bucket_name=bucket_name,
                image_key=object_key,
                status="FAILED",
                faces_count=0,
                processed_at=timestamp_iso,
                error_msg=str(exc)
            )

            failed_record = {
                'image_id': f"{object_key}#{int(datetime.now(timezone.utc).timestamp())}",
                'image_name': image_name,
                's3_key': object_key,
                'bucket_name': bucket_name,
                'status': 'FAILED',
                'error_message': str(exc),
                'processed_at': timestamp_iso
            }
            save_to_dynamodb(failed_record)
            processed_items.append(failed_record)

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Processing complete",
            "processed_count": len(processed_items),
            "items": processed_items
        })
    }


def log_structured_output(bucket_name, image_key, status, faces_count, processed_at, error_msg=None):
    """
    Prints human-readable structured logs to CloudWatch as required by FaceVision specs.
    """
    divider = "=" * 40
    lines = [
        "",
        divider,
        "FaceVision Image Processing",
        divider,
        f"Bucket: {bucket_name}",
        f"Image: {image_key}",
        f"Status: {status}",
    ]

    if status == "SUCCESS":
        lines.append(f"Faces Detected: {faces_count}")
    elif error_msg:
        lines.append(f"Error: {error_msg}")

    lines.extend([
        f"Processed At: {processed_at}",
        divider,
        ""
    ])
    logger.info("\n".join(lines))


from decimal import Decimal


def float_to_decimal(obj):
    """Recursively converts all float types to Decimal for DynamoDB compatibility."""
    if isinstance(obj, float):
        return Decimal(str(obj))
    if isinstance(obj, dict):
        return {k: float_to_decimal(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [float_to_decimal(v) for v in obj]
    return obj


def save_to_dynamodb(item):
    """
    Saves an image processing record to DynamoDB table if available.
    """
    try:
        table = dynamodb.Table(DYNAMODB_TABLE_NAME)
        table.put_item(Item=float_to_decimal(item))
        logger.info("Successfully recorded item %s in DynamoDB table %s", item.get('image_id'), DYNAMODB_TABLE_NAME)
    except ClientError as err:
        logger.warning("Could not write to DynamoDB table '%s': %s", DYNAMODB_TABLE_NAME, err.response.get('Error', {}).get('Message', str(err)))
    except Exception as exc:
        logger.warning("DynamoDB save skipped: %s", str(exc))
