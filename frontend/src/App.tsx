import React from 'react';

export const App: React.FC = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>AWS FaceVision</h1>
      <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
        AI-powered image face detection using AWS
      </p>
    </div>
  );
};

export default App;
