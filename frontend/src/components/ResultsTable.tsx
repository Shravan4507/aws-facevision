import React, { useState } from 'react';
import { ImageResult, ProcessingStatus } from '../types/index.ts';
import { StatusBadge } from './StatusBadge.tsx';

interface ResultsTableProps {
  results: ImageResult[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  const [filter, setFilter] = useState<'ALL' | ProcessingStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResults = results.filter((item) => {
    const matchesFilter = filter === 'ALL' || item.status === filter;
    const matchesSearch =
      item.image_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.s3_key.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <section className="results-section" aria-labelledby="results-table-title">
      <div className="results-header">
        <div>
          <h2 id="results-table-title" className="results-title">
            Recent Processed Images
          </h2>
          <p className="results-subtitle">
            Showing {filteredResults.length} of {results.length} total processed events
          </p>
        </div>

        <div className="table-controls">
          <div className="search-box">
            <input
              id="input-search-images"
              type="text"
              placeholder="Filter by image name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search processed images"
            />
          </div>

          <div className="filter-buttons" role="tablist" aria-label="Filter status">
            <button
              id="btn-filter-all"
              className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilter('ALL')}
            >
              All ({results.length})
            </button>
            <button
              id="btn-filter-success"
              className={`filter-btn ${filter === 'SUCCESS' ? 'active' : ''}`}
              onClick={() => setFilter('SUCCESS')}
            >
              Success ({results.filter((r) => r.status === 'SUCCESS').length})
            </button>
            <button
              id="btn-filter-failed"
              className={`filter-btn ${filter === 'FAILED' ? 'active' : ''}`}
              onClick={() => setFilter('FAILED')}
            >
              Failed ({results.filter((r) => r.status === 'FAILED').length})
            </button>
          </div>
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <div className="empty-filter-state">
          <p>No images match your current filter or search criteria.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="results-table">
            <thead>
              <tr>
                <th scope="col">Image Name</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-center">Faces Detected</th>
                <th scope="col">Processed At</th>
                <th scope="col">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((item) => (
                <tr key={item.image_id} className="table-row">
                  <td className="cell-image-name">
                    <div className="image-name-wrapper">
                      <span className="file-icon" aria-hidden="true">🖼️</span>
                      <div>
                        <div className="primary-name">{item.image_name}</div>
                        <div className="secondary-key">{item.s3_key}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="text-center">
                    {item.status === 'SUCCESS' ? (
                      <span className="face-count-pill">
                        <strong>{item.face_count ?? 0}</strong> {item.face_count === 1 ? 'face' : 'faces'}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="cell-date">{formatDate(item.processed_at)}</td>
                  <td className="cell-details">
                    {item.error_message ? (
                      <span className="error-note" title={item.error_message}>
                        {item.error_message}
                      </span>
                    ) : (
                      <span className="success-note">Analyzed by Rekognition</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
