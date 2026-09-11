# AWS Face Recognition Mini Project — Antigravity Build Prompt

## 1. Project Overview

Build an AWS mini project from scratch that demonstrates an event-driven image-processing pipeline.

The core workflow is:

```text
User manually uploads image
        ↓
Amazon S3 bucket
        ↓
S3 ObjectCreated event
        ↓
AWS Lambda
        ↓
Amazon Rekognition DetectFaces
        ↓
Face count
        ↓
CloudWatch Logs
```

The project should also include a simple web dashboard that displays uploaded images and their detected face counts.

The goal is to create a clean, understandable student-level AWS project that can be demonstrated easily and explained component-by-component.

Do NOT over-engineer the solution.

---

# 2. Primary Requirements

The completed system must:

1. Allow an image to be uploaded to an S3 bucket.
2. Automatically trigger a Lambda function whenever a new image is uploaded.
3. Lambda must use Amazon Rekognition to detect faces in the uploaded image.
4. Lambda must calculate the number of detected faces.
5. Lambda must write the result to CloudWatch Logs.
6. The system should maintain a persistent record of processed images and face counts.
7. A web dashboard should display:
   - Total images processed
   - Total faces detected
   - Recent processed images
   - Face count for each image
   - Processing status
8. The project must include proper IAM permissions.
9. The architecture must be easy to explain during a viva/demo.
10. The project must be structured so AWS resources can be configured manually first and automated later if desired.

---

# 3. Recommended Architecture

Use this architecture:

```text
                         ┌───────────────────┐
                         │      User         │
                         │ Upload Image      │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │     Amazon S3     │
                         │   Image Bucket    │
                         └─────────┬─────────┘
                                   │
                         ObjectCreated Event
                                   │
                                   ▼
                         ┌───────────────────┐
                         │    AWS Lambda     │
                         │ Face Recognition  │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │ Amazon Rekognition│
                         │   DetectFaces     │
                         └─────────┬─────────┘
                                   │
                              Face Count
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
          ┌───────────────────┐         ┌───────────────────┐
          │ Amazon CloudWatch │         │ Persistent Result │
          │      Logs         │         │     Storage       │
          └───────────────────┘         └─────────┬─────────┘
                                                   │
                                                   ▼
                                          ┌───────────────────┐
                                          │    Web Dashboard  │
                                          └───────────────────┘
```

---

# 4. Technology Stack

## AWS

Use:

- Amazon S3
- AWS Lambda
- Amazon Rekognition
- Amazon CloudWatch
- AWS IAM
- Amazon DynamoDB for persistent results

Optional later:

- Amazon API Gateway
- Amazon CloudFront
- AWS Amplify / Vercel for frontend hosting

Do not introduce optional services until the core pipeline works.

## Backend

Use:

- Python 3.x
- AWS Lambda
- boto3

## Frontend

Use:

- React
- Vite
- TypeScript
- Plain CSS

Avoid unnecessary frameworks.

Do not introduce Tailwind, Redux, Next.js, or a large UI framework unless there is a strong reason.

---

# 5. Project Name

Use:

**AWS FaceVision**

Possible bucket/resource naming convention:

```text
facevision-images-<unique-suffix>
facevision-results
facevision-face-counter
```

AWS resource names must remain unique where AWS requires global uniqueness.

Do not hard-code a name that is likely to collide.

---

# 6. Project Goals

There are two stages.

## Stage A — Core AWS Pipeline

First build and verify:

```text
S3 → Lambda → Rekognition → CloudWatch
```

This stage is mandatory.

Do not continue to dashboard development until this pipeline is confirmed to work.

## Stage B — Dashboard

After the core pipeline works, add:

```text
S3 + Lambda + Rekognition + DynamoDB
                           ↓
                       Dashboard
```

The dashboard should provide a visual representation of the system.

---

# 7. Development Rules

Follow these rules strictly:

1. Build incrementally.
2. Do not create every AWS resource at once.
3. Verify each AWS service immediately after configuration.
4. Never assume an AWS permission works. Test it.
5. Use environment variables/configuration for resource names.
6. Do not hard-code secrets.
7. Keep Lambda small and readable.
8. Log useful information to CloudWatch.
9. Handle invalid files gracefully.
10. Restrict supported uploads to common image formats.
11. Avoid unnecessary AWS services.
12. Keep the project suitable for a college mini-project demonstration.

---

# 8. Required Development Workflow

Antigravity must work through the project in the following order.

Do NOT skip ahead.

---

## PHASE 1 — Initialize the Project

Create the project directory:

```text
aws-facevision/
```

Create this structure:

