import React from 'react';

interface NavbarProps {
  onResetSession: () => void;
  isLive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onResetSession, isLive }) => {
  return (
    <header className="win95-titlebar">
      <div className="titlebar-left">
        <span className="titlebar-icon" aria-hidden="true">👁️</span>
        <h1 className="titlebar-text">
          AWS FaceVision 98 — [{isLive ? 'API Gateway Connected' : 'Offline / Setup Mode'}]
        </h1>
      </div>

      <div className="titlebar-controls">
        <button
          className="win95-btn-ctrl"
          title="Minimize"
          aria-label="Minimize Window"
          onClick={() => {}}
        >
          _
        </button>
        <button
          className="win95-btn-ctrl"
          title="Maximize"
          aria-label="Maximize Window"
          onClick={() => {}}
        >
          □
        </button>
        <button
          className="win95-btn-ctrl btn-close"
          title="Reset / Clear Session"
          aria-label="Close"
          onClick={onResetSession}
        >
          ✕
        </button>
      </div>
    </header>
  );
};
