import React, { useMemo, useState } from 'react';
import { Search, Upload, X } from 'lucide-react';
import { useContextFlow } from '../context/ContextFlowContext';
import { KnowledgeSource, KnowledgeType } from '../types/contextflow';
import { KnowledgeTable } from '../components/features/KnowledgeTable';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { StatusBadge } from '../components/ui/StatusBadge';

const KNOWLEDGE_FILTERS: ('All' | KnowledgeType)[] = [
  'All',
  'Documents',
  'PDFs',
  'URLs',
  'Notes',
  'Datasets',
];

export const KnowledgeBaseView: React.FC = () => {
  const {
    state,
    addKnowledgeSource,
    removeKnowledgeSource,
    reindexKnowledgeSource,
  } = useContextFlow();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | KnowledgeType>('All');
  const [inspectedSource, setInspectedSource] = useState<KnowledgeSource | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Upload / Add Modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [sourceName, setSourceName] = useState('');
  const [sourceType, setSourceType] = useState<KnowledgeType>('Documents');
  const [sourceSummary, setSourceSummary] = useState('');

  const filteredSources = useMemo(() => {
    return state.knowledgeSources.filter((item) => {
      if (selectedType !== 'All' && item.type !== selectedType) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.source.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [state.knowledgeSources, selectedType, search]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceName.trim()) return;
    addKnowledgeSource(sourceName.trim(), sourceType, sourceSummary.trim());
    setSourceName('');
    setSourceSummary('');
    setIsUploadOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
            Knowledge
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Indexed documents, PDFs, URLs, notes, and datasets grounding long-horizon tasks
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-950 bg-sky-400 hover:bg-sky-300 rounded-sm transition-colors duration-150 whitespace-nowrap"
        >
          <Upload className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Upload Source</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search
            className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search indexed knowledge sources..."
            aria-label="Search knowledge sources"
            className="w-full pl-9 pr-8 py-2 text-xs font-mono bg-zinc-900/70 border border-zinc-800 focus:border-zinc-600 rounded-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div
          role="tablist"
          aria-label="Knowledge source type filters"
          className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-sm overflow-x-auto"
        >
          {KNOWLEDGE_FILTERS.map((filter) => {
            const active = selectedType === filter;
            return (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedType(filter)}
                className={`px-2.5 py-1 text-xs font-medium rounded-xs transition-colors duration-150 whitespace-nowrap ${
                  active
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Knowledge Table */}
      <KnowledgeTable
        sources={filteredSources}
        onInspect={(src) => setInspectedSource(src)}
        onReindex={reindexKnowledgeSource}
        onRemove={(id) => setRemovingId(id)}
        onAddFirst={() => setIsUploadOpen(true)}
      />

      {/* Source Details Inspector Panel */}
      {inspectedSource && (
        <div className="border border-zinc-700 bg-zinc-900/50 rounded-md p-4 space-y-3">
          <div className="flex items-start justify-between gap-2 border-b border-zinc-800 pb-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-sm font-mono font-semibold text-zinc-100">
                  {inspectedSource.source}
                </h2>
                <StatusBadge status={inspectedSource.status} />
              </div>
              <div className="mt-1 text-xs font-mono text-zinc-400 tabular-nums">
                Type: {inspectedSource.type} · Chunks: {inspectedSource.chunks} · Linked Memories:{' '}
                {inspectedSource.memories} · Footprint:{' '}
                {inspectedSource.tokens.toLocaleString()} tokens
              </div>
            </div>

            <button
              type="button"
              onClick={() => setInspectedSource(null)}
              aria-label="Close source details"
              className="p-1 text-zinc-400 hover:text-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            {inspectedSource.summary}
          </p>

          <div className="space-y-1.5">
            <div className="text-[11px] font-mono text-zinc-500">
              Sample Indexed Vector Chunks
            </div>
            {inspectedSource.sampleChunks.map((chunk, i) => (
              <pre
                key={i}
                className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-sm text-xs font-mono text-zinc-200 whitespace-pre-wrap"
              >
                {chunk}
              </pre>
            ))}
          </div>
        </div>
      )}

      {/* Upload Source Modal */}
      {isUploadOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upload-source-title"
        >
          <div className="w-full max-w-md border border-zinc-800 bg-zinc-950 rounded-md p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h2 id="upload-source-title" className="text-sm font-semibold text-zinc-100">
                Upload / Index Knowledge Source
              </h2>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                aria-label="Close modal"
                className="p-1 text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-mono text-zinc-400 mb-1">
                  Source Filename or URL
                </label>
                <input
                  type="text"
                  required
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="e.g., metta_atomspace_spec.pdf or https://..."
                  className="w-full px-3 py-2 font-mono bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-mono text-zinc-400 mb-1">
                  Source Type
                </label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value as KnowledgeType)}
                  className="w-full px-3 py-2 font-mono bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
                >
                  {KNOWLEDGE_FILTERS.filter((f) => f !== 'All').map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-zinc-400 mb-1">
                  Scope / Extraction Notes
                </label>
                <textarea
                  rows={3}
                  value={sourceSummary}
                  onChange={(e) => setSourceSummary(e.target.value)}
                  placeholder="Describe the schema, dataset columns, or documentation scope..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium text-zinc-950 bg-sky-400 hover:bg-sky-300 rounded-sm"
                >
                  Index Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Remove Dialog */}
      <ConfirmDialog
        isOpen={Boolean(removingId)}
        title="Remove Knowledge Source"
        description="Removing this source will delete its vector chunks from the local index. Retained episodic memories will remain intact."
        confirmLabel="Remove Source"
        onConfirm={() => {
          if (removingId) {
            removeKnowledgeSource(removingId);
            if (inspectedSource?.id === removingId) setInspectedSource(null);
          }
          setRemovingId(null);
        }}
        onCancel={() => setRemovingId(null)}
      />
    </div>
  );
};
