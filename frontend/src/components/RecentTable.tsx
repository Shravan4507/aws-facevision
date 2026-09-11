import React from 'react';
import { ImageResult } from '../types/index.ts';

interface RecentTableProps {
  results: ImageResult[];
  onSelectResult: (result: ImageResult) => void;
  selectedResultId?: string;
}

export const RecentTable: React.FC<RecentTableProps> = ({
  results,
  onSelectResult,
  selectedResultId,
}) => {
  return (
    <fieldset className="win95-fieldset">
      <legend className="win95-legend">Session History &amp; Cloud Records</legend>

      <div className="listview-container">
        {results.length === 0 ? (
          <div className="empty-history-text">
            <span>(No images processed yet. Upload an image above to record face counts.)</span>
          </div>
        ) : (
          <table className="win95-table">
            <thead>
              <tr>
                <th style={{ width: '35%' }}>Image File</th>
                <th style={{ width: '15%' }}>Status</th>
                <th style={{ width: '15%' }}>Faces</th>
                <th style={{ width: '35%' }}>Processed At</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item) => {
                const isSelected = item.image_id === selectedResultId;
                return (
                  <tr
                    key={item.image_id}
                    className={`table-row-retro ${isSelected ? 'row-selected' : ''}`}
                    onClick={() => onSelectResult(item)}
                  >
                    <td>
                      <span className="file-icon-retro">🖼️</span>
                      {item.image_name}
                    </td>
                    <td>
                      <span
                        className={`status-indicator ${
                          item.status === 'SUCCESS' ? 'indicator-ok' : 'indicator-err'
                        }`}
                      >
                        ● {item.status}
                      </span>
                    </td>
                    <td>
                      <strong>
                        {item.status === 'SUCCESS' ? item.face_count ?? 0 : '—'}
                      </strong>
                    </td>
                    <td>{new Date(item.processed_at).toLocaleTimeString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </fieldset>
  );
};
