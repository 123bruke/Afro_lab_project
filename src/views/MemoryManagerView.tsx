import React, { useMemo, useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { useContextFlow } from '../context/ContextFlowContext';
import { MemoryCategory, MemoryItem } from '../types/contextflow';
import { MemoryList } from '../components/features/MemoryList';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { LoadingState } from '../components/ui/LoadingState';

const MEMORY_PAGE_SIZE = 6;

const CATEGORIES: ('All' | MemoryCategory)[] = [
  'All',
  'Short-term',
  'Long-term',
  'Preferences',
  'Decisions',
  'Project Knowledge',
  'Important Facts',
];

export const MemoryManagerView: React.FC = () => {
  const {
    state,
    createMemory,
    updateMemory,
    deleteMemory,
    togglePinMemory,
    notify,
  } = useContextFlow();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | MemoryCategory>('All');
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);
  const [showAllMemories, setShowAllMemories] = useState(false);

  // Create / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<MemoryCategory>('Project Knowledge');
  const [formImportance, setFormImportance] = useState(90);
  const [formPinned, setFormPinned] = useState(true);

  // Delete confirmation state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredMemories = useMemo(() => {
    return state.memories.filter((mem) => {
      if (selectedCategory !== 'All' && mem.category !== selectedCategory) {
        return false;
      }
      if (onlyPinned && !mem.pinned) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          mem.title.toLowerCase().includes(q) ||
          mem.content.toLowerCase().includes(q) ||
          mem.category.toLowerCase().includes(q) ||
          mem.source.toLowerCase().includes(q) ||
          mem.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [state.memories, selectedCategory, onlyPinned, search]);

  const visibleMemories = useMemo(
    () =>
      showAllMemories
        ? filteredMemories
        : filteredMemories.slice(0, MEMORY_PAGE_SIZE),
    [filteredMemories, showAllMemories]
  );

  const openCreateModal = () => {
    setEditingMemory(null);
    setFormTitle('');
    setFormContent('');
    setFormCategory('Project Knowledge');
    setFormImportance(90);
    setFormPinned(true);
    setIsModalOpen(true);
  };

  const openEditModal = (mem: MemoryItem) => {
    setEditingMemory(mem);
    setFormTitle(mem.title);
    setFormContent(mem.content);
    setFormCategory(mem.category);
    setFormImportance(mem.importance);
    setFormPinned(mem.pinned);
    setIsModalOpen(true);
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    if (editingMemory) {
      updateMemory({
        id: editingMemory.id,
        title: formTitle.trim(),
        content: formContent.trim(),
        category: formCategory,
        importance: formImportance,
      });
    } else {
      createMemory({
        title: formTitle.trim(),
        content: formContent.trim(),
        category: formCategory,
        importance: formImportance,
        pinned: formPinned,
      });
    }
    setIsModalOpen(false);
  };

  const triggerSyncSimulation = () => {
    setIsSimulatingLoad(true);
    window.setTimeout(() => {
      setIsSimulatingLoad(false);
      notify('pgvector memory index verified (12ms)');
    }, 450);
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
            Memory
          </h1>
          <p className="text-xs mt-0.5 font-semibold animated-gradient-text">
            ContextFlow
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={triggerSyncSimulation}
            className="px-2.5 py-1.5 text-xs font-mono text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-sm transition-colors duration-150 whitespace-nowrap"
          >
            Verify Vector Index
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-950 bg-sky-400 hover:bg-sky-300 rounded-sm transition-colors duration-150 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 icon-premium" aria-hidden="true" />
            <span>Create Memory</span>
          </button>
        </div>
      </div>

      {/* Top Search & Pinned Filter */}
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
            placeholder="Search memories..."
            aria-label="Search memories"
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOnlyPinned(!onlyPinned)}
            className={`px-3 py-2 text-xs font-mono rounded-sm border transition-colors duration-150 whitespace-nowrap ${
              onlyPinned
                ? 'border-sky-500/60 bg-sky-950/25 text-sky-300'
                : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Pinned Only ({state.memories.filter((m) => m.pinned).length})
          </button>
        </div>
      </div>

      {/* Interactive Filter Controls */}
      <div
        role="tablist"
        aria-label="Memory category filters"
        className="flex items-center gap-1 p-1 bg-zinc-900/60 border border-zinc-800 rounded-sm overflow-x-auto"
      >
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-xs transition-colors duration-150 whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Memory List or Loading State */}
      {isSimulatingLoad ? (
        <LoadingState rows={5} label="Scanning pgvector HNSW memory index..." />
      ) : (
        <>
          <MemoryList
            memories={visibleMemories}
            onPin={togglePinMemory}
            onEdit={openEditModal}
            onDelete={(id) => setDeletingId(id)}
            onCopyId={(id) => notify(`Copied memory ID: ${id}`)}
            onCreateNew={openCreateModal}
          />

          {/* History is folded behind a single easy toggle */}
          {filteredMemories.length > MEMORY_PAGE_SIZE && (
            <button
              type="button"
              onClick={() => setShowAllMemories((v) => !v)}
              className={`w-full py-2.5 text-xs font-mono rounded-sm border transition-colors duration-150 cursor-pointer ${
                showAllMemories
                  ? 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                  : 'border-sky-500/40 bg-sky-950/25 text-sky-300 hover:bg-sky-950/45'
              }`}
            >
              {showAllMemories ? 'Show less history' : 'Show more memories'}
            </button>
          )}
        </>
      )}

      {/* Create / Edit Memory Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="memory-modal-title"
        >
          <div className="w-full max-w-lg border border-zinc-800 bg-zinc-950 rounded-md p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h2 id="memory-modal-title" className="text-sm font-semibold text-zinc-100">
                {editingMemory ? 'Edit Memory' : 'Create New Memory'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                className="p-1 text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMemory} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-mono text-zinc-400 mb-1">
                  Memory Title
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Neo4j Subgraph Batch Constraint"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-mono text-zinc-400 mb-1">
                  Technical Content / Fact Payload
                </label>
                <textarea
                  rows={3}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="bolt://neo4j:7687 · Exact configuration, schema invariant, or architectural decision..."
                  className="w-full px-3 py-2 font-mono bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-zinc-400 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as MemoryCategory)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-100 font-mono focus:outline-none focus:border-sky-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-zinc-400 mb-1">
                    Importance ({formImportance}%)
                  </label>
                  <input
                    type="range"
                    min={50}
                    max={100}
                    value={formImportance}
                    onChange={(e) => setFormImportance(Number(e.target.value))}
                    className="w-full mt-2 accent-sky-400"
                  />
                </div>
              </div>

              {!editingMemory && (
                <label className="flex items-center gap-2 text-zinc-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formPinned}
                    onChange={(e) => setFormPinned(e.target.checked)}
                    className="accent-sky-400"
                  />
                  <span>Pin memory to active context window immediately</span>
                </label>
              )}

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium text-zinc-950 bg-sky-400 hover:bg-sky-300 rounded-sm"
                >
                  {editingMemory ? 'Save Changes' : 'Retain Memory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Retained Memory"
        description="Removing this memory will evict it from the pgvector store and active task recovery envelope. Continue?"
        confirmLabel="Delete Memory"
        onConfirm={() => {
          if (deletingId) deleteMemory(deletingId);
          setDeletingId(null);
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
