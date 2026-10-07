import React from 'react';
import { AgentNode, AgentStatus } from '../../types/contextflow';
import { StatusBadge } from '../ui/StatusBadge';

interface AgentCardProps {
  agent: AgentNode;
  isSelected?: boolean;
  onSelect?: (agent: AgentNode) => void;
  onStatusChange: (agentId: string, status: AgentStatus) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  isSelected = false,
  onSelect,
  onStatusChange,
}) => {
  return (
    <div
      onClick={() => onSelect && onSelect(agent)}
      className={`border rounded-md p-4 transition-colors duration-150 ${
        isSelected
          ? 'border-zinc-700 bg-zinc-900/80'
          : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700/80'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
              0{agent.pipelineOrder}.
            </span>
            <h3 className="text-sm font-semibold text-zinc-100">{agent.name}</h3>
          </div>
          <div className="mt-1">
            <StatusBadge status={agent.status} />
          </div>
        </div>

        <select
          aria-label={`Change state for ${agent.name}`}
          value={agent.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onStatusChange(agent.id, e.target.value as AgentStatus)}
          className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs font-mono text-zinc-300 rounded-xs px-2 py-1 focus:outline-none focus:border-sky-500"
        >
          <option value="Running">Running</option>
          <option value="Waiting">Waiting</option>
          <option value="Completed">Completed</option>
          <option value="Error">Error</option>
        </select>
      </div>

      <p className="mt-2.5 text-xs text-zinc-400 leading-relaxed">{agent.role}</p>

      <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-1.5 text-xs">
        <div className="text-[11px] font-mono text-zinc-500">Current task:</div>
        <div className="font-mono text-zinc-200 leading-snug">{agent.currentTask}</div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-400 tabular-nums">
        <div>
          Execution: <strong className="text-zinc-200 font-medium">{agent.executionTime}</strong>
        </div>
        <span aria-hidden="true">·</span>
        <div>
          Memory: <strong className="text-zinc-200 font-medium">{agent.memoryMb} MB</strong>
        </div>
        <span aria-hidden="true">·</span>
        <div className="text-zinc-500">
          {(agent.tokensProcessed / 1000).toFixed(1)}K tok
        </div>
      </div>
    </div>
  );
};
