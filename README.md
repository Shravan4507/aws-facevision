# AWS FaceVision

AI-powered image face detection using AWS serverless event-driven architecture.

## Overview
AWS FaceVision is a serverless pipeline that detects and counts human faces in uploaded images using Amazon Rekognition, storing metadata in Amazon DynamoDB and visualizing results in a React dashboard.

## Pipeline Architecture
```text
User Upload → Amazon S3 → ObjectCreated Event → AWS Lambda → Amazon Rekognition
                                                     ↓
                                        Amazon CloudWatch + Amazon DynamoDB
                                                               ↓
                                                      REST API (API Gateway)
                                                               ↓
                                                      React Web Dashboard
```

## Project Structure
- `backend/`: Lambda functions for image processing and API handlers.
- `frontend/`: React + Vite + TypeScript dashboard.
- `infrastructure/`: IAM policy definitions and AWS resource documentation.
- `docs/`: Architecture diagrams, setup guides, testing plans, and demo scripts.
