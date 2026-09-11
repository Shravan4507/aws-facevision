# AWS Cleanup Instructions

To prevent any ongoing storage or request costs after completing your viva or demonstration, run the following CLI commands to remove all project resources.

## Quick Teardown via AWS CLI

```powershell
# 1. Delete S3 Bucket and all uploaded test images
& "C:\Program Files\Amazon\AWSCLIV2\aws.exe" s3 rb s3://facevision-images-663981373457-us-east-1 --force --region us-east-1

# 2. Delete DynamoDB Table
& "C:\Program Files\Amazon\AWSCLIV2\aws.exe" dynamodb delete-table --table-name facevision-results --region us-east-1

# 3. Delete Lambda Functions
& "C:\Program Files\Amazon\AWSCLIV2\aws.exe" lambda delete-function --function-name facevision-face-counter --region us-east-1
& "C:\Program Files\Amazon\AWSCLIV2\aws.exe" lambda delete-function --function-name facevision-api-handler --region us-east-1

# 4. Delete API Gateway HTTP API
& "C:\Program Files\Amazon\AWSCLIV2\aws.exe" apigatewayv2 delete-api --api-id qiokxp5iy2 --region us-east-1

# 5. Delete IAM Execution Role & Policies
& "C:\Program Files\Amazon\AWSCLIV2\aws.exe" iam delete-role-policy --role-name FaceVisionLambdaExecutionRole --policy-name FaceVisionLambdaAccess
& "C:\Program Files\Amazon\AWSCLIV2\aws.exe" iam delete-role --role-name FaceVisionLambdaExecutionRole

# 6. Delete CloudWatch Log Groups
& "C:\Program Files\Amazon\AWSCLIV2\aws.exe" logs delete-log-group --log-group-name "/aws/lambda/facevision-face-counter" --region us-east-1
& "C:\Program Files\Amazon\AWSCLIV2\aws.exe" logs delete-log-group --log-group-name "/aws/lambda/facevision-api-handler" --region us-east-1
```
