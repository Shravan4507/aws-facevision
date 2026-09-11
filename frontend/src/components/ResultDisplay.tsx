import React from 'react';
import { ImageResult } from '../types/index.ts';

interface ResultDisplayProps {
  result: ImageResult | null;
  isProcessing: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isProcessing }) => {
  return (
    <fieldset className="win95-fieldset">
      <legend className="win95-legend">Step 2: Amazon Rekognition Result</legend>

      {isProcessing ? (
        <div className="empty-results-box">
          <div className="win95-hourglass" aria-hidden="true">⏳</div>
          <p>
            <strong>Communicating with AWS Pipeline...</strong>
          </p>
          <p className="retro-sub">
            API Gateway → Lambda → Amazon Rekognition DetectFaces → DynamoDB
          </p>
        </div>
      ) : !result ? (
        <div className="empty-results-box">
          <span className="retro-icon" aria-hidden="true">📷</span>
          <p>
            <strong>No image analyzed yet.</strong>
          </p>
          <p className="retro-sub">
            Drag and drop an image above to run real-time facial recognition.
          </p>
        </div>
      ) : (
        <div className="active-result-box">
          <div className="digital-counter-panel">
            <div className="digital-label">TOTAL FACES DETECTED</div>
            <div className={`digital-readout ${result.status === 'FAILED' ? 'readout-error' : ''}`}>
              {result.status === 'FAILED' ? 'ERR' : String(result.face_count ?? 0).padStart(2, '0')}
            </div>
            <div className="digital-subtext">
              {result.status === 'SUCCESS'
                ? result.face_count === 1
                  ? '1 Human Face Detected'
                  : `${result.face_count} Human Faces Detected`
                : 'Detection Failed or Corrupt Image'}
            </div>
          </div>

          <div className="result-details-grid">
            <div className="detail-row">
              <span className="detail-title">File Name:</span>
              <span className="detail-data">{result.image_name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-title">S3 Location:</span>
              <span className="detail-data">{result.s3_key}</span>
            </div>
            <div className="detail-row">
              <span className="detail-title">Status:</span>
              <span className={`status-badge-retro ${result.status === 'SUCCESS' ? 'badge-ok' : 'badge-err'}`}>
                {result.status}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-title">Processed At:</span>
              <span className="detail-data">{new Date(result.processed_at).toLocaleString()}</span>
            </div>

            {result.error_message && (
              <div className="detail-row error-row">
                <span className="detail-title">Error Message:</span>
                <span className="detail-data text-danger">{result.error_message}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </fieldset>
  );
};
