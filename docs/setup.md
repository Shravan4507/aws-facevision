# Setup & Configuration Guide

This guide describes how to configure the AWS resources and local development environment for AWS FaceVision.

## Prerequisites
- AWS Account with permissions to create S3, IAM, Lambda, DynamoDB, and API Gateway resources.
- Node.js (v18+) and npm installed locally.
- Python 3.10+ installed locally.

## Active Deployed AWS Resources
- **AWS Region**: `us-east-1` (US East, N. Virginia)
- **AWS Account ID**: `663981373457`
- **S3 Image Bucket**: `facevision-images-663981373457-us-east-1` (Private, SSE-S3)
- **IAM Execution Role**: `FaceVisionLambdaExecutionRole`
- **Lambda Face Counter**: `arn:aws:lambda:us-east-1:663981373457:function:facevision-face-counter`
- **Amazon Rekognition**: `DetectFaces` API
- **CloudWatch Log Group**: `/aws/lambda/facevision-face-counter`
- **DynamoDB Table**: `facevision-results` (Partition Key: `image_id` [String], On-Demand)
- **API Gateway HTTP API**: `https://qiokxp5iy2.execute-api.us-east-1.amazonaws.com`
- **Lambda API Handler**: `arn:aws:lambda:us-east-1:663981373457:function:facevision-api-handler`

## Setup Stages Completed
1. **Repository Setup**: Initial directory tree, Git branches (`main`, `dev`), `.gitignore`.
2. **Amazon S3**: Private bucket created with blocked public access and SSE-S3 encryption.
3. **IAM Execution Role**: Least-privilege role with CloudWatch, S3, Rekognition, and DynamoDB permissions.
4. **AWS Lambda**: `facevision-face-counter` deployed with S3 `ObjectCreated:*` trigger under `uploads/`.
5. **Amazon DynamoDB**: `facevision-results` provisioned and verified with live scan records.
6. **API Gateway & Lambda API**: `facevision-api` HTTP API connected to `facevision-api-handler` with full CORS support.
7. **Frontend Dashboard**: 90s Windows 95 UI connected to live API Gateway via `VITE_API_BASE_URL`.
