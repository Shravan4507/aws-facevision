# AWS Deployment Notes

## Best Practices
1. **Never commit secrets**: Do not place AWS Access Keys or Secrets anywhere in source control.
2. **Least Privilege**: Grant IAM permissions specifically for needed ARNs and actions.
3. **Resource Naming**: S3 bucket names must be globally unique. Use a personal suffix (e.g. `facevision-images-<yourname>-2026`).
4. **Idempotency**: Ensure Lambda handles duplicate S3 events without breaking or generating infinite recursion.
