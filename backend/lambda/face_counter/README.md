# Face Counter Lambda Function

## Overview
This AWS Lambda function (`facevision-face-counter`) is triggered automatically whenever an image is uploaded to the target Amazon S3 bucket (`uploads/` prefix).

## Function Responsibilities
1. Parse and URL-decode the incoming S3 object key.
2. Validate that the object is an image (`.jpg`, `.jpeg`, `.png`).
3. Call Amazon Rekognition `detect_faces` directly referencing the S3 object.
4. Calculate total detected faces.
5. Log formatted summary to Amazon CloudWatch.
6. Write image metadata and face count to Amazon DynamoDB.