```text
aws-facevision/
│
├── README.md
├── prompt.md
├── .gitignore
│
├── backend/
│   └── lambda/
│       └── face_counter/
│           ├── lambda_function.py
│           ├── requirements.txt
│           └── README.md
│
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── types/
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
│
├── infrastructure/
│   ├── aws-resources.md
│   ├── iam-policies/
│   └── deployment-notes.md
│
└── docs/
    ├── architecture.md
    ├── setup.md
    ├── testing.md
    └── demo-script.md
```

At the beginning, do not fill the entire application with mock code.

Create the structure first.

---

# 9. PHASE 2 — S3 Bucket

Create an S3 bucket for uploaded images.

Requirements:

- Block public access.
- Keep the bucket private.
- Enable encryption using AWS-managed encryption.
- Use a dedicated prefix for incoming images if useful.

Recommended logical structure:

```text
s3://<bucket>/
    uploads/
```

The dashboard should NOT require the bucket itself to become public.

---

# 10. PHASE 3 — Lambda Function

Create a Lambda function:

```text
facevision-face-counter
```

Runtime:

```text
Python 3.x
```

The Lambda function must:

1. Receive the S3 event.
2. Extract bucket name.
3. Extract object key.
4. Decode the S3 object key correctly.
5. Ignore unsupported file types.
6. Call Rekognition `detect_faces`.
7. Count returned face details.
8. Print useful CloudWatch logs.
9. Store the result in DynamoDB.
10. Handle errors cleanly.

Expected logical flow:

```python
event
    ↓
bucket + key
    ↓
validate image
    ↓
Rekognition DetectFaces
    ↓
count faces
    ↓
write CloudWatch logs
    ↓
write DynamoDB record
```

---

# 11. PHASE 4 — IAM

Create the minimum permissions required.

Lambda needs permission to:

- write logs to CloudWatch
- call Rekognition `DetectFaces`
- write result records to DynamoDB

If Lambda needs to read S3 metadata or objects, add only the required S3 permissions.

Prefer least-privilege policies.

Do not blindly attach:

```text
AdministratorAccess
```

or broad:

```text
*
```

permissions.

Document every permission and why it exists.

---

# 12. PHASE 5 — S3 Event Trigger

Configure S3 so that:

```text
ObjectCreated
```

events invoke the Lambda function.

Prefer triggering only for the intended upload path, for example:

```text
uploads/
```

and optionally restrict suffixes to image formats.

Supported formats can include:

```text
.jpg
.jpeg
.png
```

Avoid triggering the function recursively if Lambda writes anything back to the same bucket.

---

# 13. PHASE 6 — Rekognition

Use:

```text
Amazon Rekognition
DetectFaces
```

Do not implement custom computer vision.

Lambda should reference the S3 object directly when calling Rekognition.

Conceptual request:

```python
rekognition.detect_faces(
    Image={
        "S3Object": {
            "Bucket": bucket_name,
            "Name": object_key
        }
    },
    Attributes=["DEFAULT"]
)
```

The number of returned `FaceDetails` entries is the face count.

---

# 14. PHASE 7 — CloudWatch

Every processed image should produce readable logs.

Example:

```text
========================================
FaceVision Image Processing
========================================
Bucket: facevision-images
Image: uploads/team-photo.jpg
Status: SUCCESS
Faces Detected: 6
Processed At: 2026-09-11T10:30:00Z
========================================
```

For failures:

```text
========================================
FaceVision Image Processing
========================================
Status: FAILED
Image: uploads/test.jpg
Error: <error message>
========================================
```

Use structured or clearly formatted logging.

Do not log sensitive data.

---

# 15. PHASE 8 — DynamoDB

Create a table:

```text
facevision-results
```

Recommended primary key:

```text
image_id
```

Store records similar to:

```json
{
  "image_id": "uploads/team-photo.jpg#timestamp",
  "image_name": "team-photo.jpg",
  "s3_key": "uploads/team-photo.jpg",
  "bucket_name": "facevision-images",
  "face_count": 6,
  "status": "SUCCESS",
  "processed_at": "2026-09-11T10:30:00Z"
}
```

For failures:

```json
{
  "image_id": "...",
  "image_name": "bad-file.jpg",
  "status": "FAILED",
  "error_message": "...",
  "processed_at": "..."
}
```

Keep the data model simple.

---

# 16. PHASE 9 — Frontend Dashboard

Create a modern but simple React dashboard.

Do not make it look like an enterprise banking terminal from 2007.

Dashboard title:

**AWS FaceVision**

Subtitle:

**AI-powered image face detection using AWS**

Main sections:

## Summary Cards

Display:

```text
Total Images
Total Faces
Successful
Failed
```

## Recent Images

