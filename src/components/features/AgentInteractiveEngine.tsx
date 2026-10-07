import React, { useEffect, useState } from 'react';
import {
  Send,
  Brain,
  Search,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useContextFlow } from '../../context/ContextFlowContext';

export type AgentWorkPhase = 'requesting' | 'reasoning' | 'retrieving' | 'executing';

interface PhaseConfig {
  id: AgentWorkPhase;
  label: string;
  badge: string;
  headline: string;
  description: string;
  telemetry: {
    latency: string;
    tokens: string;
    confidence: string;
    subsystem: string;
  };
  packets: string[];
}

const PHASES: PhaseConfig[] = [
  {
    id: 'requesting',
    label: 'Requesting',
    badge: 'CORS & PII Ingress',
    headline: 'Pre-Embedding Redaction & Strict CORS Ingress',
    description:
      'Intercepts runtime calls at client origin, strips API secrets and PII via deterministic regex automata, and normalizes payloads.',
    telemetry: {
      latency: '12ms',
      tokens: '412 tokens sanitized',
      confidence: '100%',
      subsystem: 'Deterministic Redaction Pipeline',
    },
    packets: [
      'Origin header validated: https://app.contextflow.internal',
      'Bearer auth token sanitized and quarantined',
      'Regex automaton applied 42 sanitization rules in 1.4ms',
    ],
  },
  {
    id: 'reasoning',
    label: 'Reasoning',
    badge: 'MORK Atomspace',
    headline: 'MeTTa Symbolic Inference & Decision Invariants',
    description:
      'Performs deterministic reasoning over the active context graph, verifying constraints before generating tool invocations.',
    telemetry: {
      latency: '68ms',
      tokens: '14.2K working window',
      confidence: '98.4%',
      subsystem: 'MeTTa Hypergraph Engine',
    },
    packets: [
      'Traversing epistemic node graph (depth=4, branching=12)',
      'Verified invariant: user_isolation_policy_v2 holds true',
      'Derived subgoal: query_biocypher_topology(target="pathway")',
    ],
  },
  {
    id: 'retrieving',
    label: 'Retrieving',
    badge: 'Cosine pgvector',
    headline: 'Sub-350ms Hybrid RRF Dense & Sparse Vector Recall',
    description:
      'Queries multi-tenant pgvector indexes and Neo4j topological relationships to re-inject verified memories into the prompt window.',
    telemetry: {
      latency: '34ms',
      tokens: '62.4K compressed to 8.2K',
      confidence: '94.7%',
      subsystem: 'Hybrid RRF Vector Retriever',
    },
    packets: [
      'Retrieved 8 high-relevance memories across previous sessions',
      'Match score: mem_neo4j (96%), mem_mork (93%), mem_biocypher (91%)',
      'Semantic compression applied: 34% footprint pruned',
    ],
  },
  {
    id: 'executing',
    label: 'Executing',
    badge: 'Client Action Dispatch',
    headline: 'Typed Client Function Calling & State Sync',
    description:
      'Dispatches client function calling bindings directly to the web application runtime via @voxide/react and stores new knowledge.',
    telemetry: {
      latency: '52ms',
      tokens: '92.1K final prompt packed',
      confidence: '99.8%',
      subsystem: '@voxide/react Client Runtime',
    },
    packets: [
      'Emitting JSON-RPC capability invoke: syncBioCypherGraph()',
      'DOM state synchronized with zero-copy stream',
      'Episodic memory checkpoint committed to persistent store',
    ],
  },
];

interface AgentInteractiveEngineProps {
  onPhaseChange?: (phase: AgentWorkPhase) => void;
}

