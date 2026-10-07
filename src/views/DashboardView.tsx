import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useContextFlow } from '../context/ContextFlowContext';
import { MetricCard } from '../components/ui/MetricCard';
import { TaskProgress } from '../components/features/TaskProgress';

const LIFECYCLE_STEPS = [
  { id: 'task', label: 'Long-Horizon Task', tab: 'tasks' as const },
  { id: 'session', label: 'Session', tab: 'chat' as const },
  { id: 'retrieve', label: 'Retrieve Relevant Context', tab: 'context' as const },
  { id: 'memory', label: 'Memory Selection', tab: 'memory' as const },
  { id: 'opt', label: 'Context Optimization', tab: 'context' as const },
  { id: 'exec', label: 'AI Execution', tab: 'chat' as const },
  { id: 'store', label: 'Store New Knowledge', tab: 'knowledge' as const },
];

export const DashboardView: React.FC = () => {
  const { state, setTab, selectTask } = useContextFlow();

  const runningTasksCount = state.tasks.filter((t) => t.status === 'Running').length;
  const storedMemoriesTotal = 1236 + state.memories.length; // displays 1,248 initially
  const utilizationPct = Math.round(
    (state.contextBudget.totalUsed / Math.max(1, state.contextBudget.maxBudget)) * 100
  );
  const runningAgentsCount =
    state.agents.filter((a) => a.status === 'Running' || a.status === 'Waiting').length;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
            Workspace Overview
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Long-horizon AI context health and activity
          </p>
        </div>

        <button
          type="button"
          onClick={() => setTab('chat')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-950 bg-sky-400 hover:bg-sky-300 rounded-sm transition-colors duration-150 whitespace-nowrap"
        >
          <span>Open Active Session (#42)</span>
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Top Metrics (Compact bordered panels) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Active Tasks"
          value={runningTasksCount}
          sublabel={`${state.tasks.length} total`}
          onClick={() => setTab('tasks')}
        />
        <MetricCard
          label="Stored Memories"
          value={storedMemoriesTotal.toLocaleString()}
          sublabel="pgvector + local"
          onClick={() => setTab('memory')}
        />
        <MetricCard
          label="Context Utilization"
          value="68%"
          sublabel={`${(state.contextBudget.totalUsed / 1000).toFixed(1)}K / 128K`}
          onClick={() => setTab('context')}
        />
        <MetricCard
          label="Running Agents"
          value={runningAgentsCount}
          sublabel={`${state.agents.length} in pipeline`}
          onClick={() => setTab('agents')}
        />
      </div>

      {/* Context Continuity Lifecycle Strip */}
      <div className="border border-zinc-800 bg-zinc-900/35 rounded-md p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono text-zinc-400">
            Context Continuity Lifecycle
          </span>
          <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
            Active Window: {utilizationPct}% ({state.contextBudget.totalUsed.toLocaleString()} tok)
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {LIFECYCLE_STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <button
                type="button"
                onClick={() => setTab(step.tab)}
                className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-sky-400 rounded-xs transition-colors duration-150 whitespace-nowrap"
              >
                {step.label}
              </button>
              {idx < LIFECYCLE_STEPS.length - 1 && (
                <ArrowRight
                  className="w-3.5 h-3.5 text-zinc-600 shrink-0"
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Two-Column Grid: Active Tasks & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Cols: Active Tasks */}
        <section
          aria-label="Active Tasks"
          className="lg:col-span-7 border border-zinc-800 bg-zinc-900/30 rounded-md p-4 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-xs font-semibold text-zinc-200">Active Tasks</h2>
              <button
                type="button"
                onClick={() => setTab('tasks')}
                className="text-xs font-mono text-sky-400 hover:underline underline-offset-4"
              >
                View all tasks
              </button>
            </div>

            <div className="space-y-3.5">
              {state.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    selectTask(task.id);
                    setTab('chat');
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      selectTask(task.id);
                      setTab('chat');
                    }
                  }}
                  className="p-3 border border-zinc-800/90 bg-zinc-950/60 hover:border-zinc-700 rounded-sm cursor-pointer transition-colors duration-150"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-medium text-zinc-100 truncate">
                      {task.title}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400 tabular-nums shrink-0">
                      Phase {task.currentPhase}/{task.totalPhases} · {task.memoriesCount} memories
                    </span>
                  </div>
                  <TaskProgress progress={task.progress} showAscii />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Click any task to resume execution in Chat Workspace</span>
            <span>Auto-checkpoint enabled</span>
          </div>
        </section>

        {/* Right 5 Cols: Recent Activity */}
        <section
          aria-label="Recent Activity"
          className="lg:col-span-5 border border-zinc-800 bg-zinc-900/30 rounded-md p-4"
        >
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-xs font-semibold text-zinc-200">Recent Activity</h2>
            <button
              type="button"
              onClick={() => setTab('context')}
              className="text-xs font-mono text-zinc-400 hover:text-zinc-200"
            >
              Event log
            </button>
          </div>

          <div className="divide-y divide-zinc-800/70 font-mono text-xs tabular-nums">
            {state.activityFeed.slice(0, 7).map((item) => (
              <div
                key={item.id}
                className="py-2.5 flex items-baseline gap-3 hover:bg-zinc-900/40 px-1.5 rounded-xs transition-colors"
              >
                <span className="text-zinc-500 shrink-0">{item.timestamp}</span>
                <div className="min-w-0">
                  <div className="text-zinc-200 font-medium">{item.action}</div>
                  <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {item.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recently Retained Memories */}
      <section
        aria-label="Recently Retained Memories"
        className="border border-zinc-800 bg-zinc-900/30 rounded-md p-4"
      >
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-xs font-semibold text-zinc-200">
              Recently Retained Memories
            </h2>
            <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
              Long-term and episodic memories indexed across recent sessions
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTab('memory')}
            className="text-xs font-mono text-sky-400 hover:underline underline-offset-4"
          >
            Open Memory Manager
          </button>
        </div>

        <div className="border border-zinc-800 bg-zinc-950/60 rounded-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60 text-[11px] font-mono text-zinc-400">
                <th className="py-2 px-3 font-medium">Memory</th>
                <th className="py-2 px-3 font-medium">Category</th>
                <th className="py-2 px-3 font-medium text-right">Relevance</th>
                <th className="py-2 px-3 font-medium">Timestamp</th>
                <th className="py-2 px-3 font-medium">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70 text-xs font-mono tabular-nums">
              {state.memories.slice(0, 6).map((mem) => (
                <tr
                  key={mem.id}
                  onClick={() => setTab('memory')}
                  className="hover:bg-zinc-900/60 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3 text-zinc-100 font-sans font-medium">
                    {mem.title}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400">{mem.category}</td>
                  <td className="py-2.5 px-3 text-right text-sky-400">
                    {mem.relevanceMatch ?? mem.importance}%
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400 whitespace-nowrap">
                    {mem.lastAccessed}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-300 whitespace-nowrap">
                    {mem.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