Display a table/card list:

```text
Image
Status
Faces
Processed At
```

Example:

```text
team-photo.jpg     SUCCESS     6     11 Sep 2026, 10:30
friends.png        SUCCESS     3     11 Sep 2026, 10:26
empty-room.jpg     SUCCESS     0     11 Sep 2026, 10:21
```

## Processing Overview

Provide a simple visual summary of:

- successful processing
- failed processing
- total faces detected

Do not introduce complicated charts unless useful.

---

# 17. Dashboard Upload Feature

Although the original project requires manual S3 upload, the dashboard can include an upload feature later.

For the first version, manual S3 upload remains the authoritative trigger.

Do NOT make the frontend upload feature a prerequisite for completing the AWS pipeline.

The dashboard must work even if images are uploaded manually from the AWS S3 console.

---

# 18. Backend Access for Dashboard

Do not expose DynamoDB credentials in the frontend.

Do not put AWS secret keys in React code.

The frontend must never contain:

```text
AWS_SECRET_ACCESS_KEY
AWS_ACCESS_KEY_ID
```

For a simple student implementation, use:

```text
React Dashboard
       ↓
API Gateway
       ↓
Lambda API
       ↓
DynamoDB
```

This API layer should be added only after the S3 → Lambda → Rekognition pipeline works.

Recommended API endpoints:

```text
GET /results
GET /results/{id}
GET /stats
```

Optional:

```text
POST /upload
```

but manual S3 upload must continue to work.

---

# 19. Recommended Dashboard API Responses

## GET /results

```json
{
  "items": [
    {
      "image_name": "team-photo.jpg",
      "status": "SUCCESS",
      "face_count": 6,
      "processed_at": "2026-09-11T10:30:00Z"
    }
  ]
}
```

## GET /stats

```json
{
  "total_images": 20,
  "total_faces": 63,
  "successful": 19,
  "failed": 1
}
```

---

# 20. Frontend UI Requirements

Use a clean dark/light modern interface.

Suggested layout:

```text
--------------------------------------------------
| AWS FaceVision                                  |
| Image Face Recognition Dashboard                |
--------------------------------------------------

| Total Images | Total Faces | Success | Failed |
--------------------------------------------------

| Processing Overview                             |
|                                                |
--------------------------------------------------

| Recent Processed Images                         |
|                                                |
| Image | Status | Faces | Processed At           |
|                                                |
--------------------------------------------------
```

Keep the UI responsive.

Use reusable components.

Suggested components:

```text
Dashboard
StatsCard
ResultsTable
StatusBadge
ImageResultCard
ProcessingOverview
Navbar
LoadingState
EmptyState
ErrorState
```

---

# 21. API / Service Layer

Create frontend service functions:

```text
services/
    api.ts
    results.ts
```

Do not place fetch calls throughout components.

Use typed interfaces.

Example types:

```ts
export type ProcessingStatus = "SUCCESS" | "FAILED";

export interface ImageResult {
  image_name: string;
  status: ProcessingStatus;
  face_count?: number;
  processed_at: string;
}

export interface DashboardStats {
  total_images: number;
  total_faces: number;
  successful: number;
  failed: number;
}
```

---

# 22. Error Handling

The system must handle:

- invalid file type
- S3 event parsing failure
- Rekognition API failure
- missing S3 object
- permission errors
- DynamoDB failure
- API failure
- empty dashboard state
- slow API response

The UI should show meaningful messages.

Lambda should log useful errors without exposing secrets.

---

# 23. Testing Plan

Test the system using at least these images:

### Test 1 — No faces

Expected:

```text
Faces = 0
```

### Test 2 — One face

Expected:

```text
Faces = 1
```

### Test 3 — Multiple faces

Expected:

```text
Faces = N
```

### Test 4 — Unsupported file

Expected:

```text
Ignored / Failed
```

### Test 5 — Invalid image

Expected:

```text
Failure logged in CloudWatch
```

---

# 24. Acceptance Criteria

The project is considered complete only when all of the following work:

- S3 bucket exists.
- Image can be manually uploaded.
- Upload triggers Lambda automatically.
- Lambda successfully receives S3 event.
- Lambda invokes Rekognition.
- Rekognition detects faces.
- Face count is calculated correctly.
- CloudWatch contains the processing logs.
- DynamoDB contains the processing record.
- Dashboard fetches the results.
- Dashboard displays correct counts.
- Errors are handled cleanly.
- No AWS credentials are exposed in frontend source code.

---

# 25. Documentation Requirements

Create these documents.

## README.md

Include:

- Project overview
- Architecture
- AWS services
- Local setup
- AWS setup
- Running frontend
- Testing
- Deployment
- Cleanup instructions

