import React, { useState } from 'react';

interface MenuBarProps {
  onBrowseClick: () => void;
  onClear: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({ onBrowseClick, onClear }) => {
  const [activeDialog, setActiveDialog] = useState<'about' | 'pipeline' | null>(null);

  return (
    <>
      <nav className="win95-menubar" aria-label="System Menu">
        <div className="menu-item" onClick={onBrowseClick} role="button" tabIndex={0}>
          <u>F</u>ile
        </div>
        <div className="menu-item" onClick={onClear} role="button" tabIndex={0}>
          <u>C</u>lear
        </div>
        <div
          className="menu-item"
          onClick={() => setActiveDialog('pipeline')}
          role="button"
          tabIndex={0}
        >
          <u>P</u>ipeline
        </div>
        <div
          className="menu-item"
          onClick={() => setActiveDialog('about')}
          role="button"
          tabIndex={0}
        >
          <u>H</u>elp
        </div>
      </nav>

      {/* Retro Alert Modals */}
      {activeDialog === 'about' && (
        <div className="retro-modal-overlay" onClick={() => setActiveDialog(null)}>
          <div className="retro-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="win95-titlebar">
              <span className="titlebar-text">About AWS FaceVision 98</span>
              <button className="win95-btn-ctrl btn-close" onClick={() => setActiveDialog(null)}>✕</button>
            </div>
            <div className="dialog-body">
              <div className="dialog-icon">ℹ️</div>
              <div className="dialog-text">
                <strong>AWS FaceVision v1.0 (Build 1998.09)</strong>
                <p>Event-Driven Cloud Face Detection Pipeline</p>
                <hr className="retro-hr" />
                <p>Components: Amazon S3, AWS Lambda, Amazon Rekognition, Amazon DynamoDB, API Gateway.</p>
              </div>
            </div>
            <div className="dialog-actions">
              <button className="win95-btn" onClick={() => setActiveDialog(null)}>OK</button>
            </div>
          </div>
        </div>
      )}

      {activeDialog === 'pipeline' && (
        <div className="retro-modal-overlay" onClick={() => setActiveDialog(null)}>
          <div className="retro-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="win95-titlebar">
              <span className="titlebar-text">AWS Pipeline Architecture</span>
              <button className="win95-btn-ctrl btn-close" onClick={() => setActiveDialog(null)}>✕</button>
            </div>
            <div className="dialog-body">
              <div className="dialog-text">
                <p><strong>Architecture Topology:</strong></p>
                <div className="retro-code-box">
                  User Upload → S3 Bucket (uploads/)<br />
                  &nbsp;&nbsp;↓ ObjectCreated Event<br />
                  AWS Lambda (face_counter)<br />
                  &nbsp;&nbsp;↓ DetectFaces<br />
                  Amazon Rekognition<br />
                  &nbsp;&nbsp;↓ Face Count &amp; Metadata<br />
                  CloudWatch Logs + DynamoDB<br />
                  &nbsp;&nbsp;↓ REST API<br />
                  API Gateway → UI
                </div>
              </div>
            </div>
            <div className="dialog-actions">
              <button className="win95-btn" onClick={() => setActiveDialog(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
