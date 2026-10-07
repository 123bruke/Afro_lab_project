import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Pin } from 'lucide-react';
import { MemoryItem } from '../../types/contextflow';

interface ContextItemProps {
  memory: MemoryItem;
  onTogglePin?: (id: string) => void;
}

export const ContextItem: React.FC<ContextItemProps> = ({ memory, onTogglePin }) => {
  const [expanded, setExpanded] = useState(false);
  const matchScore = memory.relevanceMatch ?? memory.importance;

  return (
    <div className="border border-zinc-800 bg-zinc-900/40 rounded-sm transition-colors duration-150 hover:border-zinc-700/80">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-3 py-2 flex items-center justify-between gap-2 text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" aria-hidden="true" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" aria-hidden="true" />
          )}
          <span className="text-xs font-medium text-zinc-200 truncate">
            {memory.title}
          </span>
        </div>
        <span className="text-xs font-mono tabular-nums text-sky-400 shrink-0">
          {matchScore}% match
        </span>
      </button>

      {expanded && (
        <div className="px-3 pb-2.5 pt-1 border-t border-zinc-800/80 text-xs space-y-2">
          <p className="font-mono text-[11px] text-zinc-300 leading-relaxed bg-zinc-950 p-2 rounded-xs border border-zinc-800/70">
            {memory.content}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-400 tabular-nums">
            <div className="flex flex-wrap items-center gap-1.5">
              <span>{memory.category}</span>
              <span aria-hidden="true">·</span>
              <span>{memory.source}</span>
              <span aria-hidden="true">·</span>
              <span>{memory.lastAccessed}</span>
            </div>

            {onTogglePin && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(memory.id);
                }}
                aria-label={memory.pinned ? 'Unpin memory' : 'Pin memory'}
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs border transition-colors ${
                  memory.pinned
                    ? 'border-sky-500/40 text-sky-400 bg-sky-950/30'
                    : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Pin className="w-3 h-3" aria-hidden="true" />
                <span>{memory.pinned ? 'Pinned' : 'Pin'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
