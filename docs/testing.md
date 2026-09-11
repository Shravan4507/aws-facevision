# Testing & Verification Plan

## Test Scenarios

### Test 1 — Zero Faces (Landscape / Object)
- **Input**: Image with no people (e.g. landscape or object).
- **Expected Outcome**: Rekognition returns 0 faces; DynamoDB record shows `face_count: 0`, status `SUCCESS`.

### Test 2 — Single Face (Portrait)
- **Input**: Portrait photo of one person.
- **Expected Outcome**: Rekognition detects 1 face; DynamoDB record shows `face_count: 1`, status `SUCCESS`.

### Test 3 — Multiple Faces (Group Photo)
- **Input**: Group photo with N people.
- **Expected Outcome**: Rekognition detects N faces; DynamoDB record shows `face_count: N`, status `SUCCESS`.

### Test 4 — Unsupported File Format
- **Input**: `.pdf` or `.txt` file uploaded to `uploads/`.
- **Expected Outcome**: Lambda identifies non-image extension, logs warning, skips Rekognition call without crashing.

### Test 5 — Corrupted or Invalid Image
- **Input**: Broken image file.
- **Expected Outcome**: Lambda catches exception, logs structured error in CloudWatch, writes `FAILED` status record to DynamoDB.
