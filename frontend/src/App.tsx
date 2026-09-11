import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { MenuBar } from './components/MenuBar.tsx';
import { ImageUploader } from './components/ImageUploader.tsx';
import { ResultDisplay } from './components/ResultDisplay.tsx';
import { RecentTable } from './components/RecentTable.tsx';
import { StatusBar } from './components/StatusBar.tsx';
import { isLiveApiConfigured } from './services/api.ts';
import { uploadImageToBackend, fetchResults } from './services/results.ts';
import { ImageResult } from './types/index.ts';

export const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeResult, setActiveResult] = useState<ImageResult | null>(null);
  const [sessionResults, setSessionResults] = useState<ImageResult[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Ready');
  const [notice, setNotice] = useState<string | null>(null);

  const isLive = isLiveApiConfigured();

  // Load existing records if live API Gateway is configured (starts empty otherwise: zero placeholders)
  const loadInitialData = useCallback(async () => {
    if (isLive) {
      try {
        const liveItems = await fetchResults();
        setSessionResults(liveItems);
      } catch {
        // Handled silently
      }
    }
  }, [isLive]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleProcessImage = async (file: File) => {
    setIsProcessing(true);
    setStatusMessage('Uploading to AWS S3 via API Gateway & running Rekognition...');
    setNotice(null);

    if (isLive) {
      try {
        const result = await uploadImageToBackend(file);
        setActiveResult(result);
        setSessionResults((prev) => [result, ...prev]);
        setStatusMessage(`Face detection complete: ${result.face_count ?? 0} face(s) found.`);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'API Gateway communication failure';
        setStatusMessage('Error during AWS processing.');
        const failedResult: ImageResult = {
          image_id: `upload-${Date.now()}`,
          image_name: file.name,
          s3_key: `uploads/${file.name}`,
          status: 'FAILED',
          error_message: errMsg,
          processed_at: new Date().toISOString(),
        };
        setActiveResult(failedResult);
        setSessionResults((prev) => [failedResult, ...prev]);
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Backend is not yet deployed - show realistic demo notification
      // Simulate real-world network latency (1.2s)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const detectedFaces = Math.floor(Math.random() * 5) + 1; // 1 to 5 faces for local verification
      const previewResult: ImageResult = {
        image_id: `demo-${Date.now()}`,
        image_name: file.name,
        s3_key: `uploads/${file.name}`,
        bucket_name: 'facevision-images-dev',
        status: 'SUCCESS',
        face_count: detectedFaces,
        processed_at: new Date().toISOString(),
      };

      setActiveResult(previewResult);
      setSessionResults((prev) => [previewResult, ...prev]);
      setIsProcessing(false);
      setStatusMessage(`Complete: ${detectedFaces} face(s) identified.`);
      setNotice(
        'UI Preview Mode: Local upload validated! Once we deploy the AWS backend (S3, Lambda, Rekognition, API Gateway), real cloud results will populate here.'
      );
    }
  };

  const handleClearSession = () => {
    setSelectedFile(null);
    setActiveResult(null);
    setSessionResults([]);
    setStatusMessage('Session cleared. Ready.');
    setNotice(null);
  };

  const totalFaces = sessionResults.reduce(
    (sum, r) => sum + (r.status === 'SUCCESS' ? r.face_count || 0 : 0),
    0
  );

  return (
    <div className="retro-desktop">
      {/* 90s Desktop Icons */}
      <div className="desktop-icons-column" aria-hidden="true">
        <div className="desktop-icon-item" title="My Computer">
          <div className="icon-graphic">💻</div>
          <span className="icon-title">My Computer</span>
        </div>
        <div className="desktop-icon-item" title="AWS Cloud">
          <div className="icon-graphic">☁️</div>
          <span className="icon-title">AWS Cloud</span>
        </div>
        <div className="desktop-icon-item" title="FaceVision 98">
          <div className="icon-graphic icon-active">👁️</div>
          <span className="icon-title">FaceVision 98</span>
        </div>
        <div className="desktop-icon-item" title="Recycle Bin">
          <div className="icon-graphic">🗑️</div>
          <span className="icon-title">Recycle Bin</span>
        </div>
      </div>

      {/* Main Windows 95 Window Frame */}
      <main className="win95-window" role="main">
        <Navbar onResetSession={handleClearSession} isLive={isLive} />
        <MenuBar
          onBrowseClick={() => {
            const input = document.getElementById('file-input') as HTMLInputElement;
            if (input) input.click();
          }}
          onClear={handleClearSession}
        />

        {notice && (
          <div className="win95-alert-bar" role="alert">
            <span className="alert-symbol">💡</span>
            <span>{notice}</span>
          </div>
        )}

        <div className="win95-window-body">
          {/* Main 2-column workspace */}
          <div className="workspace-columns">
            <div className="workspace-col-left">
              <ImageUploader
                onProcessImage={handleProcessImage}
                isProcessing={isProcessing}
                selectedFile={selectedFile}
                onSelectFile={(f) => {
                  setSelectedFile(f);
                  if (!f) setActiveResult(null);
                }}
              />
            </div>

            <div className="workspace-col-right">
              <ResultDisplay result={activeResult} isProcessing={isProcessing} />
            </div>
          </div>

          {/* Session History Table (Starts strictly empty without fake placeholders) */}
          <div className="workspace-row-full">
            <RecentTable
              results={sessionResults}
              onSelectResult={(item) => setActiveResult(item)}
              selectedResultId={activeResult?.image_id}
            />
          </div>
        </div>

        <StatusBar
          statusText={statusMessage}
          isLive={isLive}
          totalImages={sessionResults.length}
          totalFaces={totalFaces}
        />
      </main>
    </div>
  );
};

export default App;
