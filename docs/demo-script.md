# 3–5 Minute Viva & Demonstration Script

## 1. Introduction (30 seconds)
"Good morning/afternoon. Today I am presenting **AWS FaceVision**, a serverless, event-driven computer vision pipeline built entirely on Amazon Web Services. The system automatically detects and counts human faces in uploaded images using Amazon Rekognition and displays live analytics on a web dashboard."

## 2. Architecture Walkthrough (1 minute)
"The architecture is completely event-driven:
1. When an image is uploaded to our private **Amazon S3** bucket, S3 emits an `ObjectCreated` event.
2. This event immediately triggers an **AWS Lambda** function.
3. The Lambda function sends the S3 object coordinates to **Amazon Rekognition** using the `DetectFaces` API.
4. Rekognition processes the image and returns facial bounding boxes and confidence scores.
5. Lambda logs detailed execution information to **Amazon CloudWatch** and saves the metadata and face count into **Amazon DynamoDB**.
6. Our **React web dashboard** communicates with an **API Gateway** endpoint to render real-time statistics and recent image processing records."

## 3. Live Demonstration (2 minutes)
1. **Upload**: Upload a group photo directly to the S3 bucket's `uploads/` prefix.
2. **CloudWatch Logs**: Open the CloudWatch log stream to observe the real-time execution log showing image key, detection timestamp, and detected face count.
3. **DynamoDB**: Inspect the `facevision-results` table to confirm the persisted record.
4. **Dashboard**: Refresh/view the frontend dashboard to see the updated totals and card entry showing the image name, status, and face count.

## 4. Key Engineering Decisions & Viva Points (1 minute)
- **Least Privilege IAM**: The Lambda execution role only has permissions to read from the specific S3 prefix, invoke Rekognition DetectFaces, write to its CloudWatch log group, and put records into the DynamoDB table.
- **Cost Efficiency & Free Tier**: No servers run 24/7. All compute (Lambda), storage (S3/DynamoDB), and AI (Rekognition) scale to zero when idle.
- **Frontend Security**: No AWS access keys or secrets are stored in the client-side code. Data is retrieved through an authenticated or public API Gateway proxy.
