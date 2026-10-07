import React, { useEffect, useMemo, useState } from 'react';
import { Search, CornerDownLeft, X } from 'lucide-react';
import { useContextFlow } from '../../context/ContextFlowContext';
import { NavigationTab } from '../../types/contextflow';

export const CommandMenu: React.FC = () => {
  const {
    state,
    setTab,
    selectTask,
    selectSession,
    compressContext,
    simulatePipelineStep,
    setCommandMenu,
  } = useContextFlow();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandMenu(!state.isCommandMenuOpen);
      } else if (e.key === 'Escape' && state.isCommandMenuOpen) {
        setCommandMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isCommandMenuOpen, setCommandMenu]);

  const commands = useMemo(() => {
    const navItems: { id: string; label: string; group: string; run: () => void }[] = [
      { id: 'nav_home', label: 'Open ContextFlow Home & Flow Customizer', group: 'Navigation', run: () => setTab('home') },
      { id: 'nav_chat', label: 'Open Chat / AI Workspace', group: 'Navigation', run: () => setTab('chat') },
      { id: 'nav_dash', label: 'Open Workspace Overview (Dashboard)', group: 'Navigation', run: () => setTab('dashboard') },
      { id: 'nav_tasks', label: 'Open Long-Horizon Tasks', group: 'Navigation', run: () => setTab('tasks') },
      { id: 'nav_mem', label: 'Open Memory Manager', group: 'Navigation', run: () => setTab('memory') },
      { id: 'nav_ctx', label: 'Open Context Observability', group: 'Navigation', run: () => setTab('context') },
      { id: 'nav_know', label: 'Open Knowledge Base', group: 'Navigation', run: () => setTab('knowledge') },
      { id: 'nav_agents', label: 'Open Agent Monitoring', group: 'Navigation', run: () => setTab('agents') },
      { id: 'nav_analytics', label: 'Open Analytics', group: 'Navigation', run: () => setTab('analytics') },
      { id: 'nav_settings', label: 'Open Workspace Settings', group: 'Navigation', run: () => setTab('settings') },
      {
        id: 'act_compress',
        label: 'Optimize & Compress Active Context Buffer',
        group: 'Context Operations',
        run: () => compressContext(),
      },
      {
        id: 'act_sim',
        label: 'Record Pipeline Observability Telemetry Step',
        group: 'Context Operations',
        run: () => {
          simulatePipelineStep();
          setTab('context');
        },
      },
    ];

    const taskItems = state.tasks.map((t) => ({
      id: `task_${t.id}`,
      label: `Switch Task: ${t.title} (${t.progress}%)`,
      group: 'Long-Horizon Tasks',
      run: () => {
        selectTask(t.id);
        setTab('chat' as NavigationTab);
      },
    }));

    const sessionItems = state.sessions.map((s) => ({
      id: `sess_${s.id}`,
      label: `Restore ${s.label} — ${s.summary.slice(0, 48)}...`,
      group: 'Sessions',
      run: () => {
        selectSession(s.id);
        setTab('chat' as NavigationTab);
      },
    }));

    const all = [...navItems, ...taskItems, ...sessionItems];
    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter(
      (item) =>
        item.label.toLowerCase().includes(q) || item.group.toLowerCase().includes(q)
    );
  }, [
    query,
    state.tasks,
    state.sessions,
    setTab,
    selectTask,
    selectSession,
    compressContext,
    simulatePipelineStep,
  ]);

  if (!state.isCommandMenuOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 pt-20 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Command Menu"
    >
      <div className="w-full max-w-lg border border-zinc-700 bg-zinc-950 rounded-md shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-zinc-800">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" aria-hidden="true" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, task, session, or view..."
            className="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none font-mono"
          />
          <button
            type="button"
            onClick={() => setCommandMenu(false)}
            aria-label="Close command menu"
            className="p-1 text-zinc-400 hover:text-zinc-200 rounded-sm"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-1.5 divide-y divide-zinc-900">
          {commands.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No matching commands or context targets.
            </div>
          ) : (
            commands.map((cmd) => (
              <button
                key={cmd.id}
                type="button"
                onClick={() => {
                  cmd.run();
                  setCommandMenu(false);
                  setQuery('');
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-left text-xs rounded-sm hover:bg-zinc-900 text-zinc-200 transition-colors duration-100 group"
              >
                <div className="truncate pr-3">
                  <span className="text-zinc-500 font-mono mr-2">{cmd.group} ·</span>
                  <span className="font-medium text-zinc-200 group-hover:text-white">
                    {cmd.label}
                  </span>
                </div>
                <CornerDownLeft
                  className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0"
                  aria-hidden="true"
                />
              </button>
            ))
          )}
        </div>

        <div className="px-3.5 py-2 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Enter to execute</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};
