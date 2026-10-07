import React, { useState } from 'react';
import {
  Plus,
  Layers,
  Activity,
  Cpu,
  Database,
  Brain,
} from 'lucide-react';
import { useContextFlow } from '../context/ContextFlowContext';
import { ChatPanel } from '../components/features/ChatPanel';
import { ContextInspector } from '../components/features/ContextInspector';
import { StatusBadge } from '../components/ui/StatusBadge';

type PanelTab = 'tasks' | 'memory' | 'agents' | 'context';

const PANEL_TABS: { id: PanelTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'tasks', label: 'Tasks', icon: Activity },
  { id: 'memory', label: 'Memory', icon: Database },
  { id: 'agents', label: 'Agents', icon: Cpu },
  { id: 'context', label: 'Context', icon: Brain },
];

export const ChatWorkspaceView: React.FC = () => {
  const {
    state,
    activeTask,
    activeSession,
    selectTask,
    selectSession,
    createSession,
  } = useContextFlow();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState<PanelTab>('tasks');

  const openPanel = (tab: PanelTab) => {
    setPanelTab(tab);
    setIsPanelOpen(true);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden">
      {/* SINGLE BUTTON: reveals/hides the Workspace panel (Tasks, Memory, Agents, Context) */}
      <div className="hidden lg:flex flex-col items-center gap-3 w-12 shrink-0 h-full border-r border-zinc-800 bg-zinc-950 py-3 select-none">
        <button
          type="button"
          onClick={() => setIsPanelOpen((open) => !open)}
          aria-expanded={isPanelOpen}
          aria-label={isPanelOpen ? 'Hide workspace panel' : 'Show tasks, memory, agents and context'}
          title={isPanelOpen ? 'Hide workspace panel' : 'Tasks · Memory · Agents · Context'}
          className={`group w-8 h-8 rounded-lg grid place-items-center border transition-all duration-200 cursor-pointer ${
            isPanelOpen
              ? 'border-sky-400/60 bg-sky-500/15'
              : 'border-zinc-800 bg-zinc-900/60 hover:border-sky-400/40 hover:bg-zinc-900'
          }`}
        >
          <Layers
            className={`w-4 h-4 icon-premium ${
              isPanelOpen ? 'text-sky-400 opacity-100!' : 'text-zinc-300'
            }`}
            aria-hidden="true"
          />
        </button>
        <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 [writing-mode:vertical-rl] select-none">
          Workspace
        </span>
      </div>

      {/* LEFT PANEL: Tasks / Memory / Agents / Context (Desktop) */}
      {isPanelOpen && (
        <aside className="hidden lg:flex flex-col w-64 shrink-0 h-full border-r border-zinc-800 bg-zinc-950 select-none animate-slide-in-left overflow-hidden">
          {/* Tab Switcher */}
          <div className="p-2 border-b border-zinc-800 flex items-center gap-1">
            {PANEL_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPanelTab(tab.id)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all duration-150 cursor-pointer ${
                  panelTab === tab.id
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <tab.icon
                  className={`w-3 h-3 icon-premium ${
                    panelTab === tab.id ? 'text-sky-400' : ''
                  }`}
                  aria-hidden="true"
                />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-1">
            {panelTab === 'tasks' && (
              <>
                {state.tasks.map((task) => {
                  const isSelected = task.id === activeTask.id;
                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => selectTask(task.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-sm border transition-colors duration-150 ${
                        isSelected
                          ? 'border-zinc-700 bg-zinc-900 text-zinc-100'
                          : 'border-transparent hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium truncate">
                          {task.shortTitle}
                        </span>
                        <span className="text-[11px] font-mono tabular-nums text-sky-400 shrink-0">
                          {task.progress}%
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                        <span>
                          Phase {task.currentPhase}/{task.totalPhases}
                        </span>
                        <StatusBadge status={task.status} />
                      </div>
                    </button>
                  );
                })}

                <div className="flex items-center justify-between pt-3 pb-1.5">
                  <h2 className="text-xs font-semibold text-zinc-300">
                    Recent Sessions
                  </h2>
                  <button
                    type="button"
                    onClick={() =>
                      createSession(
                        activeTask.id,
                        `Continuing ${activeTask.shortTitle} from ${activeSession.label}`
                      )
                    }
                    aria-label="Start new session with context recovery"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-sky-400 hover:text-sky-300 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" aria-hidden="true" />
                    <span>New</span>
                  </button>
                </div>
                {state.sessions.map((sess) => {
                  const isSelected = sess.id === activeSession.id;
                  return (
                    <button
                      key={sess.id}
                      type="button"
                      onClick={() => selectSession(sess.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-sm border transition-colors duration-150 ${
                        isSelected
                          ? 'border-zinc-700 bg-zinc-900 text-zinc-100'
                          : 'border-zinc-800/50 bg-zinc-900/20 hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-medium">
                          {sess.label}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 tabular-nums">
                          {(sess.tokensUsed / 1000).toFixed(1)}K tok
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] text-zinc-400 truncate">
                        {sess.summary}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                        <span>{sess.createdAt}</span>
                        <span>{sess.memoriesCreated} mem</span>
                      </div>
                    </button>
                  );
                })}
              </>
            )}

            {panelTab === 'memory' &&
              (state.memories.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-6">
                  No memories yet in this workspace.
                </p>
              ) : (
                state.memories.map((mem) => (
                  <div
                    key={mem.id}
                    className="px-2.5 py-2 rounded-sm border border-zinc-800/60 bg-zinc-900/20"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-zinc-200 truncate">
                        {mem.title}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                        {mem.importance}%
                      </span>
                    </div>
                    <div className="mt-0.5 text-[10px] font-mono text-sky-400/80 truncate">
                      {mem.category} · {mem.source}
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-400 line-clamp-2">
                      {mem.content}
                    </div>
                  </div>
                ))
              ))}

            {panelTab === 'agents' &&
              (state.agents.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-6">
                  No agents running in this workspace.
                </p>
              ) : (
                state.agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="px-2.5 py-2 rounded-sm border border-zinc-800/60 bg-zinc-900/20 flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-zinc-200 truncate">
                        {agent.name}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500 truncate">
                        {agent.role}
                      </div>
                      <div className="mt-0.5 text-[10px] text-zinc-400 truncate">
                        {agent.currentTask}
                      </div>
                    </div>
                    <StatusBadge status={agent.status} />
                  </div>
                ))
              ))}

            {panelTab === 'context' &&
              (state.contextBuffer.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-6">
                  Context window is empty.
                </p>
              ) : (
                state.contextBuffer.map((item) => (
                  <div
                    key={item.id}
                    className="px-2.5 py-2 rounded-sm border border-zinc-800/60 bg-zinc-900/20"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-zinc-200 truncate">
                        {item.source}
                      </span>
                      <span
                        className={`text-[10px] font-mono shrink-0 ${
                          item.state === 'Active'
                            ? 'text-emerald-400'
                            : item.state === 'Compressed'
                              ? 'text-amber-400'
                              : 'text-zinc-500'
                        }`}
                      >
                        {item.state}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[10px] font-mono text-zinc-500 truncate">
                      {item.type} · {item.tokens} tok · {item.relevance}% rel
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-400 line-clamp-2">
                      {item.snippet}
                    </div>
                  </div>
                ))
              ))}
          </div>
        </aside>
      )}

      {/* CENTER PANEL: Conversation & AI Execution */}
      <main className="flex-1 h-full min-w-0 overflow-hidden">
        <ChatPanel onOpenHistory={() => openPanel('memory')} />
      </main>

      {/* RIGHT PANEL: Context Inspector */}
      <ContextInspector />
    </div>
  );
};