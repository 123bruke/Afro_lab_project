import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { AgentNode } from '../../types/contextflow';
import { StatusBadge } from '../ui/StatusBadge';

interface AgentPipelineProps {
  agents: AgentNode[];
  selectedAgentId?: string;
  onSelectAgent?: (agent: AgentNode) => void;
}

export const AgentPipeline: React.FC<AgentPipelineProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
}) => {
  const ordered = [...agents].sort((a, b) => a.pipelineOrder - b.pipelineOrder);

  return (
    <div className="border border-zinc-800 bg-zinc-900/35 rounded-md p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-zinc-300">
          Multi-Agent Context Execution Pipeline
        </h2>
        <span className="text-[11px] font-mono text-zinc-500">
          Deterministic Handoff Graph
        </span>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
        {ordered.map((agent, idx) => {
          const isSelected = selectedAgentId === agent.id;
          return (
            <React.Fragment key={agent.id}>
              <button
                type="button"
                onClick={() => onSelectAgent && onSelectAgent(agent)}
                className={`flex-1 text-left px-3 py-2.5 rounded-sm border transition-colors duration-150 ${
                  isSelected
                    ? 'border-sky-500/60 bg-sky-950/20'
                    : 'border-zinc-800 bg-zinc-950/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-zinc-200 truncate">
                    {agent.name}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 tabular-nums">
                    {agent.executionTime}
                  </span>
                </div>
                <div className="mt-1">
                  <StatusBadge status={agent.status} />
                </div>
              </button>

              {idx < ordered.length - 1 && (
                <div className="flex items-center justify-center text-zinc-600 py-0.5 lg:py-0">
                  <ArrowRight
                    className="hidden lg:block w-4 h-4 shrink-0"
                    aria-hidden="true"
                  />
                  <ArrowDown
                    className="lg:hidden w-4 h-4 shrink-0"
                    aria-hidden="true"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
