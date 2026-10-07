import React from 'react';

interface TaskProgressProps {
  progress: number;
  size?: 'sm' | 'md';
  showAscii?: boolean;
  label?: string;
}

export const TaskProgress: React.FC<TaskProgressProps> = ({
  progress,
  size = 'md',
  showAscii = false,
  label,
}) => {
  const clamped = Math.max(0, Math.min(100, progress));
  const totalBlocks = 20;
  const filledBlocks = Math.round((clamped / 100) * totalBlocks);
  const asciiBar =
    '█'.repeat(filledBlocks) + '░'.repeat(Math.max(0, totalBlocks - filledBlocks));

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-zinc-300 font-medium truncate">{label}</span>
          <span className="font-mono tabular-nums text-zinc-400">{clamped}%</span>
        </div>
      )}
      {showAscii ? (
        <div className="flex items-center gap-2 font-mono text-xs tabular-nums text-zinc-300">
          <span className="tracking-tighter text-sky-400/90 select-none" aria-hidden="true">
            {asciiBar}
          </span>
          <span className="text-zinc-400">{clamped}%</span>
        </div>
      ) : (
        <div className="flex items-center gap-2.5">
          <div
            className={`flex-1 bg-zinc-800 rounded-xs overflow-hidden ${
              size === 'sm' ? 'h-1.5' : 'h-2'
            }`}
            role="progressbar"
            aria-valuenow={clamped}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-sky-500 transition-transform duration-150 origin-left"
              style={{ transform: `scaleX(${clamped / 100})` }}
            />
          </div>
          {!label && (
            <span className="text-xs font-mono tabular-nums text-zinc-400 w-9 text-right shrink-0">
              {clamped}%
            </span>
          )}
        </div>
      )}
    </div>
  );
};
