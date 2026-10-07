import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Copy } from 'lucide-react';
import { ReleaseLogEntry } from '../../types/contextflow';
import { INITIAL_RELEASE_LOGS } from '../../data/mockData';
import { useContextFlow } from '../../context/ContextFlowContext';

const EXTENDED_VERSIONS: ReleaseLogEntry[] = [
  ...INITIAL_RELEASE_LOGS,
  {
    id: 'rel_138',
    version: 'v1.3.8',
    date: 'Sep 18, 2026',
    category: 'Hosted Engine',
    title: 'Multi-Agent Memory Isolation & Shared Epistemic Scratchpad',
    summary:
      'Partitioned short-term reasoning buffers between planner, researcher, and reviewer agents with transactional checkpoint merging.',
    changes: [
      'Isolated session scratchpads per agent UUID to prevent context contamination.',
      'Added atomic checkpoint merge handler with conflict-free vector resolution.',
      'Lowered agent handoff latency from 140ms to 24ms.',
    ],
    npmPackage: '@contextflow/sdk@1.3.8',
  },
  {
    id: 'rel_135',
    version: 'v1.3.5',
    date: 'Sep 12, 2026',
    category: 'SDK',
    title: 'BioCypher Knowledge Graph & MeTTa Symbolic Bridge Support',
    summary:
      'Native adapters for Biolink ontology exports, Neo4j Bolt graph projections, and MORK atomspace unification.',
    changes: [
      'Built biocypher_mork_bridge with batch gRPC streaming.',
      'Added sub-40ms pathway traversal query optimizer.',
      'Preserved pinned decision invariants across rolling session windows.',
    ],
    npmPackage: '@voxide/react@1.3.5',
  },
];

export const ProductVersionsMarquee: React.FC = () => {
  const { state } = useContextFlow();
  const isLight = state.settings.colorMode === 'light';

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyNpm = (npmPkg: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`npm i ${npmPkg}`).catch(() => {});
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="product-versions"
      aria-label="Product Versions and Engine Releases"
      className={`relative w-full py-20 border-b overflow-hidden transition-colors duration-200 ${
        isLight ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-800 bg-zinc-950'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 text-center space-y-3">
        <h2 className={`text-2xl sm:text-4xl font-bold tracking-tight ${isLight ? 'text-zinc-950' : 'text-white'}`}>
          Continuous Engine Releases & Patches
        </h2>
        <p className={`text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
          Hover over any version card to pause movement, inspect architectural patches, or reveal complete changelogs.
        </p>
      </div>

      {/* Horizontal Continuous Movement Animation Track with Side Gradient Masks */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left Gradient Fade Mask */}
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-36 z-20 ${
            isLight
              ? 'bg-gradient-to-r from-zinc-50 via-zinc-50/80 to-transparent'
              : 'bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent'
          }`}
        />
        {/* Right Gradient Fade Mask */}
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-36 z-20 ${
            isLight
              ? 'bg-gradient-to-l from-zinc-50 via-zinc-50/80 to-transparent'
              : 'bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent'
          }`}
        />

        <div className="flex animate-marquee-versions pause-on-hover gap-6 px-6">
          {[...EXTENDED_VERSIONS, ...EXTENDED_VERSIONS].map((rel, idx) => {
            const isExpanded = expandedId === `${rel.id}-${idx}`;
            return (
              <div
                key={`${rel.id}-${idx}`}
                className={`w-[340px] sm:w-[380px] shrink-0 rounded-2xl border p-6 transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:scale-105 ${
                  isLight
                    ? 'border-zinc-200 bg-white text-zinc-900 shadow-xl shadow-zinc-200/50 hover:shadow-2xl hover:border-zinc-400'
                    : 'border-zinc-800/90 bg-zinc-900/90 backdrop-blur-md text-zinc-100 shadow-2xl shadow-black/80 hover:shadow-[0_0_35px_rgba(56,189,248,0.35)] hover:border-sky-400/60'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Top Version Header Ribbon */}
                  <div className="flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold px-2.5 py-1 rounded-md border ${
                        isLight
                          ? 'bg-zinc-100 text-zinc-950 border-zinc-300'
                          : 'bg-white/10 text-white border-white/15 group-hover:bg-sky-500/20 group-hover:border-sky-400/50'
                      }`}>
                        {rel.version}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md border text-sky-500 ${
                        isLight
                          ? 'bg-sky-50 border-sky-200'
                          : 'bg-sky-950/40 border-sky-800/40'
                      }`}>
                        {rel.category}
                      </span>
                    </div>
                    <span className={isLight ? 'text-zinc-500' : 'text-zinc-500'}>{rel.date}</span>
                  </div>

                  {/* Title and Summary */}
                  <div>
                    <h3 className={`text-base font-semibold tracking-tight leading-snug transition-colors ${
                      isLight ? 'text-zinc-950 group-hover:text-sky-600' : 'text-white group-hover:text-sky-200'
                    }`}>
                      {rel.title}
                    </h3>
                    <p
                      className={`mt-2 text-xs leading-relaxed ${
                        isLight ? 'text-zinc-700' : 'text-zinc-300'
                      } ${isExpanded ? '' : 'line-clamp-2'}`}
                    >
                      {rel.summary}
                    </p>
                  </div>

                  {/* Expanded Detailed Changelog */}
                  {isExpanded && (
                    <div className={`pt-3 border-t space-y-2 ${isLight ? 'border-zinc-200' : 'border-white/10'}`}>
                      <div className="text-[11px] font-mono text-sky-500 font-medium">
                        Patches & Enhancements:
                      </div>
                      <ul className="space-y-1.5 text-xs font-mono">
                        {rel.changes.map((ch, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-2">
                            <span className="text-sky-500 select-none">›</span>
                            <span className={`font-sans ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>{ch}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Bottom Card Action Bar */}
                <div className={`pt-4 mt-3 border-t flex items-center justify-between text-xs font-mono ${
                  isLight ? 'border-zinc-200' : 'border-white/10'
                }`}>
                  {rel.npmPackage ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyNpm(rel.npmPackage!, `${rel.id}-${idx}`);
                      }}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                        isLight
                          ? 'bg-black text-white hover:bg-zinc-800 border border-black shadow-xs'
                          : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {copiedId === `${rel.id}-${idx}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{rel.npmPackage} ↗</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className={isLight ? 'text-zinc-500' : 'text-zinc-500'}>Core Engine</span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(`${rel.id}-${idx}`);
                    }}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                      isLight
                        ? 'bg-black text-white hover:bg-zinc-800 border border-black shadow-xs'
                        : 'text-sky-300 hover:text-white bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30'
                    }`}
                  >
                    <span>{isExpanded ? 'Less' : 'See more'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
