import React from 'react';
import { DashboardStats } from '../types/index.ts';

interface ProcessingOverviewProps {
  stats: DashboardStats;
}

export const ProcessingOverview: React.FC<ProcessingOverviewProps> = ({ stats }) => {
  const successRate =
    stats.total_images > 0
      ? Math.round((stats.successful / stats.total_images) * 100)
      : 0;

  const avgFaces =
    stats.successful > 0
      ? (stats.total_faces / stats.successful).toFixed(1)
      : '0';

  const successPercent = stats.total_images > 0 ? (stats.successful / stats.total_images) * 100 : 0;
  const failedPercent = stats.total_images > 0 ? (stats.failed / stats.total_images) * 100 : 0;

  return (
    <section className="overview-section" aria-labelledby="overview-title">
      <div className="overview-header">
        <div>
          <h2 id="overview-title" className="overview-title">Processing Overview</h2>
          <p className="overview-subtitle">Real-time pipeline analytics & throughput health</p>
        </div>

        <div className="pipeline-pills" aria-label="Event-driven Pipeline Architecture">
          <span className="pipeline-step">S3 Bucket</span>
          <span className="pipeline-arrow" aria-hidden="true">→</span>
          <span className="pipeline-step">AWS Lambda</span>
          <span className="pipeline-arrow" aria-hidden="true">→</span>
          <span className="pipeline-step">Rekognition</span>
          <span className="pipeline-arrow" aria-hidden="true">→</span>
          <span className="pipeline-step">DynamoDB</span>
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-metric">
          <span className="metric-label">Pipeline Success Rate</span>
          <div className="metric-value-row">
            <span className="metric-highlight">{successRate}%</span>
            <span className="metric-caption">of images processed without error</span>
          </div>
          <div className="ratio-bar-container" title={`Success: ${stats.successful}, Failed: ${stats.failed}`}>
            <div
              className="ratio-bar-success"
              style={{ width: `${successPercent}%` }}
              aria-label={`Success: ${stats.successful}`}
            />
            <div
              className="ratio-bar-failed"
              style={{ width: `${failedPercent}%` }}
              aria-label={`Failed: ${stats.failed}`}
            />
          </div>
        </div>

        <div className="overview-metric">
          <span className="metric-label">Avg. Faces Detected per Successful Image</span>
          <div className="metric-value-row">
            <span className="metric-highlight">{avgFaces}</span>
            <span className="metric-caption">faces / image average</span>
          </div>
          <p className="metric-note">
            Powered by Amazon Rekognition DetectFaces API
          </p>
        </div>
      </div>
    </section>
  );
};
