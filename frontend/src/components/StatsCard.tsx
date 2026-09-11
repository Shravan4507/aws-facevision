import React from 'react';

interface StatsCardProps {
  id: string;
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accentVariant: 'primary' | 'success' | 'failed' | 'purple';
  helperText?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  id,
  label,
  value,
  icon,
  accentVariant,
  helperText,
}) => {
  return (
    <div id={id} className={`stats-card card-accent-${accentVariant}`}>
      <div className="stats-card-header">
        <span className="stats-card-label">{label}</span>
        <div className="stats-card-icon" aria-hidden="true">
          {icon}
        </div>
      </div>
      <div className="stats-card-value">{value}</div>
      {helperText && <div className="stats-card-helper">{helperText}</div>}
    </div>
  );
};
