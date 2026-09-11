# GitHub Actions Setup for Lambda Auto-Deployment

Our workflow [`.github/workflows/deploy-lambda.yml`](../.github/workflows/deploy-lambda.yml) automatically updates both AWS Lambda functions whenever you push code changes to GitHub.

## Required GitHub Repository Secrets

To allow GitHub Actions to update your Lambdas securely:

1. Open your repository on GitHub: [github.com/Shravan4507/aws-facevision](https://github.com/Shravan4507/aws-facevision)
2. Go to **Settings** → **Secrets and variables** → **Actions**.
3. Under **Repository secrets**, click **New repository secret** and add:

| Secret Name | Value | Description |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | `AKIA...` | Your AWS IAM User Access Key |
| `AWS_SECRET_ACCESS_KEY` | `wJalrX...` | Your AWS IAM User Secret Key |

*(The workflow already defaults to region `us-east-1`).*

## How It Works
- Whenever code in `backend/lambda/` is pushed to `main` or `dev`, GitHub Actions triggers.
- It packages `lambda_function.py` into a zip file and executes `aws lambda update-function-code` on both `facevision-face-counter` and `facevision-api-handler`.
- You can also manually trigger the deployment from the **Actions** tab on GitHub via **Run workflow**.
