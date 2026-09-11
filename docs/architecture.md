# AWS FaceVision — System Architecture

## Architecture Diagram
```text
                          ┌───────────────────┐
                          │      User         │
                          │   Upload Image    │
                          └─────────┬─────────┘
                                    │ (Manual Console or S3 Upload)
                                    ▼
                          ┌───────────────────┐
                          │     Amazon S3     │
                          │   uploads/ folder │
                          └─────────┬─────────┘
                                    │ ObjectCreated:Put
                                    ▼
                          ┌───────────────────┐
                          │    AWS Lambda     │
                          │ face_counter.py   │
                          └─────────┬─────────┘
                                    │ S3 Object Ref
                                    ▼
                          ┌───────────────────┐
                          │ Amazon Rekognition│
                          │   DetectFaces     │
                          └─────────┬─────────┘
                                    │ Face Details Count
                     ┌──────────────┴──────────────┐
                     │                             │
                     ▼                             ▼
           ┌───────────────────┐         ┌───────────────────┐
           │ Amazon CloudWatch │         │  Amazon DynamoDB  │
           │      Logs         │         │ facevision-results│
           └───────────────────┘         └─────────┬─────────┘
                                                   │
                                                   ▼
                                         ┌───────────────────┐
                                         │    API Gateway    │
                                         │   + Lambda API    │
                                         └─────────┬─────────┘
                                                   │
                                                   ▼
                                         ┌───────────────────┐
                                         │  React Dashboard  │
                                         │  (Vite + TS + CSS)│
                                         └───────────────────┘
```

## Component Breakdown
1. **Amazon S3**: Secure object storage configured with Private Access and AWS-managed SSE-S3 encryption.
2. **S3 Event Notification**: Triggers AWS Lambda on `s3:ObjectCreated:*` events under `uploads/`.
3. **AWS Lambda (`facevision-face-counter`)**: Lightweight Python runtime executing facial analysis.
4. **Amazon Rekognition**: Managed Computer Vision service calling `DetectFaces` on the S3 reference.
5. **Amazon CloudWatch**: Captures structured logs, invocation metrics, and runtime failures.
6. **Amazon DynamoDB**: Stores image processing records, status, and face counts.
7. **Amazon API Gateway + Lambda API**: Securely provides REST endpoints (`/results`, `/stats`) without exposing AWS credentials.
8. **React Dashboard**: Modern, responsive UI displaying summary statistics and recent image processing records.
