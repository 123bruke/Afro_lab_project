import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { useContextFlow } from '../context/ContextFlowContext';
import { AgentNode } from '../types/contextflow';
import { AgentPipeline } from '../components/features/AgentPipeline';
import { AgentCard } from '../components/features/AgentCard';
import { StatusBadge } from '../components/ui/StatusBadge';

export const AgentsView: React.FC = () => {
  const { state, setAgentStatus, notify } = useContextFlow();
  const [selectedAgent, setSelectedAgent] = useState<AgentNode>(
    state.agents.find((a) => a.id === 'agent_context') || state.agents[0]
  );

  const orderedAgents = [...state.agents].sort(
    (a, b) => a.pipelineOrder - b.pipelineOrder
  );

  const advanceAgentHandoff = () => {
    const runningIdx = orderedAgents.findIndex((a) => a.status === 'Running');
    if (runningIdx !== -1) {
      const current = orderedAgents[runningIdx];
      const next = orderedAgents[(runningIdx + 1) % orderedAgents.length];
      setAgentStatus(current.id, 'Completed');
      setAgentStatus(next.id, 'Running');
      setSelectedAgent(next);
      notify(`Handoff completed: ${current.name} → ${next.name}`);
    } else {
      setAgentStatus(orderedAgents[0].id, 'Running');
      setSelectedAgent(orderedAgents[0]);
    }
  };

  const currentSelected =
    state.agents.find((a) => a.id === selectedAgent.id) || orderedAgents[0];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
            Agents
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Orchestrated agent pipeline managing planning, retrieval, context optimization, research, review, and memory persistence
          </p>
        </div>

        <button
          type="button"
          onClick={advanceAgentHandoff}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-950 bg-sky-400 hover:bg-sky-300 rounded-sm transition-colors duration-150 whitespace-nowrap"
        >
          <Play className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Advance Pipeline Handoff</span>
        </button>
      </div>

      {/* Execution Pipeline */}
      <AgentPipeline
        agents={orderedAgents}
        selectedAgentId={currentSelected.id}
        onSelectAgent={(a) => setSelectedAgent(a)}
      />

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orderedAgents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isSelected={currentSelected.id === agent.id}
            onSelect={(a) => setSelectedAgent(a)}
            onStatusChange={(id, st) => setAgentStatus(id, st)}
          />
        ))}
      </div>

      {/* Safe Execution Metadata Panel */}
      <section
        aria-label="Selected Agent Operational Telemetry"
        className="border border-zinc-800 bg-zinc-900/35 rounded-md p-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm font-semibold text-zinc-100">
              {currentSelected.name} · Safe Execution Telemetry
            </h2>
            <StatusBadge status={currentSelected.status} />
          </div>
          <span className="text-xs font-mono text-zinc-500 tabular-nums">
            Last heartbeat: {currentSelected.lastHeartbeat}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono tabular-nums">
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-sm">
            <div className="text-zinc-500">Pipeline Stage</div>
            <div className="text-zinc-100 font-semibold mt-1">
              Stage 0{currentSelected.pipelineOrder} / 06
            </div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-sm">
            <div className="text-zinc-500">Execution Duration</div>
            <div className="text-zinc-100 font-semibold mt-1">
              {currentSelected.executionTime}
            </div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-sm">
            <div className="text-zinc-500">Worker RSS Memory</div>
            <div className="text-zinc-100 font-semibold mt-1">
              {currentSelected.memoryMb} MB
            </div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-sm">
            <div className="text-zinc-500">Tokens Processed</div>
            <div className="text-zinc-100 font-semibold mt-1">
              {currentSelected.tokensProcessed.toLocaleString()} tok
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
