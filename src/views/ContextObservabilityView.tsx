import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Minimize2,
  Play,
  Terminal,
  Cpu,
  Search,
  Sparkles,
  Layers,
  Activity,
  Database,
} from 'lucide-react';
import { useContextFlow } from '../context/ContextFlowContext';
import { ContextBufferItem, ContextBufferState } from '../types/contextflow';
import { MetricCard } from '../components/ui/MetricCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ContextTimeline } from '../components/features/ContextTimeline';
import { EmptyState } from '../components/ui/EmptyState';

const PIPELINE_STAGES = [
  {
    id: 'task_created',
    label: 'Task Created',
    latency: '12ms',
    icon: Terminal,
    description: 'Initializes task state envelope and restores session checkpoint metadata.',
  },
  {
    id: 'query_vectorized',
    label: 'Query Vectorized',
    latency: '48ms',
    icon: Cpu,
    description: 'Encodes active turn query into 1536-d dense vector + BM25 lexical terms.',
  },
  {
    id: 'memories_retrieved',
    label: 'Memories Retrieved',
    latency: '114ms',
    icon: Search,
    description: 'Executes hybrid RRF retrieval over pgvector HNSW index (ef_search=64).',
  },
  {
    id: 'context_selected',
    label: 'Context Selected',
    latency: '38ms',
    icon: Sparkles,
    description: 'Cross-encoder reranks candidate chunks and pins architectural decisions.',
  },
  {
    id: 'context_compressed',
    label: 'Context Compressed',
    latency: '146ms',
    icon: Minimize2,
    description: 'Applies semantic token pruning to older turns and verbose document chunks.',
  },
  {
    id: 'prompt_prepared',
    label: 'Prompt Prepared',
    latency: '29ms',
    icon: Layers,
    description: 'Packs structured context blocks within the 128,000-token window budget.',
  },
  {
    id: 'response_generated',
    label: 'Model Response',
    latency: '1,820ms',
    icon: Activity,
    description: 'Executes model pass with deterministic schema and tool constraints.',
  },
  {
    id: 'memory_updated',
    label: 'Memory Updated',
    latency: '64ms',
    icon: Database,
    description: 'Extracts new factual state and commits embeddings for future sessions.',
  },
];

const BUFFER_STATES: ('All' | ContextBufferState)[] = [
  'All',
  'Active',
  'Compressed',
  'Trimmed',
];

