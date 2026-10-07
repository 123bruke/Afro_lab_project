import React from 'react';
import { Eye, RefreshCw, Trash2 } from 'lucide-react';
import { KnowledgeSource } from '../../types/contextflow';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/EmptyState';

interface KnowledgeTableProps {
  sources: KnowledgeSource[];
  onInspect: (source: KnowledgeSource) => void;
  onReindex: (id: string) => void;
  onRemove: (id: string) => void;
  onAddFirst?: () => void;
}

export const KnowledgeTable: React.FC<KnowledgeTableProps> = ({
  sources,
  onInspect,
  onReindex,
  onRemove,
  onAddFirst,
}) => {
  if (sources.length === 0) {
    return (
      <EmptyState
        title="No knowledge sources found"
        description="Try adjusting your filter or upload a document, dataset, or URL to index into the vector store."
        actionLabel={onAddFirst ? 'Upload Source' : undefined}
        onAction={onAddFirst}
      />
    );
  }

  return (
    <div className="border border-zinc-800 bg-zinc-900/30 rounded-md overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/70 text-[11px] font-mono text-zinc-400">
            <th className="py-2.5 px-3.5 font-medium">Source</th>
            <th className="py-2.5 px-3.5 font-medium">Type</th>
            <th className="py-2.5 px-3.5 font-medium">Status</th>
            <th className="py-2.5 px-3.5 font-medium">Updated</th>
            <th className="py-2.5 px-3.5 font-medium text-right">Chunks</th>
            <th className="py-2.5 px-3.5 font-medium text-right">Memories</th>
            <th className="py-2.5 px-3.5 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/70 text-xs">
          {sources.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-zinc-900/60 transition-colors duration-100"
            >
              <td className="py-2.5 px-3.5 font-mono text-zinc-100 max-w-xs truncate">
                <button
                  type="button"
                  onClick={() => onInspect(item)}
                  className="hover:text-sky-400 hover:underline underline-offset-4 text-left truncate block w-full"
                >
                  {item.source}
                </button>
              </td>
              <td className="py-2.5 px-3.5 text-zinc-400 font-mono">{item.type}</td>
              <td className="py-2.5 px-3.5">
                <StatusBadge status={item.status} />
              </td>
              <td className="py-2.5 px-3.5 font-mono text-zinc-400 tabular-nums whitespace-nowrap">
                {item.updated}
              </td>
              <td className="py-2.5 px-3.5 font-mono text-zinc-300 text-right tabular-nums">
                {item.chunks}
              </td>
              <td className="py-2.5 px-3.5 font-mono text-zinc-300 text-right tabular-nums">
                {item.memories}
              </td>
              <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                <div className="inline-flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onInspect(item)}
                    aria-label={`View details for ${item.source}`}
                    title="View indexed chunks & details"
                    className="p-1 text-zinc-400 hover:text-zinc-100 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onReindex(item.id)}
                    aria-label={`Re-index ${item.source}`}
                    title="Re-index source"
                    className="p-1 text-zinc-400 hover:text-sky-400 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Remove ${item.source}`}
                    title="Remove source"
                    className="p-1 text-zinc-400 hover:text-rose-400 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
