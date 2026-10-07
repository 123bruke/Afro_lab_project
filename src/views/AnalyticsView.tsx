import React, { useMemo, useState } from 'react';
import { useContextFlow } from '../context/ContextFlowContext';
import { ANALYTICS_SERIES } from '../data/mockData';
import { AnalyticsChart } from '../components/features/AnalyticsChart';
import { MetricCard } from '../components/ui/MetricCard';

type TimeRange = '24h' | '7d' | '30d' | 'All';

interface TimeRangeData {
  metrics: {
    avgUtilization: string;
    avgUtilizationSub: string;
    compressionRatio: string;
    compressionSub: string;
    retrievalLatency: string;
    retrievalSub: string;
    retainedMemories: string;
    memoriesSub: string;
    combinedBurn: string;
    cacheHitRate: string;
  };
  utilization: { label: string; value: number }[];
  retrievalVsComp: { label: string; value: number; secondaryValue: number }[];
  memoryGrowth: { label: string; value: number; secondaryValue: number }[];
  taskBurnMultipliers: Record<string, number>;
}

const TIMEFRAME_DATA: Record<TimeRange, TimeRangeData> = {
  '24h': {
    metrics: {
      avgUtilization: '74%',
      avgUtilizationSub: '94.7K / 128K active',
      compressionRatio: '38%',
      compressionSub: '48.6K tok saved / turn',
      retrievalLatency: '286ms',
      retrievalSub: 'L1 embedding cache hit',
      retainedMemories: '1,284',
      memoriesSub: '+14 today',
      combinedBurn: '3,480 tok/min',
      cacheHitRate: '89.4%',
    },
    utilization: [
      { label: '00:00', value: 42 },
      { label: '04:00', value: 51 },
      { label: '08:00', value: 68 },
      { label: '12:00', value: 84 },
      { label: '16:00', value: 76 },
      { label: '20:00', value: 71 },
      { label: '24:00', value: 65 },
    ],
    retrievalVsComp: [
      { label: '04:00', value: 58.2, secondaryValue: 36.1 },
      { label: '08:00', value: 82.5, secondaryValue: 51.4 },
      { label: '12:00', value: 114.2, secondaryValue: 70.8 },
      { label: '16:00', value: 96.0, secondaryValue: 59.5 },
      { label: '20:00', value: 88.4, secondaryValue: 54.8 },
    ],
    memoryGrowth: [
      { label: '00:00', value: 1240, secondaryValue: 12 },
      { label: '06:00', value: 1252, secondaryValue: 18 },
      { label: '12:00', value: 1268, secondaryValue: 26 },
      { label: '18:00', value: 1276, secondaryValue: 31 },
      { label: '24:00', value: 1284, secondaryValue: 36 },
    ],
    taskBurnMultipliers: {
      task_biocypher: 1.15,
      task_research: 0.95,
      task_rag_eval: 1.05,
    },
  },
  '7d': {
    metrics: {
      avgUtilization: '69%',
      avgUtilizationSub: '88.3K / 128K 7-day avg',
      compressionRatio: '35%',
      compressionSub: '44.8K tok saved / session',
      retrievalLatency: '304ms',
      retrievalSub: 'pgvector HNSW p95',
      retainedMemories: '1,272',
      memoriesSub: '+58 this week',
      combinedBurn: '3,120 tok/min',
      cacheHitRate: '86.1%',
    },
    utilization: [
      { label: 'Mon', value: 55 },
      { label: 'Tue', value: 64 },
      { label: 'Wed', value: 78 },
      { label: 'Thu', value: 83 },
      { label: 'Fri', value: 72 },
      { label: 'Sat', value: 48 },
      { label: 'Sun', value: 69 },
    ],
    retrievalVsComp: [
      { label: 'Mon', value: 74.2, secondaryValue: 48.2 },
      { label: 'Tue', value: 91.0, secondaryValue: 59.1 },
      { label: 'Wed', value: 122.5, secondaryValue: 79.6 },
      { label: 'Thu', value: 136.0, secondaryValue: 88.4 },
      { label: 'Fri', value: 104.2, secondaryValue: 67.7 },
      { label: 'Sat', value: 62.0, secondaryValue: 40.3 },
      { label: 'Sun', value: 95.8, secondaryValue: 62.3 },
    ],
    memoryGrowth: [
      { label: 'Mon', value: 1214, secondaryValue: 42 },
      { label: 'Tue', value: 1226, secondaryValue: 58 },
      { label: 'Wed', value: 1240, secondaryValue: 74 },
      { label: 'Thu', value: 1252, secondaryValue: 88 },
      { label: 'Fri', value: 1261, secondaryValue: 102 },
      { label: 'Sat', value: 1266, secondaryValue: 108 },
      { label: 'Sun', value: 1272, secondaryValue: 116 },
    ],
    taskBurnMultipliers: {
      task_biocypher: 1.05,
      task_research: 0.9,
      task_rag_eval: 1.0,
    },
  },
  '30d': {
    metrics: {
      avgUtilization: '65%',
      avgUtilizationSub: '83.2K / 128K 30-day avg',
      compressionRatio: '33%',
      compressionSub: '42.1K tok saved / session',
      retrievalLatency: '326ms',
      retrievalSub: 'Multi-cluster index',
      retainedMemories: '1,220',
      memoriesSub: '+194 this month',
      combinedBurn: '2,890 tok/min',
      cacheHitRate: '82.8%',
    },
    utilization: [
      { label: 'Wk 1', value: 51 },
      { label: 'Wk 2', value: 59 },
      { label: 'Wk 3', value: 76 },
      { label: 'Wk 4', value: 73 },
    ],
    retrievalVsComp: [
      { label: 'Wk 1', value: 82.4, secondaryValue: 55.2 },
      { label: 'Wk 2', value: 104.8, secondaryValue: 70.2 },
      { label: 'Wk 3', value: 134.2, secondaryValue: 89.9 },
      { label: 'Wk 4', value: 126.0, secondaryValue: 84.4 },
    ],
    memoryGrowth: [
      { label: 'Wk 1', value: 1026, secondaryValue: 80 },
      { label: 'Wk 2', value: 1098, secondaryValue: 124 },
      { label: 'Wk 3', value: 1162, secondaryValue: 176 },
      { label: 'Wk 4', value: 1220, secondaryValue: 228 },
    ],
    taskBurnMultipliers: {
      task_biocypher: 0.95,
      task_research: 0.85,
      task_rag_eval: 0.9,
    },
  },
  All: {
    metrics: {
      avgUtilization: '68%',
      avgUtilizationSub: '87.0K / 128K ceiling',
      compressionRatio: '34%',
      compressionSub: '47.5K tok saved / session',
      retrievalLatency: '318ms',
      retrievalSub: 'pgvector HNSW + RRF',
      retainedMemories: '1,248',
      memoriesSub: '+38 past sessions',
      combinedBurn: '3,040 tok/min',
      cacheHitRate: '84.2%',
    },
    utilization: ANALYTICS_SERIES.utilizationOverTime.map((item) => ({
      label: item.label,
      value: item.utilizationPct,
    })),
    retrievalVsComp: ANALYTICS_SERIES.retrievalVsCompression.map((item) => ({
      label: item.session,
      value: item.retrievedK,
      secondaryValue: item.compressedK,
    })),
    memoryGrowth: ANALYTICS_SERIES.memoryGrowth.map((item) => ({
      label: item.session,
      value: item.longTerm,
      secondaryValue: item.shortTerm,
    })),
    taskBurnMultipliers: {
      task_biocypher: 1.0,
      task_research: 1.0,
      task_rag_eval: 1.0,
    },
  },
};

