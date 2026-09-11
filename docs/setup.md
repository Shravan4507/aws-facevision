# Setup & Configuration Guide

This guide describes how to configure the AWS resources and local development environment for AWS FaceVision.

## Prerequisites
- AWS Account with permissions to create S3, IAM, Lambda, DynamoDB, and API Gateway resources.
- Node.js (v18+) and npm installed locally.
- Python 3.10+ installed locally.

## Setup Stages
1. **Repository Setup**: Initial project structure and Git repository.
2. **Amazon S3**: Private bucket creation with `uploads/` folder.
3. **IAM Execution Role**: Role allowing Lambda to access CloudWatch, S3, Rekognition, and DynamoDB.
4. **AWS Lambda**: Deploying `facevision-face-counter` with S3 trigger.
5. **Amazon DynamoDB**: Provisioning `facevision-results` table with `image_id` partition key.
6. **API Gateway & Lambda API**: REST API endpoints for the dashboard.
7. **Frontend Dashboard**: Local Vite dev server configuration.
