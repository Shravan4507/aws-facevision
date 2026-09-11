# AWS Resources Inventory

This document tracks all AWS resources deployed for AWS FaceVision.

## Configuration Variables
- **AWS Region**: `us-east-1` (or your preferred region)
- **Environment**: `dev`

## Resource Table

| Service | Resource Name / ID | Purpose | Status |
|---|---|---|---|
| **S3** | `facevision-images-<unique-suffix>` | Ingestion bucket for user image uploads | Planned (Phase 2) |
| **IAM** | `FaceVisionLambdaExecutionRole` | Least-privilege role for Lambda execution | Planned (Phase 4) |
| **Lambda** | `facevision-face-counter` | Event processor calling Rekognition | Planned (Phase 3) |
| **Rekognition** | `DetectFaces` API | Facial analysis engine | Managed AWS Service |
| **CloudWatch** | `/aws/lambda/facevision-face-counter` | Diagnostic and execution log group | Automatic via Lambda |
| **DynamoDB** | `facevision-results` | Persistent store for face counts & metadata | Planned (Phase 8) |
| **API Gateway** | `facevision-api` | HTTP REST API for Frontend Dashboard | Planned (Phase 15) |
| **Lambda** | `facevision-api-handler` | API handler serving results from DynamoDB | Planned (Phase 15) |