export const ContextObservabilityView: React.FC = () => {
  const {
    state,
    compressContext,
    simulatePipelineStep,
    setBufferItemState,
  } = useContextFlow();

  const isLight = state.settings.colorMode === 'light';
  const [selectedStageId, setSelectedStageId] = useState<string>('context_compressed');
  const [bufferFilter, setBufferFilter] = useState<'All' | ContextBufferState>('All');
  const [selectedBufferItem, setSelectedBufferItem] = useState<ContextBufferItem | null>(
    null
  );

  const currentTokensK = `${Math.round(state.contextBudget.totalUsed / 1000)}K`;
  const maxBudgetK = `${Math.round(state.contextBudget.maxBudget / 1000)}K`;

  const filteredBuffer = useMemo(() => {
    if (bufferFilter === 'All') return state.contextBuffer;
    return state.contextBuffer.filter((item) => item.state === bufferFilter);
  }, [state.contextBuffer, bufferFilter]);

  const selectedStage =
    PIPELINE_STAGES.find((s) => s.id === selectedStageId) || PIPELINE_STAGES[0];

  return (
    <div className={`p-4 sm:p-6 max-w-7xl mx-auto space-y-6 transition-colors ${
      isLight ? 'text-zinc-900' : 'text-zinc-100'
    }`}>
      {/* Header with Action Buttons */}
      <div className={`flex flex-wrap items-baseline justify-between gap-3 border-b pb-4 ${
        isLight ? 'border-zinc-200' : 'border-white/10'
      }`}>
        <div>
          <h1 className={`text-lg font-bold tracking-tight ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
            Context Observability
          </h1>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Real-time telemetry of how context is retrieved, compressed, and packed across long-horizon sessions
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={simulatePipelineStep}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono rounded-lg transition-all duration-300 cursor-pointer ${
              isLight
                ? 'bg-black text-white hover:bg-zinc-800 border border-black shadow-xs'
                : 'text-zinc-100 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] backdrop-blur-md'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>Step Pipeline</span>
          </button>

          <button
            type="button"
            onClick={compressContext}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 cursor-pointer ${
              isLight
                ? 'bg-black text-white hover:bg-zinc-800 border border-black shadow-xs'
                : 'text-sky-300 hover:text-white bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/40 hover:border-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] backdrop-blur-md'
            }`}
          >
            <Minimize2 className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
            <span>Compress Context</span>
          </button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Current Context"
          value={`${currentTokensK} tokens`}
          sublabel={`${state.contextBudget.totalUsed.toLocaleString()} exact`}
        />
        <MetricCard
          label="Compression"
          value={`${state.contextBudget.compressionRatio}%`}
          sublabel="Semantic pruning"
        />
        <MetricCard
          label="Token Footprint"
          value={currentTokensK}
          sublabel="Active window envelope"
        />
        <MetricCard
          label="Active Budget"
          value={maxBudgetK}
          sublabel={`${Math.round(
            (state.contextBudget.totalUsed / state.contextBudget.maxBudget) * 100
          )}% utilized`}
        />
      </div>

      {/* Context Pipeline Visualization with Transparent Glass Cards & Clean Icons (No Numbers) */}
      <section
        aria-label="Context Pipeline"
        className="border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/30"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-semibold text-zinc-100">Context Flow Pipeline</h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Select any stage to inspect latency and behavior
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-2.5 items-stretch">
          {PIPELINE_STAGES.map((stage) => {
            const active = stage.id === selectedStageId;
            const StageIcon = stage.icon;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedStageId(stage.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between backdrop-blur-md ${
                  active
                    ? 'border-sky-400/80 bg-sky-500/15 shadow-[0_0_20px_rgba(56,189,248,0.25)] text-white'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <StageIcon className={`w-4 h-4 ${active ? 'text-sky-300' : 'text-zinc-400'}`} />
                  <span className="text-sky-400 font-semibold">{stage.latency}</span>
                </div>
                <div className="mt-2.5 text-xs font-medium leading-tight">
                  {stage.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Details Bar */}
        <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-200">
            <span className="text-sky-400 font-semibold">{selectedStage.label}:</span>
            <span className="font-sans text-zinc-300">{selectedStage.description}</span>
          </div>
          <span className="text-zinc-400 tabular-nums">
            Stage p95 latency: {selectedStage.latency}
          </span>
        </div>
      </section>

      {/* Two-Column Layout: Event Timeline & Context Buffer Table in Transparent Glass Containers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 5 Cols: Context Event Timeline */}
        <section aria-label="Context Event Timeline" className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-zinc-200">
              Context Event Timeline
            </h2>
            <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
              {state.timelineEvents.length} events
            </span>
          </div>
          <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-xl overflow-hidden shadow-lg">
            <ContextTimeline events={state.timelineEvents} />
          </div>
        </section>

        {/* Right 7 Cols: Context Buffer Table */}
        <section aria-label="Context Buffer" className="lg:col-span-7 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xs font-semibold text-zinc-200">Context Buffer</h2>
              <p className="text-[11px] font-mono text-zinc-400">
                Active, compressed, and evicted slices in the context envelope
              </p>
            </div>

            {/* State Filter */}
            <div
              role="tablist"
              aria-label="Filter context buffer by state"
              className={`flex items-center gap-1 p-1 rounded-lg border ${
                isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-white/5 border-white/10 backdrop-blur-md'
              }`}
            >
              {BUFFER_STATES.map((st) => {
                const active = bufferFilter === st;
                return (
                  <button
                    key={st}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setBufferFilter(st)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-md transition-all duration-150 whitespace-nowrap cursor-pointer ${
                      active
                        ? isLight
                          ? 'bg-black text-white font-bold border border-black shadow-xs'
                          : 'bg-sky-500/20 text-sky-200 border border-sky-400/40'
                        : isLight
                        ? 'text-zinc-700 hover:text-black hover:bg-zinc-200/60 border border-transparent'
                        : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredBuffer.length === 0 ? (
            <EmptyState
              title="No buffer slices match this state"
              description="Switch the filter to All to inspect active and compressed slices."
              actionLabel="Show All"
              onAction={() => setBufferFilter('All')}
            />
          ) : (
            <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-xl overflow-x-auto shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-[11px] font-mono text-zinc-400">
                    <th className="py-2.5 px-3 font-medium">Source</th>
                    <th className="py-2.5 px-3 font-medium">Type</th>
                    <th className="py-2.5 px-3 font-medium text-right">Tokens</th>
                    <th className="py-2.5 px-3 font-medium text-right">Relevance</th>
                    <th className="py-2.5 px-3 font-medium">State</th>
                    <th className="py-2.5 px-3 font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs font-mono tabular-nums">
                  {filteredBuffer.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedBufferItem(item)}
                      className={`hover:bg-white/5 cursor-pointer transition-colors ${
                        selectedBufferItem?.id === item.id ? 'bg-sky-500/10' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-sans font-medium text-zinc-100 max-w-[200px] truncate">
                        {item.source}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-400">{item.type}</td>
                      <td className="py-2.5 px-3 text-right text-zinc-200">
                        {item.tokens.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-sky-400">
                        {item.relevance}%
                      </td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status={item.state} />
                      </td>
                      <td className="py-2.5 px-3 text-zinc-500 whitespace-nowrap">
                        {item.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Selected Buffer Slice Inspector */}
          {selectedBufferItem && (
            <div className="border border-white/15 bg-white/10 backdrop-blur-md rounded-xl p-4 space-y-2 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-semibold text-zinc-100">
                  {selectedBufferItem.source}{' '}
                  <span className="font-mono text-zinc-400 font-normal">
                    ({selectedBufferItem.tokens.toLocaleString()} /{' '}
                    {selectedBufferItem.originalTokens.toLocaleString()} orig tokens)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(['Active', 'Compressed', 'Trimmed'] as ContextBufferState[]).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setBufferItemState(selectedBufferItem.id, st)}
                        className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-colors cursor-pointer ${
                          selectedBufferItem.state === st
                            ? 'border-sky-400/80 text-sky-200 bg-sky-500/20'
                            : 'border-white/10 bg-white/5 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Set {st}
                      </button>
                    )
                  )}
                </div>
              </div>
              <p className="text-xs font-mono text-zinc-300 bg-black/40 p-3 rounded-lg border border-white/10">
                {selectedBufferItem.snippet}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
