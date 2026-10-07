import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  sublabel,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`border border-zinc-800 bg-zinc-900/50 rounded-md px-4 py-3 transition-colors duration-150 ${
        onClick ? 'cursor-pointer hover:border-zinc-700 hover:bg-zinc-900' : ''
      }`}
    >
      <div className="text-xs font-medium text-zinc-400 truncate">{label}</div>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <span className="text-xl font-semibold tracking-tight text-zinc-100 font-mono tabular-nums">
          {value}
        </span>
        {sublabel && (
          <span className="text-xs text-zinc-500 font-mono tabular-nums truncate">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
