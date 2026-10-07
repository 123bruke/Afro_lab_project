import React, { useState } from 'react';
import { FileText, Minimize2, Plus, X, History, ChevronDown, ChevronUp } from 'lucide-react';
import { useContextFlow } from '../../context/ContextFlowContext';
import { ContextMeter } from './ContextMeter';
import { ContextItem } from './ContextItem';

export const ContextInspector: React.FC = () => {
  const {
    state,
    activeTask,
    togglePinMemory,
    compressContext,
    addDecision,
    setMobileInspector,
    setInspectedDocument,
    setTab,
  } = useContextFlow();

  const [newDecision, setNewDecision] = useState('');
  const [showAddDecision, setShowAddDecision] = useState(false);
  const [showHistoryFiles, setShowHistoryFiles] = useState(false);

  // Get top retrieved memories for active task
  const retrievedMemories = state.memories
    .filter((m) => m.taskId === activeTask.id || m.pinned)
    .slice(0, 5);

  const taskDocs = state.knowledgeSources.filter(
    (k) =>
      k.source === 'biocypher_notes.pdf' ||
      k.source === 'dataset_schema.md' ||
      k.source === 'architecture.md' ||
      k.taskId === activeTask.id
  );

  const handleAddDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDecision.trim()) return;
    addDecision(newDecision);
    setNewDecision('');
    setShowAddDecision(false);
  };

  const renderInspectorBody = (isMobile = false) => (
    <div className="flex flex-col h-full bg-zinc-950 border-l border-zinc-800">
      {/* Header */}
      <div className="h-11 px-3.5 border-b border-zinc-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-200">Context Inspector</span>
          <span className="text-[11px] font-mono text-zinc-500">· Live</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={compressContext}
            title="Optimize & compress active context window"
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xs transition-colors duration-150 whitespace-nowrap"
          >
            <Minimize2 className="w-3 h-3 text-sky-400" aria-hidden="true" />
            <span>Compress</span>
          </button>

          {isMobile && (
            <button
              type="button"
              onClick={() => setMobileInspector(false)}
              aria-label="Close Context Inspector"
              className="p-1 text-zinc-400 hover:text-zinc-100 rounded-sm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Inspector Sections */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-5">
        {/* 1. Context Usage */}
        <section aria-label="Context Usage">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-zinc-300">Context Usage</h2>
            <button
              type="button"
              onClick={() => setTab('context')}
              className="text-[11px] font-mono text-sky-400 hover:underline underline-offset-4"
            >
              Observability
            </button>
          </div>
          <ContextMeter
            usedTokens={state.contextBudget.totalUsed}
            maxTokens={state.contextBudget.maxBudget}
          />
        </section>

        {/* 2. Retrieved Memories */}
        <section aria-label="Retrieved Memories">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-zinc-300">Retrieved Memories</h2>
            <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
              {retrievedMemories.length} active
            </span>
          </div>
          <div className="space-y-1.5">
            {retrievedMemories.map((mem) => (
              <ContextItem
                key={mem.id}
                memory={mem}
                onTogglePin={togglePinMemory}
              />
            ))}
          </div>
        </section>

        {/* 3. Recent Files & History (Hidden by History Button) */}
        <section aria-label="Recent Files and History">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-sky-400" />
              <h2 className="text-xs font-semibold text-zinc-300">Recent Files</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowHistoryFiles(!showHistoryFiles)}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/50 rounded-md transition-colors cursor-pointer"
            >
              <span>{showHistoryFiles ? 'Hide History' : 'History'}</span>
              {showHistoryFiles ? (
                <ChevronUp className="w-3 h-3 text-sky-400" />
              ) : (
                <ChevronDown className="w-3 h-3 text-sky-400" />
              )}
            </button>
          </div>

          {!showHistoryFiles ? (
            <div
              onClick={() => setShowHistoryFiles(true)}
              className="px-3 py-2 border border-white/10 bg-white/5 rounded-md text-[11px] font-mono text-zinc-400 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
            >
              <span>{taskDocs.length} recent files hidden</span>
              <span className="text-sky-400">Click History ↗</span>
            </div>
          ) : (
            <div className="border border-white/10 bg-white/5 rounded-md divide-y divide-white/5 transition-all duration-200">
              {taskDocs.slice(0, 4).map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setInspectedDocument(doc.id)}
                  className="w-full px-3 py-2 flex items-center justify-between gap-2 text-left hover:bg-white/10 transition-colors duration-100 cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" aria-hidden="true" />
                    <span className="text-xs font-mono text-zinc-200 truncate">
                      {doc.source}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 tabular-nums shrink-0">
                    {(doc.tokens / 1000).toFixed(1)}K tok
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* 4. Decisions */}
        <section aria-label="Architectural Decisions">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-zinc-300">Decisions</h2>
            <button
              type="button"
              onClick={() => setShowAddDecision(!showAddDecision)}
              aria-label="Add architectural decision"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-zinc-200"
            >
              <Plus className="w-3 h-3" aria-hidden="true" />
              <span>Add</span>
            </button>
          </div>

          {showAddDecision && (
            <form onSubmit={handleAddDecision} className="mb-2 flex gap-1.5">
              <input
                type="text"
                value={newDecision}
                onChange={(e) => setNewDecision(e.target.value)}
                placeholder="Record decision constraint..."
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xs px-2.5 py-1 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-2.5 py-1 text-xs font-medium bg-sky-500 text-zinc-950 rounded-xs hover:bg-sky-400 whitespace-nowrap"
              >
                Save
              </button>
            </form>
          )}

          <ul className="border border-zinc-800 bg-zinc-900/30 rounded-sm divide-y divide-zinc-800/70">
            {state.decisions.map((decision, idx) => (
              <li
                key={idx}
                className="px-3 py-2 text-xs text-zinc-300 leading-snug flex items-start gap-2"
              >
                <span className="font-mono text-zinc-500 select-none">·</span>
                <span>{decision}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 5. Context Budget Breakdown */}
        <section aria-label="Context Budget">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-zinc-300">Context Budget</h2>
            <span className="text-[11px] font-mono text-zinc-500">Safe Operational Metadata</span>
          </div>
          <div className="border border-zinc-800 bg-zinc-900/30 rounded-sm p-3 space-y-2 text-xs font-mono tabular-nums">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">System</span>
              <span className="text-zinc-200">
                {state.contextBudget.system.toLocaleString()} tokens
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Task</span>
              <span className="text-zinc-200">
                {state.contextBudget.task.toLocaleString()} tokens
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Retrieved Memory</span>
              <span className="text-zinc-200">
                {state.contextBudget.retrievedMemory.toLocaleString()} tokens
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Documents</span>
              <span className="text-zinc-200">
                {state.contextBudget.documents.toLocaleString()} tokens
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Conversation</span>
              <span className="text-zinc-200">
                {state.contextBudget.conversation.toLocaleString()} tokens
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  const inspectedDoc = state.knowledgeSources.find(
    (k) => k.id === state.inspectedDocumentId
  );

  return (
    <>
      {/* Desktop Right Panel */}
      <aside className="hidden xl:block w-80 shrink-0 h-full">
        {renderInspectorBody(false)}
      </aside>

      {/* Mobile / Tablet Slide-over Drawer */}
      {state.isMobileInspectorOpen && (
        <div
          className="fixed inset-0 z-50 xl:hidden flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Context Inspector Drawer"
        >
          <div
            className="fixed inset-0 bg-black/70"
            onClick={() => setMobileInspector(false)}
          />
          <div className="relative w-80 max-w-[88vw] h-full z-10">
            {renderInspectorBody(true)}
          </div>
        </div>
      )}

      {/* Document Quick Preview Modal */}
      {inspectedDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="doc-preview-title"
        >
          <div className="w-full max-w-lg border border-zinc-800 bg-zinc-950 rounded-md p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3
                  id="doc-preview-title"
                  className="text-sm font-mono font-semibold text-zinc-100"
                >
                  {inspectedDoc.source}
                </h3>
                <div className="mt-0.5 text-xs font-mono text-zinc-400 tabular-nums">
                  {inspectedDoc.type} · {inspectedDoc.chunks} chunks ·{' '}
                  {inspectedDoc.tokens.toLocaleString()} tokens · Updated {inspectedDoc.updated}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectedDocument(null)}
                aria-label="Close document preview"
                className="p-1 text-zinc-400 hover:text-zinc-100 rounded-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-3 text-xs text-zinc-300 leading-relaxed">
              {inspectedDoc.summary}
            </p>

            <div className="mt-4">
              <div className="text-[11px] font-mono text-zinc-500 mb-1.5">
                Active Retrieved Vector Chunks
              </div>
              <div className="space-y-2">
                {inspectedDoc.sampleChunks.map((chunk, i) => (
                  <pre
                    key={i}
                    className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-sm text-xs font-mono text-zinc-200 whitespace-pre-wrap"
                  >
                    {chunk}
                  </pre>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectedDocument(null)}
                className="px-3 py-1.5 text-xs font-medium text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
