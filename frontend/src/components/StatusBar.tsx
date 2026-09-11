import React from 'react';

interface StatusBarProps {
  statusText: string;
  isLive: boolean;
  totalImages: number;
  totalFaces: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  statusText,
  isLive,
  totalImages,
  totalFaces,
}) => {
  return (
    <footer className="win95-statusbar" role="status">
      <div className="status-panel status-main">
        <span className="status-indicator-dot" />
        <span>{statusText}</span>
      </div>

      <div className="status-panel">
        <span>API Gateway: {isLive ? 'ONLINE' : 'PENDING BACKEND'}</span>
      </div>

      <div className="status-panel">
        <span>S3 Prefix: uploads/</span>
      </div>

      <div className="status-panel">
        <span>Images: {totalImages} | Faces: {totalFaces}</span>
      </div>
    </footer>
  );
};
