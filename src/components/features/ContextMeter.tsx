import React from 'react';

interface ContextMeterProps {
  usedTokens: number;
  maxTokens: number;
}

export const ContextMeter: React.FC<ContextMeterProps> = ({
  usedTokens,
  maxTokens,
}) => {
  const pct = Math.min(100, Math.round((usedTokens / Math.max(1, maxTokens)) * 100));
  const totalBlocks = 19;
  const filledBlocks = Math.round((pct / 100) * totalBlocks);
  const asciiBar =
    '█'.repeat(filledBlocks) + '░'.repeat(Math.max(0, totalBlocks - filledBlocks));

  const barColor =
    pct >= 85 ? 'text-rose-400' : pct >= 70 ? 'text-sky-400' : 'text-emerald-400';

  return (
    <div className="border border-zinc-800 bg-zinc-900/50 rounded-sm p-3">
      <div className="flex items-center justify-between text-xs font-mono tabular-nums">
        <span className="text-zinc-200 font-semibold">
          {usedTokens.toLocaleString()} / {maxTokens.toLocaleString()} tokens
        </span>
        <span className="text-zinc-400">{pct}%</span>
      </div>
      <div className="mt-2 flex items-center justify-between font-mono text-xs tabular-nums">
        <span className={`tracking-tighter select-none ${barColor}`} aria-hidden="true">
          {asciiBar}
        </span>
        <span className="text-zinc-300 font-medium">{pct}%</span>
      </div>
    </div>
  );
};
