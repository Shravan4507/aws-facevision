import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  onProcessImage: (file: File) => void;
  isProcessing: boolean;
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onProcessImage,
  isProcessing,
  selectedFile,
  onSelectFile,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      alert('Invalid file format. Please upload a .JPG, .JPEG, or .PNG image.');
      return;
    }
    onSelectFile(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;

  return (
    <fieldset className="win95-fieldset">
      <legend className="win95-legend">Step 1: Upload / Drop Target Image</legend>

      <input
        ref={fileInputRef}
        type="file"
        id="file-input"
        accept="image/jpeg,image/png,image/jpg"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {!selectedFile ? (
        <div
          className={`dropzone-sunken ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Drag and drop image here or click to browse"
        >
          <div className="dropzone-content">
            <span className="retro-icon-large" aria-hidden="true">💾</span>
            <p className="dropzone-primary-text">
              <strong>Drag &amp; Drop Image Here</strong>
            </p>
            <p className="dropzone-subtext">Supported formats: .JPG, .JPEG, .PNG</p>
            <div style={{ marginTop: '0.75rem' }}>
              <button
                type="button"
                className="win95-btn btn-browse"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                📁 Browse File...
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="file-preview-card">
          <div className="preview-layout">
            <div className="preview-image-well">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Selected upload preview"
                  className="preview-img"
                />
              )}
            </div>

            <div className="preview-metadata">
              <div className="metadata-row">
                <span className="metadata-label">File:</span>
                <span className="metadata-value">{selectedFile.name}</span>
              </div>
              <div className="metadata-row">
                <span className="metadata-label">Size:</span>
                <span className="metadata-value">{formatFileSize(selectedFile.size)}</span>
              </div>
              <div className="metadata-row">
                <span className="metadata-label">Type:</span>
                <span className="metadata-value">{selectedFile.type || 'image/jpeg'}</span>
              </div>
              <div className="metadata-row">
                <span className="metadata-label">Target:</span>
                <span className="metadata-value">s3://uploads/{selectedFile.name}</span>
              </div>

              {isProcessing && (
                <div className="processing-progress-box">
                  <span className="progress-label">Sending to AWS &amp; analyzing faces...</span>
                  <div className="win95-progress">
                    <div className="win95-progress-block" />
                    <div className="win95-progress-block" />
                    <div className="win95-progress-block" />
                    <div className="win95-progress-block" />
                    <div className="win95-progress-block" />
                    <div className="win95-progress-block" />
                  </div>
                </div>
              )}

              <div className="preview-actions">
                <button
                  type="button"
                  className="win95-btn btn-primary"
                  onClick={() => onProcessImage(selectedFile)}
                  disabled={isProcessing}
                >
                  {isProcessing ? '⏳ Processing on AWS...' : '⚡ Detect Faces via AWS'}
                </button>
                <button
                  type="button"
                  className="win95-btn"
                  onClick={() => onSelectFile(null)}
                  disabled={isProcessing}
                >
                  ✕ Choose Another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </fieldset>
  );
};
