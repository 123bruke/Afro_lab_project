import React from 'react';
import { ContextTimelineEvent } from '../../types/contextflow';

interface ContextTimelineProps {
  events: ContextTimelineEvent[];
}

export const ContextTimeline: React.FC<ContextTimelineProps> = ({ events }) => {
  return (
    <div className="border border-zinc-800 bg-zinc-900/40 rounded-md divide-y divide-zinc-800/70 font-mono text-xs tabular-nums">
      {events.map((ev) => (
        <div
          key={ev.id}
          className="px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 hover:bg-zinc-900/70 transition-colors duration-100"
        >
          <div className="flex items-baseline gap-3 min-w-0">
            <span className="text-zinc-500 shrink-0">{ev.timestamp}</span>
            <div className="min-w-0">
              <span className="text-zinc-200 font-medium">{ev.title}</span>
              {ev.detail && (
                <div className="text-[11px] text-zinc-400 mt-0.5 truncate">
                  {ev.detail}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-zinc-500 shrink-0 sm:ml-4">
            {ev.tokensSaved && (
              <span className="text-emerald-400">
                {ev.tokensSaved.toLocaleString()} tokens saved
              </span>
            )}
            {ev.latencyMs !== undefined && <span>{ev.latencyMs}ms</span>}
          </div>
        </div>
      ))}
    </div>
  );
};
