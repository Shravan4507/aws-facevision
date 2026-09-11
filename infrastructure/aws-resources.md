# AWS Resources Inventory

This document tracks all AWS resources deployed for AWS FaceVision.

## Configuration Variables
- **AWS Region**: `us-east-1` (or your preferred region)
- **Environment**: `dev`

## Resource Table

| Service | Resource Name / ID | Purpose | Status |
|---|---|---|---|
| **S3** | `facevision-images-663981373457-us-east-1` | Ingestion bucket for user image uploads | **Active** (Private, SSE-S3) |
| **IAM Role** | `FaceVisionLambdaExecutionRole` | Least-privilege role for Lambda execution | **Active** |
| **IAM User** | `facevision-developer` | Local development CLI user (Root account retired) | **Active** |
| **IAM User** | `github-actions-deployer` | Dedicated least-privilege CI/CD user for Lambda updates | **Active** |
| **Lambda** | `facevision-face-counter` | Event processor calling Rekognition | **Active** (Python 3.12) |
| **Rekognition** | `DetectFaces` API | Facial analysis engine | Managed AWS Service |
| **CloudWatch** | `/aws/lambda/facevision-face-counter` | Diagnostic and execution log group | Automatic via Lambda |
| **DynamoDB** | `facevision-results` | Persistent store for face counts & metadata | **Active** (PAY_PER_REQUEST) |
| **API Gateway** | `https://qiokxp5iy2.execute-api.us-east-1.amazonaws.com` | HTTP REST API for Frontend Dashboard | **Active** |
| **Lambda (API)** | `facevision-api-handler` | API handler serving results from DynamoDB & S3 | **Active** (Python 3.12) |
