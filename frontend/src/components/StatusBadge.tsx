import React from 'react';
import { ProcessingStatus } from '../types/index.ts';

interface StatusBadgeProps {
  status: ProcessingStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isSuccess = status === 'SUCCESS';

  return (
    <span className={`status-badge ${isSuccess ? 'badge-success' : 'badge-failed'}`} role="status">
      <span className="badge-dot" aria-hidden="true" />
      <span className="badge-text">{status}</span>
    </span>
  );
};
