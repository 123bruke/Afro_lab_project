import React from 'react';

interface LoadingStateProps {
  rows?: number;
  label?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  rows = 4,
  label = 'Synchronizing local context engine...',
}) => {
  return (
    <div className="space-y-2 py-2" aria-busy="true" aria-live="polite">
      <div className="text-xs font-mono text-zinc-500 mb-3">{label}</div>
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="h-10 border border-zinc-800/70 bg-zinc-900/40 rounded-sm px-4 flex items-center justify-between animate-pulse"
        >
          <div className="h-2.5 bg-zinc-800 rounded-sm w-1/3" />
          <div className="h-2.5 bg-zinc-800 rounded-sm w-20" />
        </div>
      ))}
    </div>
  );
};
