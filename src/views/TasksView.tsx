import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useContextFlow } from '../context/ContextFlowContext';
import { TaskStatus } from '../types/contextflow';
import { TaskCard } from '../components/features/TaskCard';
import { StatusBadge } from '../components/ui/StatusBadge';

export const TasksView: React.FC = () => {
  const {
    state,
    selectTask,
    setTab,
    createTask,
    updateTaskStatus,
    updateTaskProgress,
    toggleTaskPhase,
    toggleTaskAgent,
  } = useContextFlow();

  const [statusFilter, setStatusFilter] = useState<'All' | TaskStatus>('All');
  const [inspectedTaskId, setInspectedTaskId] = useState<string | null>('task_biocypher');

  // Create Task Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [shortTitle, setShortTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [phasesInput, setPhasesInput] = useState(
    'Schema & Data Ingestion\nVector & Graph Indexing\nAgent Reasoning Integration\nVerification Benchmarks'
  );

  const filteredTasks = state.tasks.filter((t) =>
    statusFilter === 'All' ? true : t.status === statusFilter
  );

  const inspectedTask =
    state.tasks.find((t) => t.id === inspectedTaskId) || state.tasks[0];

  const taskSessions = state.sessions.filter((s) => s.taskId === inspectedTask.id);
  const taskMemories = state.memories.filter((m) => m.taskId === inspectedTask.id);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !goal.trim()) return;
    const phaseList = phasesInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    createTask({
      title: title.trim(),
      shortTitle: shortTitle.trim() || title.trim().slice(0, 20),
      goal: goal.trim(),
      phases: phaseList,
      assignedAgentIds: ['agent_planner', 'agent_context', 'agent_memory'],
    });
    setTitle('');
    setShortTitle('');
    setGoal('');
    setIsCreateOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
            Long-Horizon Tasks
          </h1>
          <p className="text-xs mt-0.5 font-semibold animated-gradient-text">
            ContextFlow
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-950 bg-sky-400 hover:bg-sky-300 rounded-sm transition-colors duration-150 whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 icon-premium" aria-hidden="true" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Filter tasks by status"
          className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-sm"
        >
          {(['All', 'Running', 'Paused', 'Completed', 'Blocked'] as const).map(
            (st) => {
              const active = statusFilter === st;
              return (
                <button
                  key={st}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-xs transition-colors duration-150 whitespace-nowrap ${
                    active
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {st}
                </button>
              );
            }
          )}
        </div>

        <div className="text-xs font-mono text-zinc-500 tabular-nums">
          {filteredTasks.length} long-horizon tasks
        </div>
      </div>

      {/* Main Content: Tasks List + Task Continuity Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Cols: Task Cards */}
        <div className="lg:col-span-8 space-y-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isSelected={inspectedTask.id === task.id}
              onOpenWorkspace={(id) => {
                selectTask(id);
                setTab('chat');
              }}
              onStatusChange={updateTaskStatus}
              onProgressChange={updateTaskProgress}
              onTogglePhase={toggleTaskPhase}
              onInspectTask={(id) => setInspectedTaskId(id)}
            />
          ))}
        </div>

        {/* Right 4 Cols: Selected Task Sessions, Memories & Agent Assignment */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="border border-zinc-800 bg-zinc-900/35 rounded-md p-4 space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <div className="text-[11px] font-mono text-zinc-500">
                Task Continuity Inspector
              </div>
              <h2 className="text-sm font-semibold text-zinc-100 mt-0.5">
                {inspectedTask.title}
              </h2>
              <div className="mt-1">
                <StatusBadge status={inspectedTask.status} />
              </div>
            </div>

            {/* Assigned Agents */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 mb-2">
                <span>Assigned Agents</span>
                <span className="font-mono text-[11px] text-zinc-500">
                  Toggle assignment
                </span>
              </div>
              <div className="space-y-1.5">
                {state.agents.map((agent) => {
                  const assigned = inspectedTask.assignedAgentIds.includes(agent.id);
                  return (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => toggleTaskAgent(inspectedTask.id, agent.id)}
                      className={`w-full px-2.5 py-1.5 rounded-sm border text-left flex items-center justify-between text-xs transition-colors ${
                        assigned
                          ? 'border-sky-500/50 bg-sky-950/20 text-zinc-100'
                          : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="font-medium">{agent.name}</span>
                      <span className="font-mono text-[11px] text-zinc-400">
                        {assigned ? '✓ Assigned' : '+ Assign'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Linked Sessions */}
            <div className="pt-3 border-t border-zinc-800">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 mb-2">
                <span>Linked Sessions ({taskSessions.length})</span>
                <button
                  type="button"
                  onClick={() => {
                    selectTask(inspectedTask.id);
                    setTab('chat');
                  }}
                  className="text-[11px] font-mono text-sky-400 hover:underline"
                >
                  Open Chat
                </button>
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                {taskSessions.map((s) => (
                  <div
                    key={s.id}
                    className="p-2 border border-zinc-800 bg-zinc-950/60 rounded-xs"
                  >
                    <div className="flex items-center justify-between text-zinc-200">
                      <span>{s.label}</span>
                      <span className="text-zinc-500">{s.createdAt}</span>
                    </div>
                    <div className="text-[11px] font-sans text-zinc-400 mt-0.5 truncate">
                      {s.summary}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Linked Memories */}
            <div className="pt-3 border-t border-zinc-800">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 mb-2">
                <span>Task Memories ({taskMemories.length})</span>
                <button
                  type="button"
                  onClick={() => setTab('memory')}
                  className="text-[11px] font-mono text-sky-400 hover:underline"
                >
                  Manage All
                </button>
              </div>
              <div className="space-y-1.5">
                {taskMemories.slice(0, 4).map((m) => (
                  <div
                    key={m.id}
                    className="p-2 border border-zinc-800 bg-zinc-950/60 rounded-xs text-xs"
                  >
                    <div className="flex items-center justify-between font-medium text-zinc-200">
                      <span className="truncate">{m.title}</span>
                      <span className="font-mono text-[11px] text-sky-400 shrink-0 ml-2">
                        {m.importance}%
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-500 mt-0.5">
                      {m.category} · {m.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Create Task Modal */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-task-title"
        >
          <div className="w-full max-w-lg border border-zinc-800 bg-zinc-950 rounded-md p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h2 id="create-task-title" className="text-sm font-semibold text-zinc-100">
                Create Long-Horizon Task
              </h2>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                aria-label="Close modal"
                className="p-1 text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-mono text-zinc-400 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Distributed GraphRAG Context Router"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-mono text-zinc-400 mb-1">
                  Short Sidebar Label
                </label>
                <input
                  type="text"
                  value={shortTitle}
                  onChange={(e) => setShortTitle(e.target.value)}
                  placeholder="e.g., GraphRAG Router"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-mono text-zinc-400 mb-1">
                  Long-Horizon Goal
                </label>
                <textarea
                  rows={2}
                  required
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Describe the multi-session objective and verification criteria..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-mono text-zinc-400 mb-1">
                  Execution Phases (one per line)
                </label>
                <textarea
                  rows={4}
                  value={phasesInput}
                  onChange={(e) => setPhasesInput(e.target.value)}
                  className="w-full px-3 py-2 font-mono bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium text-zinc-950 bg-sky-400 hover:bg-sky-300 rounded-sm"
                >
                  Initialize Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