export const AnalyticsView: React.FC = () => {
  const { state } = useContextFlow();
  const isLight = state.settings.colorMode === 'light';
  const [range, setRange] = useState<TimeRange>('All');

  const currentData = useMemo(() => TIMEFRAME_DATA[range], [range]);

  const maxBurnRate = Math.max(...state.tasks.map((t) => t.tokenBurnRate), 1500);

  return (
    <div className={`p-4 sm:p-6 max-w-7xl mx-auto space-y-6 transition-colors ${
      isLight ? 'text-zinc-900' : 'text-zinc-100'
    }`}>
      {/* Header */}
      <div className={`flex flex-wrap items-baseline justify-between gap-3 border-b pb-4 ${
        isLight ? 'border-zinc-200' : 'border-zinc-800'
      }`}>
        <div>
          <h1 className={`text-lg font-bold tracking-tight ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
            Analytics
          </h1>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Developer telemetry for context utilization, compression savings, token burn rate, and memory growth
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Analytics timeframe"
          className={`flex items-center gap-1 p-1 rounded-lg border ${
            isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-900 border-zinc-800'
          }`}
        >
          {(['24h', '7d', '30d', 'All'] as const).map((r) => (
            <button
              key={r}
              type="button"
              role="tab"
              aria-selected={range === r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all duration-150 cursor-pointer ${
                range === r
                  ? isLight
                    ? 'bg-black text-white font-bold shadow-xs'
                    : 'bg-zinc-800 text-zinc-100 font-semibold'
                  : isLight
                  ? 'text-zinc-700 hover:text-black hover:bg-zinc-200/60'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Top Summary Metrics - Dynamically updated based on selected timeframe */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Avg Context Utilization"
          value={currentData.metrics.avgUtilization}
          sublabel={currentData.metrics.avgUtilizationSub}
        />
        <MetricCard
          label="Mean Compression Ratio"
          value={currentData.metrics.compressionRatio}
          sublabel={currentData.metrics.compressionSub}
        />
        <MetricCard
          label="Retrieval p95 Latency"
          value={currentData.metrics.retrievalLatency}
          sublabel={currentData.metrics.retrievalSub}
        />
        <MetricCard
          label="Total Retained Memories"
          value={currentData.metrics.retainedMemories}
          sublabel={currentData.metrics.memoriesSub}
        />
      </div>

      {/* 2x2 Restrained Developer Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Context Utilization */}
        <AnalyticsChart
          title="Context Utilization"
          subtitle={`Percentage of active window consumed across ${range} timeline`}
          type="line"
          data={currentData.utilization}
          unit="%"
          primaryLabel="Window Utilization %"
        />

        {/* Chart 2: Retrieval vs Compression */}
        <AnalyticsChart
          title="Retrieval vs Compression"
          subtitle={`Raw retrieved candidate context vs post-pruning prompt envelope (${range})`}
          type="comparison-bar"
          data={currentData.retrievalVsComp}
          unit="K"
          primaryLabel="Retrieved Context"
          secondaryLabel="Compressed Context"
        />

        {/* Chart 3: Token Burn Rate (Per Task) */}
        <div className="border border-zinc-800 bg-zinc-900/40 rounded-md p-4 flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-200">Token Burn Rate</h3>
              <span className="text-[10px] font-mono text-sky-400">Timeframe: {range}</span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
              Active token consumption rate (tokens/min) and cumulative footprint per task
            </p>
          </div>

          <div className="space-y-3.5 my-auto">
            {state.tasks.map((task) => {
              const multiplier = currentData.taskBurnMultipliers[task.id] ?? 1.0;
              const adjustedRate = Math.round(task.tokenBurnRate * multiplier);
              const pct = Math.min(100, Math.round((adjustedRate / maxBurnRate) * 100));
              return (
                <div key={task.id} className="text-xs font-mono tabular-nums">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-sans font-medium text-zinc-200 truncate">
                      {task.title}
                    </span>
                    <span className="text-zinc-400">
                      {adjustedRate.toLocaleString()} tok/min ·{' '}
                      {(task.totalTokensUsed / 1000).toFixed(1)}K total
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-xs overflow-hidden">
                    <div
                      className="h-full bg-sky-400 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Combined burn: {currentData.metrics.combinedBurn}</span>
            <span>KV-cache hit rate: {currentData.metrics.cacheHitRate}</span>
          </div>
        </div>

        {/* Chart 4: Memory Growth Across Sessions */}
        <AnalyticsChart
          title="Memory Growth"
          subtitle={`Cumulative long-term and short-term memories retained (${range})`}
          type="stacked-growth"
          data={currentData.memoryGrowth}
          unit=""
          primaryLabel="Long-Term Store"
          secondaryLabel="Short-Term Scratchpad"
        />
      </div>
    </div>
  );
};