## docs/architecture.md

Explain:

```text
S3
 ↓
Lambda
 ↓
Rekognition
 ↓
CloudWatch
 ↓
DynamoDB
 ↓
API
 ↓
React
```

## docs/setup.md

Provide exact setup instructions.

## docs/testing.md

Provide test cases and expected results.

## docs/demo-script.md

Write a 3–5 minute viva/demo script.

The demo script should explain:

1. Upload image to S3.
2. S3 triggers Lambda.
3. Lambda calls Rekognition.
4. Rekognition counts faces.
5. Lambda logs result.
6. CloudWatch displays result.
7. DynamoDB stores result.
8. Dashboard displays the result.

---

# 26. Important AWS Cost/Safety Rules

This is a student mini-project.

Avoid unnecessary paid resources.

Do not enable expensive infrastructure without a reason.

Use free-tier-friendly configurations where applicable.

Do not create:

- EC2 instances
- NAT gateways
- RDS
- Kubernetes
- large databases
- unnecessary load balancers

unless explicitly required.

After testing, document which resources should be deleted to avoid unexpected AWS charges.

---

# 27. Git Requirements

Initialize Git.

Recommended branches:

```text
main
dev
```

Use clear commits such as:

```text
init project structure
add lambda face detection
configure s3 trigger
add rekognition integration
add dynamodb persistence
add dashboard
add api integration
add documentation
```

Do not commit:

```text
.env
AWS credentials
access keys
secret keys
```

---

# 28. Environment Configuration

Use `.env` or configuration for local frontend development.

Example:

```env
VITE_API_BASE_URL=
```

Do not put AWS secret keys in frontend environment variables.

Only public configuration may exist in the frontend.

---

# 29. Antigravity Execution Rules

This section is extremely important.

Work in small verified stages.

### Rule 1

Do not jump directly into writing the entire application.

### Rule 2

After each major stage:

1. perform the change
2. run the appropriate test
3. inspect the result
4. report what succeeded
5. report what failed
6. fix failures before continuing

### Rule 3

For AWS configuration, clearly state:

```text
ACTION
EXPECTED RESULT
VERIFICATION
```

before moving to the next stage.

### Rule 4

If an AWS console action is required from the user, stop and provide exact click-by-click instructions.

Do not pretend that an external console action has been completed.

### Rule 5

Do not create fake AWS responses.

Use real AWS resources for the core pipeline.

### Rule 6

Do not replace Rekognition with OpenCV or a local ML model.

### Rule 7

Do not replace CloudWatch with console logs or a local log file.

### Rule 8

Keep the core system working before adding UI polish.

---

# 30. Required Build Order

Follow exactly this order:

```text
1. Create project structure
2. Create S3 bucket
3. Upload a test image manually
4. Create IAM role
5. Create Lambda
6. Test Lambda manually
7. Add Rekognition permission
8. Test Rekognition from Lambda
9. Configure S3 → Lambda trigger
10. Upload image and verify automatic execution
11. Verify CloudWatch logs
12. Create DynamoDB table
13. Store recognition result
14. Verify DynamoDB record
15. Build backend API
16. Build React dashboard
17. Connect dashboard to API
18. Test complete end-to-end flow
19. Write documentation
20. Prepare demo
21. Document AWS cleanup
```

---

# 31. First Task Only

When starting this project, do NOT implement all stages immediately.

Start with:

## Task 1 — Initialize the repository

Create:

```text
aws-facevision/
```

and the directory structure described above.

Then verify that:

- frontend folder exists
- backend folder exists
- infrastructure folder exists
- docs folder exists
- Git is initialized
- `.gitignore` exists

After that, STOP.

Report:

```text
TASK 1 COMPLETE

Created:
- ...
- ...
- ...

Verification:
- ...
```

Then wait for the next instruction.

Do not proceed to AWS resource creation automatically.

---

# 32. Final Project Objective

The final working demonstration should look like this:

```text
User
 │
 │ uploads image manually
 ▼
S3 Bucket
 │
 │ ObjectCreated
 ▼
Lambda
 │
 │ DetectFaces
 ▼
Rekognition
 │
 │ face count
 ├──────────────► CloudWatch
 │
 ▼
DynamoDB
 │
 ▼
API Gateway + Lambda
 │
 ▼
React Dashboard
```

Example final result:

```text
Image: college-group.jpg

Faces Detected: 8

Status: SUCCESS
Processed At: 11 Sep 2026, 10:42 AM
```

The system should be small, reliable, explainable, and actually functional.

Do not over-engineer it just because AWS offers approximately 900 services and appears offended when you only use four of them.
