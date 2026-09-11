import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="state-container loading-state" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p className="state-message">Loading FaceVision records from AWS...</p>
    </div>
  );
};
