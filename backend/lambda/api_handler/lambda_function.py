"""
AWS FaceVision - API Handler Lambda Function
Exposes REST API endpoints for the Frontend Dashboard via API Gateway:
- GET /results : Fetches recent image processing records
- GET /stats   : Returns aggregated summary statistics
- POST /upload : Uploads an image to S3 uploads/ prefix & triggers facial recognition
"""

import os
import json
import base64
import logging
from decimal import Decimal
from datetime import datetime, timezone
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Environment configuration
DYNAMODB_TABLE_NAME = os.environ.get('DYNAMODB_TABLE', 'facevision-results')
S3_BUCKET_NAME = os.environ.get('S3_BUCKET', 'facevision-images-663981373457-us-east-1')

# AWS SDK clients
dynamodb = boto3.resource('dynamodb')
s3_client = boto3.client('s3')
rekognition_client = boto3.client('rekognition')

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Amz-Date, X-Api-Key',
    'Content-Type': 'application/json'
}


class DecimalEncoder(json.JSONEncoder):
    """Helper to convert DynamoDB Decimal types to standard JSON numbers."""
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj) if obj % 1 == 0 else float(obj)
        return super(DecimalEncoder, self).default(obj)


def build_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': CORS_HEADERS,
        'body': json.dumps(body, cls=DecimalEncoder)
    }


def lambda_handler(event, context):
    logger.info("API Gateway event: %s", json.dumps(event))

    # Support both HTTP API (v2) and REST API (v1) formats
    http_method = event.get('httpMethod') or event.get('requestContext', {}).get('http', {}).get('method', 'GET')
    raw_path = event.get('path') or event.get('rawPath') or '/'
    
    # Strip stage prefix if present
    path = raw_path
    for prefix in ['/dev', '/prod', '/default']:
        if path.startswith(prefix):
            path = path[len(prefix):]
            break
    if not path:
        path = '/'

    # Handle CORS preflight
    if http_method.upper() == 'OPTIONS':
        return build_response(200, {'message': 'OK'})

    try:
        if http_method.upper() == 'GET' and (path == '/results' or path.endswith('/results')):
            return handle_get_results()

        if http_method.upper() == 'GET' and (path == '/stats' or path.endswith('/stats')):
            return handle_get_stats()

        if http_method.upper() == 'POST' and (path == '/upload' or path.endswith('/upload')):
            return handle_post_upload(event)

        return build_response(404, {'message': f'Route not found: {http_method} {path}'})

    except Exception as exc:
        logger.error("API execution failed: %s", str(exc), exc_info=True)
        return build_response(500, {'message': 'Internal Server Error', 'error': str(exc)})


def handle_get_results():
    table = dynamodb.Table(DYNAMODB_TABLE_NAME)
    response = table.scan()
    items = response.get('Items', [])

    # Sort descending by processed_at
    items.sort(key=lambda x: x.get('processed_at', ''), reverse=True)
    return build_response(200, {'items': items})


def handle_get_stats():
    table = dynamodb.Table(DYNAMODB_TABLE_NAME)
    response = table.scan()
    items = response.get('Items', [])

    total_images = len(items)
    total_faces = 0
    successful = 0
    failed = 0

    for item in items:
        if item.get('status') == 'SUCCESS':
            successful += 1
            total_faces += int(item.get('face_count', 0))
        else:
            failed += 1

    stats = {
        'total_images': total_images,
        'total_faces': total_faces,
        'successful': successful,
        'failed': failed
    }
    return build_response(200, stats)


def handle_post_upload(event):
    """
    Receives image upload, saves to S3 uploads/ prefix, executes Rekognition,
    and returns immediate FaceVision ImageResult object.
    """
    body = event.get('body', '')
    is_base64 = event.get('isBase64Encoded', False)

    if not body:
        return build_response(400, {'message': 'Empty upload body.'})

    # Decode bytes
    if is_base64:
        file_bytes = base64.b64decode(body)
    else:
        file_bytes = body.encode('utf-8')

    headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}
    content_type = headers.get('content-type', 'image/jpeg')

    # Handle multipart or raw binary
    filename = f"upload-{int(datetime.now(timezone.utc).timestamp())}.jpg"
    
    # If multipart boundary present, extract binary stream
    if 'boundary=' in content_type:
        boundary = content_type.split('boundary=')[1].strip()
        parts = file_bytes.split(f'--{boundary}'.encode())
        for part in parts:
            if b'filename=' in part:
                header_part, _, file_data = part.partition(b'\r\n\r\n')
                # Extract original filename if available
                for line in header_part.decode(errors='ignore').split('\r\n'):
                    if 'filename=' in line:
                        extracted_name = line.split('filename=')[1].strip('"\'; ')
                        if extracted_name:
                            filename = os.path.basename(extracted_name)
                # Strip trailing CRLF
                file_bytes = file_data.rstrip(b'\r\n')
                break

    s3_key = f"uploads/{filename}"
    timestamp_iso = datetime.now(timezone.utc).isoformat()

    # 1. Upload to S3
    s3_client.put_object(
        Bucket=S3_BUCKET_NAME,
        Key=s3_key,
        Body=file_bytes,
        ContentType='image/jpeg'
    )

    # 2. Call Rekognition DetectFaces
    face_count = 0
    status = "SUCCESS"
    error_message = None

    try:
        rekog_resp = rekognition_client.detect_faces(
            Image={'Bytes': file_bytes},
            Attributes=['DEFAULT']
        )
        face_count = len(rekog_resp.get('FaceDetails', []))
    except Exception as exc:
        status = "FAILED"
        error_message = str(exc)

    # 3. Store in DynamoDB
    table = dynamodb.Table(DYNAMODB_TABLE_NAME)
    record = {
        'image_id': f"{s3_key}#{int(datetime.now(timezone.utc).timestamp())}",
        'image_name': filename,
        's3_key': s3_key,
        'bucket_name': S3_BUCKET_NAME,
        'face_count': face_count,
        'status': status,
        'processed_at': timestamp_iso
    }
    if error_message:
        record['error_message'] = error_message

    table.put_item(Item=record)

    return build_response(200, record)
