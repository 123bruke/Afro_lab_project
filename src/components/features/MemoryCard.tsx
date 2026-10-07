import React, { useState } from 'react';
import { Pin, Pencil, Trash2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { MemoryCategory, MemoryItem } from '../../types/contextflow';

interface MemoryCardProps {
  memory: MemoryItem;
  onPin: (id: string) => void;
  onEdit: (memory: MemoryItem) => void;
  onDelete: (id: string) => void;
  onCopyId: (id: string) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onPin,
  onEdit,
  onDelete,
  onCopyId,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(memory.id).catch(() => {});
    }
    setCopied(true);
    onCopyId(memory.id);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`border rounded-xl p-3.5 sm:p-4 transition-all duration-200 backdrop-blur-md ${
        memory.pinned
          ? 'border-sky-500/40 bg-zinc-900/80 shadow-lg shadow-sky-500/10'
          : 'border-white/10 bg-white/5 hover:border-white/20'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-semibold text-zinc-100 truncate">
              {memory.title}
            </h3>
            {memory.pinned && (
              <span className="text-[11px] font-mono text-sky-400 shrink-0">
                · Pinned
              </span>
            )}
          </div>
          <p
            className={`mt-1.5 font-mono text-xs text-zinc-300 leading-relaxed ${
              isExpanded ? '' : 'line-clamp-2'
            }`}
          >
            {memory.content}
          </p>
        </div>

        {/* Actions: Pin, Edit, Delete, Copy ID */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onPin(memory.id)}
            aria-label={memory.pinned ? 'Unpin memory' : 'Pin memory'}
            title={memory.pinned ? 'Unpin memory' : 'Pin memory'}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
              memory.pinned
                ? 'border-sky-400/80 bg-sky-500/20 text-sky-200'
                : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-white/20'
            }`}
          >
            <Pin className="w-3 h-3" aria-hidden="true" />
            <span>Pin</span>
          </button>

          <button
            type="button"
            onClick={() => onEdit(memory)}
            aria-label={`Edit ${memory.title}`}
            title="Edit memory"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono text-zinc-400 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Pencil className="w-3 h-3" aria-hidden="true" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(memory.id)}
            aria-label={`Delete ${memory.title}`}
            title="Delete memory"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono text-zinc-400 hover:text-rose-400 bg-white/5 border border-white/10 hover:border-rose-400/40 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Trash2 className="w-3 h-3" aria-hidden="true" />
            <span>Delete</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Copy memory ID ${memory.id}`}
            title={`Copy ID (${memory.id})`}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono text-zinc-400 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-400" aria-hidden="true" />
            ) : (
              <Copy className="w-3 h-3" aria-hidden="true" />
            )}
            <span>{copied ? 'Copied' : 'ID'}</span>
          </button>
        </div>
      </div>

      {/* See More Toggle Bar */}
      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
        <span className="text-zinc-500">Category: {memory.category}</span>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
        >
          <span>{isExpanded ? 'Show less' : 'See more'}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Expanded Metadata Row */}
      {isExpanded && (
        <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono text-zinc-400 tabular-nums transition-all duration-200">
          <span>
            Source: <strong className="font-medium text-zinc-300">{memory.source}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>Created: {memory.createdAt}</span>
          <span aria-hidden="true">·</span>
          <span>Last accessed: {memory.lastAccessed}</span>
          <span aria-hidden="true">·</span>
          <span>
            Importance: <strong className="font-medium text-sky-400">{memory.importance}%</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-zinc-500">ID: {memory.id}</span>
        </div>
      )}
    </div>
  );
};

export type { MemoryCategory };