export const AgentInteractiveEngine: React.FC<AgentInteractiveEngineProps> = ({
  onPhaseChange,
}) => {
  const { state } = useContextFlow();
  const isLight = state.settings.colorMode === 'light';

  const [activePhaseId, setActivePhaseId] = useState<AgentWorkPhase>('requesting');
  const [autoPlay, setAutoPlay] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const activePhase = PHASES.find((p) => p.id === activePhaseId) || PHASES[0];

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setActivePhaseId((prev) => {
        const idx = PHASES.findIndex((p) => p.id === prev);
        const next = PHASES[(idx + 1) % PHASES.length].id;
        onPhaseChange?.(next);
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [autoPlay, onPhaseChange]);

  const handleSelectPhase = (phase: AgentWorkPhase) => {
    setAutoPlay(false);
    setActivePhaseId(phase);
    onPhaseChange?.(phase);
  };

  return (
    <div className="w-full space-y-4">
      {/* Interactive Selection Tabs with Glass Style */}
      <div className={`flex flex-wrap items-center gap-2 p-1.5 rounded-xl border backdrop-blur-md transition-colors ${
        isLight ? 'border-zinc-200 bg-zinc-100/80 shadow-xs' : 'border-white/10 bg-white/5'
      }`}>
        {PHASES.map((phase) => {
          const isSelected = activePhaseId === phase.id;
          const Icon =
            phase.id === 'requesting'
              ? Send
              : phase.id === 'reasoning'
              ? Brain
              : phase.id === 'retrieving'
              ? Search
              : Zap;

          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => handleSelectPhase(phase.id)}
              className={`flex-1 min-w-[100px] py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                isSelected
                  ? isLight
                    ? 'bg-black text-white border border-black shadow-md'
                    : 'bg-sky-500/20 text-white border border-sky-400/60 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                  : isLight
                  ? 'text-zinc-700 hover:text-white hover:bg-black border border-transparent'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isSelected ? 'text-sky-300 scale-110' : isLight ? 'text-zinc-500' : 'text-zinc-400'
                }`}
              />
              <span>{phase.label}</span>
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Visual Live Agent Execution Node Canvas */}
      <div className={`border rounded-xl p-5 shadow-2xl transition-all duration-200 space-y-4 ${
        isLight
          ? 'border-zinc-200 bg-white shadow-zinc-200/50 text-zinc-900'
          : 'border-white/10 bg-zinc-900/80 backdrop-blur-md shadow-black/50 text-zinc-100'
      }`}>
        {/* Live Flow Nodes Graphic */}
        <div className={`py-3 px-3 rounded-lg border grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center ${
          isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-black/40 border-white/10'
        }`}>
          <div
            className={`p-2.5 rounded-md border transition-all duration-300 ${
              activePhaseId === 'requesting'
                ? isLight
                  ? 'border-sky-500 bg-sky-50 shadow-xs'
                  : 'border-sky-400/80 bg-sky-500/15 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                : isLight
                ? 'border-zinc-200 bg-white opacity-60'
                : 'border-white/5 bg-white/5 opacity-50'
            }`}
          >
            <Send className="w-4 h-4 mx-auto mb-1 text-sky-500" />
            <div className={`text-[11px] font-mono ${isLight ? 'text-zinc-900 font-semibold' : 'text-zinc-200'}`}>Ingress</div>
            <div className={`text-[10px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Sanitized</div>
          </div>

          <div
            className={`p-2.5 rounded-md border transition-all duration-300 ${
              activePhaseId === 'reasoning'
                ? isLight
                  ? 'border-emerald-500 bg-emerald-50 shadow-xs'
                  : 'border-sky-400/80 bg-sky-500/15 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                : isLight
                ? 'border-zinc-200 bg-white opacity-60'
                : 'border-white/5 bg-white/5 opacity-50'
            }`}
          >
            <Brain className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
            <div className={`text-[11px] font-mono ${isLight ? 'text-zinc-900 font-semibold' : 'text-zinc-200'}`}>Reasoning</div>
            <div className={`text-[10px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Atomspace</div>
          </div>

          <div
            className={`p-2.5 rounded-md border transition-all duration-300 ${
              activePhaseId === 'retrieving'
                ? isLight
                  ? 'border-amber-500 bg-amber-50 shadow-xs'
                  : 'border-sky-400/80 bg-sky-500/15 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                : isLight
                ? 'border-zinc-200 bg-white opacity-60'
                : 'border-white/5 bg-white/5 opacity-50'
            }`}
          >
            <Search className="w-4 h-4 mx-auto mb-1 text-amber-500" />
            <div className={`text-[11px] font-mono ${isLight ? 'text-zinc-900 font-semibold' : 'text-zinc-200'}`}>Retrieving</div>
            <div className={`text-[10px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>Cosine RRF</div>
          </div>

          <div
            className={`p-2.5 rounded-md border transition-all duration-300 ${
              activePhaseId === 'executing'
                ? isLight
                  ? 'border-cyan-500 bg-cyan-50 shadow-xs'
                  : 'border-sky-400/80 bg-sky-500/15 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                : isLight
                ? 'border-zinc-200 bg-white opacity-60'
                : 'border-white/5 bg-white/5 opacity-50'
            }`}
          >
            <Zap className="w-4 h-4 mx-auto mb-1 text-cyan-500" />
            <div className={`text-[11px] font-mono ${isLight ? 'text-zinc-900 font-semibold' : 'text-zinc-200'}`}>Executing</div>
            <div className={`text-[10px] ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>DOM Sync</div>
          </div>
        </div>

        {/* See More Toggle Button to reveal explanation and packet telemetry */}
        <div className={`pt-1 flex items-center justify-between border-t ${
          isLight ? 'border-zinc-200' : 'border-white/10'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className={`text-xs font-mono font-semibold ${isLight ? 'text-zinc-800' : 'text-zinc-300'}`}>{activePhase.badge}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer ${
              isLight
                ? 'bg-black text-white hover:bg-zinc-800 border border-black shadow-xs'
                : 'text-zinc-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/40'
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

        {/* Collapsible Details */}
        {isExpanded && (
          <div className={`pt-3 border-t space-y-3.5 transition-all duration-300 ${
            isLight ? 'border-zinc-200' : 'border-white/10'
          }`}>
            <div className="space-y-1">
              <h3 className={`text-sm font-bold tracking-tight ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                {activePhase.headline}
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                {activePhase.description}
              </p>
            </div>

            <div className={`p-3 rounded-lg border font-mono text-[11px] space-y-1 ${
              isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-800' : 'bg-black/60 border-white/10 text-zinc-300'
            }`}>
              {activePhase.packets.map((pkt, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-sky-500 select-none">›</span>
                  <span className="leading-relaxed">{pkt}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
