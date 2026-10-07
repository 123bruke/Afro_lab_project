import React, { useState } from 'react';
import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import { LongHorizonTask, TaskStatus } from '../../types/contextflow';
import { StatusBadge } from '../ui/StatusBadge';
import { TaskProgress } from './TaskProgress';
import { useContextFlow } from '../../context/ContextFlowContext';

interface TaskCardProps {
  task: LongHorizonTask;
  isSelected?: boolean;
  onOpenWorkspace: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onProgressChange: (taskId: string, progress: number) => void;
  onTogglePhase: (taskId: string, phaseNumber: number) => void;
  onInspectTask?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isSelected = false,
  onOpenWorkspace,
  onStatusChange,
  onProgressChange,
  onTogglePhase,
  onInspectTask,
}) => {
  const { state } = useContextFlow();
  const isLight = state.settings.colorMode === 'light';
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`border rounded-xl p-4 transition-all duration-200 backdrop-blur-md ${
        isLight
          ? isSelected
            ? 'border-sky-500 bg-white shadow-lg shadow-sky-500/10'
            : 'border-zinc-200 bg-white hover:border-zinc-300 shadow-xs'
          : isSelected
          ? 'border-sky-500/50 bg-zinc-900/80 shadow-lg shadow-sky-500/10'
          : 'border-white/10 bg-white/5 hover:border-white/20'
      }`}
    >
      {/* Top Row: Title + Status + Action */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={`text-sm font-semibold truncate ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>{task.title}</h3>
          <div className={`mt-1 flex items-center gap-2 text-xs font-mono ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
            <StatusBadge status={task.status} />
            <span aria-hidden="true">·</span>
            <span>
              Phase {task.currentPhase} / {task.totalPhases}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            aria-label={`Change status for ${task.title}`}
            className={`text-xs rounded-lg px-2 py-1 font-mono cursor-pointer border ${
              isLight
                ? 'bg-zinc-100 text-zinc-900 border-zinc-300'
                : 'bg-zinc-900 text-zinc-200 border-zinc-700'
            }`}
          >
            <option value="pending">pending</option>
            <option value="in_progress">in_progress</option>
            <option value="completed">completed</option>
            <option value="failed">failed</option>
            <option value="paused">paused</option>
          </select>

          <button
            type="button"
            onClick={() => onOpenWorkspace(task.id)}
            aria-label={`Open workspace for ${task.title}`}
            title="Open task in Chat Workspace"
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isLight
                ? 'bg-black text-white hover:bg-zinc-800 border-black shadow-xs'
                : 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 hover:text-white border-sky-500/30'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Slider and Ascii Bar */}
      <div className="mt-3 space-y-2">
        <div className={`flex items-center justify-between text-xs font-mono ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
          <span>Progress</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={100}
              value={task.progress}
              onChange={(e) => onProgressChange(task.id, Number(e.target.value))}
              aria-label={`Adjust progress for ${task.title}`}
              className="w-20 sm:w-28 accent-sky-400 cursor-pointer"
            />
            <span className="w-9 text-right font-bold tabular-nums">
              {task.progress}%
            </span>
          </div>
        </div>
        <TaskProgress progress={task.progress} showAscii />
      </div>

      {/* See More Toggle Button */}
      <div className={`mt-3 pt-2.5 border-t flex items-center justify-between ${
        isLight ? 'border-zinc-200' : 'border-white/10'
      }`}>
        <span className={`text-[11px] font-mono ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
          Updated {task.updatedAt}
        </span>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
            isLight
              ? 'bg-black text-white hover:bg-zinc-800 border border-black shadow-xs'
              : 'text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
          }`}
        >
          <span>{isExpanded ? 'Show less' : 'See more'}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
          )}
        </button>
      </div>

      {/* Collapsible Details: Goal, Phases, and Metadata */}
      {isExpanded && (
        <div className={`mt-3 pt-3 border-t space-y-3 transition-all duration-300 ${
          isLight ? 'border-zinc-200' : 'border-white/10'
        }`}>
          <p className={`text-xs leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>{task.goal}</p>

          <div>
            <div className={`text-[11px] font-mono mb-1.5 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Phases (click to set active checkpoint):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1.5">
              {task.phases.map((phase) => {
                const symbol =
                  phase.status === 'completed' ? '✓' : phase.status === 'current' ? '●' : '○';
                const color =
                  phase.status === 'completed'
                    ? isLight
                      ? 'text-emerald-600 border-zinc-300 bg-emerald-50'
                      : 'text-emerald-400 border-zinc-800 bg-zinc-950/60'
                    : phase.status === 'current'
                    ? isLight
                      ? 'text-sky-600 border-sky-400 bg-sky-50'
                      : 'text-sky-400 border-sky-500/40 bg-sky-950/20'
                    : isLight
                    ? 'text-zinc-600 border-zinc-200 bg-zinc-50'
                    : 'text-zinc-500 border-zinc-800/60 bg-zinc-950/30';

                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => onTogglePhase(task.id, phase.number)}
                    title={phase.title}
                    className={`px-2 py-1.5 border rounded-lg text-left transition-colors cursor-pointer ${color}`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span>Phase {phase.number}</span>
                      <span>{symbol}</span>
                    </div>
                    <div className="mt-0.5 text-[11px] truncate opacity-80">{phase.title}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`pt-2 border-t flex flex-wrap items-center justify-between gap-2 text-xs font-mono ${
            isLight ? 'border-zinc-200 text-zinc-600' : 'border-white/10 text-zinc-400'
          }`}>
            <div className="flex flex-wrap items-center gap-2">
              <span>Memories: {task.memoriesCount}</span>
              <span aria-hidden="true">·</span>
              <span>Documents: {task.documentsCount}</span>
              <span aria-hidden="true">·</span>
              <span>Sessions: {task.sessionsCount}</span>
            </div>

            {onInspectTask && (
              <button
                type="button"
                onClick={() => onInspectTask(task.id)}
                className={`text-xs px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-black text-white hover:bg-zinc-800 border border-black shadow-xs'
                    : 'text-sky-400 hover:text-sky-300 hover:underline'
                }`}
              >
                Inspect Details →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
