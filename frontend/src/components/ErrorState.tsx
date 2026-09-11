import React from 'react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="state-container error-state" role="alert">
      <div className="error-icon" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="state-title">Failed to Load Pipeline Data</h3>
      <p className="state-message">{message}</p>
      {onRetry && (
        <button id="btn-retry-error" className="retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};
