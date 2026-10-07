import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useContextFlow } from '../context/ContextFlowContext';
import { INITIAL_RELEASE_LOGS } from '../data/mockData';
import { ReleaseLogEntry } from '../types/contextflow';
import { CursorFlowCanvas } from '../components/features/CursorFlowCanvas';
import { CodeTypewriter } from '../components/features/CodeTypewriter';
import { AgentInteractiveEngine } from '../components/features/AgentInteractiveEngine';
import { ProductVersionsMarquee } from '../components/features/ProductVersionsMarquee';
import { TrustedEcosystemMarquee } from '../components/features/TrustedEcosystemMarquee';
import { CompanyTeamSection } from '../components/features/CompanyTeamSection';
import HERO_IMAGE_PATH from '../assets/images/hero_forest_sunbeams.jpg';
import HOUSE_END_PAGE_IMAGE from '../assets/images/modern_architectural_house_1791342318220.jpg';

const RELEASE_CATEGORIES: ('All' | ReleaseLogEntry['category'] | 'Empty')[] = [
  'All',
  'Hosted Engine',
  'SDK',
  'Patches',
  'Empty',
];

export const HomeView: React.FC = () => {
  const {
    state,
    setTab,
    notify,
  } = useContextFlow();

  const isLight = state.settings.colorMode === 'light';
  const { homeCustomization } = state;
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [houseImgFailed, setHouseImgFailed] = useState(false);
  const [copiedNpm, setCopiedNpm] = useState(false);
  const [expandedReleaseIds, setExpandedReleaseIds] = useState<Record<string, boolean>>({});
  const [releaseFilter, setReleaseFilter] = useState<
    'All' | ReleaseLogEntry['category'] | 'Empty'
  >('All');

  const demoEngineSectionRef = useRef<HTMLElement | null>(null);
  const updatesSectionRef = useRef<HTMLElement | null>(null);

  const toggleRelease = (id: string) => {
    setExpandedReleaseIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredReleases = useMemo(() => {
    if (releaseFilter === 'Empty') return [];
    if (releaseFilter === 'All') return INITIAL_RELEASE_LOGS;
    return INITIAL_RELEASE_LOGS.filter((r) => r.category === releaseFilter);
  }, [releaseFilter]);

  const handleCopyInstall = () => {
    const cmd = 'npm install @voxide/react @contextflow/sdk';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cmd).catch(() => {});
    }
    setCopiedNpm(true);
    notify('Copied: npm install @voxide/react @contextflow/sdk');
    window.setTimeout(() => setCopiedNpm(false), 2000);
  };

  return (
    <div className={`w-full transition-colors duration-200 ${isLight ? 'bg-zinc-50 text-zinc-900' : 'bg-zinc-950 text-zinc-100'} selection:bg-sky-500/20 selection:text-sky-200`}>
      {/* =====================================================================
          PAGE 1 (FIRST VIEW): FULL-PAGE COVER AI AGENT IMAGE + SLOW ZOOM
          CLEAN WHITE GRADIENT IN LIGHT MODE, BLACK GRADIENT IN DARK MODE
         ===================================================================== */}
      <section
        id="hero-cover"
        aria-label="Scenic Forest Hero"
        className={`hero-cover relative w-full min-h-[calc(100vh-3.5rem)] flex flex-col justify-center overflow-hidden border-b transition-colors duration-200 ${
          isLight ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-950'
        }`}
      >
        {/* Full-Page Cover Image Layer: slow zoom + transparent edges + reflection sweep */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none reflective-image">
          {!heroImgFailed ? (
            <img
              src={HERO_IMAGE_PATH}
              alt="Serene sunlit forest with soft morning light"
              referrerPolicy="no-referrer"
              onError={() => setHeroImgFailed(true)}
              className="w-full h-full object-cover object-center animate-slow-zoom brightness-100 opacity-95 fade-edge-mask"
            />
          ) : (
            <div className={`w-full h-full ${isLight ? 'bg-gradient-to-br from-white via-sky-50 to-zinc-100' : 'bg-gradient-to-br from-zinc-950 via-slate-900 to-zinc-950'}`} />
          )}

          {/* Transparent Animated Gradient (kept light so the artwork stays visible) */}
          <div className="absolute inset-0 hero-animated-gradient opacity-30" />

          {/* Reduced Contrast Scrim: soft white fade in light mode, soft dark fade in dark mode */}
          {isLight ? (
            <>
              {/* Reduced light-mode gradient: single soft fade + light veil */}
              <div className="absolute inset-0 bg-white/25" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/20 to-transparent" />
            </>
          ) : (
            <>
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20"
                style={{
                  opacity: Math.min(homeCustomization.imageOverlayOpacity, 70) / 100,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
            </>
          )}
        </div>

        {/* Continuously Flowing Cursor-Reactive Particle Stream Canvas */}
        <CursorFlowCanvas
          flowSpeed={homeCustomization.flowSpeed}
          particleDensity={homeCustomization.particleDensity}
          cursorRadius={homeCustomization.cursorRadius}
          accentTheme={homeCustomization.accentTheme}
          showMeshLinks={homeCustomization.showMeshLinks}
        />

        {/* Hero Main Content: Realistic, High-Impact Centered Block */}
        <div className="relative z-20 max-w-4xl w-full mx-auto px-4 sm:px-6 my-auto py-16 lg:py-24 space-y-6 text-center flex flex-col items-center justify-center">
          {/* SMART SDK SYSTEM — large, clean, solid text. No panel, no shadow, no gradient */}
          <div aria-hidden="true" className="text-center">
            <h1 className={`text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none ${
              isLight ? 'text-zinc-950' : 'text-white'
            }`} style={{ textShadow: 'none' }}>
              SMART SDK SYSTEM
            </h1>
            <p className={`mt-3 text-[11px] sm:text-xs font-mono uppercase tracking-[0.35em] ${
              isLight ? 'text-zinc-600' : 'text-zinc-300'
            }`}>
              Deterministic · Client-Secure · 128K Horizon
            </p>
          </div>

          <p className={`hero-subheadline text-base sm:text-lg max-w-2xl leading-relaxed font-normal mx-auto ${
            isLight ? 'text-zinc-800' : 'text-zinc-100'
          }`} style={{ textShadow: 'none' }}>
            Maintain deterministic context windows, client-side function calling,
            pre-embedding PII redaction, and multi-session AI agent state across 128K horizons.
          </p>

          {/* Action Buttons: In light mode every clickable button is black; in dark mode transparent/glowing */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => setTab('chat')}
              className={`relative group inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                isLight
                  ? 'bg-black text-white hover:bg-zinc-800 border border-black shadow-lg shadow-black/20'
                  : 'bg-sky-500/20 text-white hover:bg-sky-500/35 border border-sky-400/50 hover:border-sky-400 backdrop-blur-md'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Open AI Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
              </span>
            </button>

            {/* NPM Install Button */}
            <button
              type="button"
              onClick={handleCopyInstall}
              aria-label="Copy npm install command"
              className={`inline-flex items-center gap-2.5 px-4 py-3 text-xs sm:text-sm font-mono rounded-xl transition-all duration-200 cursor-pointer ${
                isLight
                  ? 'bg-black text-white hover:bg-zinc-800 border border-black shadow-md'
                  : 'bg-white/10 hover:bg-white/15 text-zinc-100 border border-white/20 hover:border-white/35 backdrop-blur-md'
              }`}
            >
              <span className="text-sky-400 font-semibold">$</span>
              <span>npm i @voxide/react @contextflow/sdk</span>
              {copiedNpm ? (
                <Check className="w-4 h-4 text-emerald-400 icon-premium" aria-hidden="true" />
              ) : (
                <Copy className="w-4 h-4 text-zinc-400 icon-premium" aria-hidden="true" />
              )}
            </button>

            {/* Down Scroll Button */}
            <button
              type="button"
              onClick={() =>
                demoEngineSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
              }
              className={`inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                isLight
                  ? 'bg-black text-white hover:bg-zinc-800 border border-black shadow-md'
                  : 'text-zinc-200 hover:text-white bg-transparent hover:bg-white/5 border border-transparent hover:border-white/15 backdrop-blur-xs'
              }`}
            >
              <span>Explore Engine & Code</span>
              <ArrowDown className="w-3.5 h-3.5 text-sky-400 icon-premium" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PAGE 2 (SECOND VIEW): CODE WRITING ANIMATION
          + AGENT WORKING ANIMATION WITH INTERACTIVE SELECTION
          ANCHORED WITH BOTH #features AND #demo-engine
         ===================================================================== */}
      <section
        id="features"
        ref={demoEngineSectionRef}
        aria-label="Live Code Synthesis & Agent Working Engine"
        className={`relative w-full py-16 sm:py-20 border-b overflow-hidden transition-colors duration-200 ${
          isLight ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-950'
        }`}
      >
        <div id="demo-engine" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className={`text-2xl sm:text-4xl font-bold tracking-tight ${isLight ? 'text-zinc-950' : 'text-white'}`}>
              Autonomous Code Synthesis & Agent State Engine
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Observe typed client-side code dynamically typed and re-evaluated, paired with an interactive
              agent telemetry pipeline where you can select operational phases in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Column 1 (Left 6 cols): Live Code Typewriter (Clean Animation Only, No Click/Edit) */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <CodeTypewriter />
            </div>

            {/* Column 2 (Right 6 cols): Agent Working Interactive Animation */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <AgentInteractiveEngine />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PAGE 3 (THIRD VIEW): CONTINUOUS HORIZONTAL MOVEMENT ANIMATION
          SHOWING VERSIONS OF THE PRODUCTS WITH SOLID SHADOW & HOVER ENLARGEMENT
         ===================================================================== */}
      <ProductVersionsMarquee />

      {/* =====================================================================
          PAGE 4 (FOURTH VIEW): TRUSTED AI ECOSYSTEM 2-TRACK HORIZONTAL SCROLL
          (SHOWING ONLY LOGOS, ZERO TEXT) WITH GRADIENT MASKS
         ===================================================================== */}
      <TrustedEcosystemMarquee />

      {/* =====================================================================
          PAGE 5 (FIFTH VIEW): SYSTEM UPDATES (CLEAN CHRONOLOGICAL CHANGELOG)
          WITH "SEE MORE" / "SHOW LESS" TOGGLES & REFLECTIVE CARDS
         ===================================================================== */}
      <section
        id="system-updates"
        ref={updatesSectionRef}
        aria-label="System Updates"
        className={`border-b py-16 transition-colors duration-200 ${isLight ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-800 bg-zinc-950'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Section Header & Filter */}
          <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b ${
            isLight ? 'border-zinc-200' : 'border-zinc-800'
          }`}>
            <div className="space-y-1">
              <div className="text-xs font-mono text-sky-500">Changelog & Releases</div>
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                System Updates
              </h2>
            </div>

            {/* Category Filter Pills: In light mode clickable buttons are black */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className={`text-xs font-mono pr-2 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>Filter:</div>
              <div className={`p-1 rounded-xl border flex items-center gap-1 flex-wrap ${
                isLight ? 'border-zinc-200 bg-zinc-100' : 'border-white/10 bg-white/5'
              }`}>
                {RELEASE_CATEGORIES.map((cat) => {
                  const isActive = releaseFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setReleaseFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                        isActive
                          ? isLight
                            ? 'bg-black text-white border border-black shadow-xs font-bold'
                            : 'bg-sky-500/20 text-white border border-sky-400/50 shadow-xs'
                          : isLight
                          ? 'bg-zinc-900 text-white hover:bg-black border border-zinc-900'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {cat === 'Empty' ? '0 Log State' : cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Release Feed with Attractive Solid UI and See More Button */}
          <div className="space-y-4">
            {filteredReleases.length === 0 ? (
              <div className={`py-12 px-6 text-center space-y-2 border rounded-xl ${
                isLight ? 'border-zinc-200 bg-white' : 'border-white/10 bg-white/5'
              }`}>
                <div className="text-xs font-mono text-zinc-400">
                  0 releases logged
                </div>
                <p className="text-xs text-zinc-500">
                  No release entries match this filter.
                </p>
                <button
                  type="button"
                  onClick={() => setReleaseFilter('All')}
                  className="mt-2 px-4 py-2 text-xs font-mono text-white bg-black hover:bg-zinc-800 rounded-lg cursor-pointer"
                >
                  Show All Releases
                </button>
              </div>
            ) : (
              filteredReleases.map((rel) => {
                const isExpanded = !!expandedReleaseIds[rel.id];
                return (
                  <article
                    key={rel.id}
                    className={`border rounded-xl p-5 sm:p-6 transition-all duration-200 space-y-3.5 shadow-lg ${
                      isLight
                        ? 'border-zinc-200 bg-white text-zinc-900 shadow-zinc-200/50 hover:border-zinc-400'
                        : 'border-white/10 bg-zinc-900/60 text-zinc-100 shadow-black/40 hover:border-sky-400/50 backdrop-blur-md'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold px-2.5 py-1 rounded-md border ${
                          isLight ? 'bg-zinc-100 text-zinc-900 border-zinc-300' : 'bg-white/10 text-white border-white/15'
                        }`}>
                          {rel.version}
                        </span>
                        <span className="text-sky-500 px-2.5 py-1 rounded-md bg-sky-950/20 border border-sky-800/30">
                          {rel.category}
                        </span>
                        <span className={isLight ? 'text-zinc-500' : 'text-zinc-400'}>{rel.date}</span>
                      </div>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {rel.changes.length} patches committed
                      </span>
                    </div>

                    <div>
                      <h3 className={`text-base sm:text-lg font-semibold tracking-tight ${isLight ? 'text-zinc-950' : 'text-white'}`}>
                        {rel.title}
                      </h3>
                      <p
                        className={`mt-2 text-xs sm:text-sm leading-relaxed ${
                          isLight ? 'text-zinc-700' : 'text-zinc-300'
                        } ${isExpanded ? '' : 'line-clamp-2'}`}
                      >
                        {rel.summary}
                      </p>
                    </div>

                    {isExpanded && (
                      <div className={`pt-3 border-t space-y-2 ${isLight ? 'border-zinc-200' : 'border-white/10'}`}>
                        <div className="text-xs font-mono text-sky-500 font-medium">
                          Changes & Enhancements:
                        </div>
                        <ul className="space-y-1.5 text-xs font-mono">
                          {rel.changes.map((change, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-sky-500 select-none">›</span>
                              <span className={`font-sans ${isLight ? 'text-zinc-700' : 'text-zinc-200'}`}>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => toggleRelease(rel.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                          isLight
                            ? 'bg-black text-white hover:bg-zinc-800 border border-black shadow-xs font-medium'
                            : 'bg-white/10 hover:bg-white/15 text-zinc-200 border border-white/20 hover:border-sky-400/50'
                        }`}
                      >
                        <span>{isExpanded ? 'Show less' : 'See more'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          PAGE 6 (SIXTH VIEW): COMPANY TEAM / WORK PERSONS SECTION
          SHOWS CIRCULAR PHOTOS, ROLES, BIOS, & SPECIALTIES
         ===================================================================== */}
      <CompanyTeamSection />

      {/* =====================================================================
          PAGE 7 (SEVENTH VIEW): PRICING & SPECIFICATIONS (SOLID RECTANGLES)
         ===================================================================== */}
      <section
        id="pricing"
        aria-label="Pricing"
        className={`border-b py-16 transition-colors duration-200 ${isLight ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-800 bg-zinc-950'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="space-y-1">
            <div className="text-xs font-mono text-sky-500">Tier & Primitives</div>
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isLight ? 'text-zinc-950' : 'text-white'}`}>
              Deterministic Pricing for Engineers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`border rounded-2xl p-6 space-y-4 shadow-xl ${
              isLight ? 'border-zinc-200 bg-white' : 'border-white/10 bg-zinc-900/60 backdrop-blur-md'
            }`}>
              <div className="text-xs font-mono text-zinc-500">Developer Local</div>
              <div className={`text-3xl font-bold font-mono ${isLight ? 'text-zinc-950' : 'text-white'}`}>$0 / mo</div>
              <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-300'}`}>
                Zero-cloud client function calling and 32K token local windows via @voxide/react.
              </p>
              <div className={`text-xs font-mono space-y-1.5 pt-3 border-t ${isLight ? 'border-zinc-200 text-zinc-700' : 'border-white/10 text-zinc-300'}`}>
                <div>· Local in-browser storage</div>
                <div>· Strict client CORS isolation</div>
                <div>· Deterministic PII regex filter</div>
              </div>
              <button
                type="button"
                onClick={() => setTab('chat')}
                className={`w-full py-2.5 text-xs font-mono rounded-xl transition-all cursor-pointer ${
                  isLight
                    ? 'bg-black text-white hover:bg-zinc-800 border border-black shadow-xs font-semibold'
                    : 'bg-white/10 hover:bg-white/15 text-zinc-100 border border-white/20 hover:border-sky-400/50'
                }`}
              >
                Start Local Runtime
              </button>
            </div>

            <div className={`border-2 rounded-2xl p-6 space-y-4 shadow-xl relative ${
              isLight ? 'border-sky-500 bg-white' : 'border-sky-500/80 bg-zinc-900/80 backdrop-blur-md'
            }`}>
              <div className="text-xs font-mono text-sky-500 font-bold">Production Node</div>
              <div className={`text-3xl font-bold font-mono ${isLight ? 'text-zinc-950' : 'text-white'}`}>$49 / mo</div>
              <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-300'}`}>
                Hosted pgvector + HNSW clustering with sub-350ms recall and 128K horizon management.
              </p>
              <div className={`text-xs font-mono space-y-1.5 pt-3 border-t ${isLight ? 'border-zinc-200 text-zinc-700' : 'border-white/10 text-zinc-300'}`}>
                <div>· Multi-agent partitioned memories</div>
                <div>· Sub-350ms vector query optimizer</div>
                <div>· Prometheus metrics endpoint</div>
              </div>
              <button
                type="button"
                onClick={() => setTab('settings')}
                className={`w-full py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md ${
                  isLight
                    ? 'bg-black text-white hover:bg-zinc-800 border border-black'
                    : 'bg-sky-400 hover:bg-sky-300 text-zinc-950'
                }`}
              >
                Configure Hosted Engine
              </button>
            </div>

            <div className={`border rounded-2xl p-6 space-y-4 shadow-xl ${
              isLight ? 'border-zinc-200 bg-white' : 'border-white/10 bg-zinc-900/60 backdrop-blur-md'
            }`}>
              <div className="text-xs font-mono text-zinc-500">Enterprise Cluster</div>
              <div className={`text-3xl font-bold font-mono ${isLight ? 'text-zinc-950' : 'text-white'}`}>Custom</div>
              <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-300'}`}>
                Dedicated Neo4j + MORK MeTTa symbolic reasoning clusters with single-tenant VPC peering.
              </p>
              <div className={`text-xs font-mono space-y-1.5 pt-3 border-t ${isLight ? 'border-zinc-200 text-zinc-700' : 'border-white/10 text-zinc-300'}`}>
                <div>· 1M+ token hierarchical pool</div>
                <div>· Dedicated VPC peering</div>
                <div>· Custom compliance audit logs</div>
              </div>
              <button
                type="button"
                onClick={() => setTab('analytics')}
                className={`w-full py-2.5 text-xs font-mono rounded-xl transition-all cursor-pointer ${
                  isLight
                    ? 'bg-black text-white hover:bg-zinc-800 border border-black shadow-xs font-semibold'
                    : 'bg-white/10 hover:bg-white/15 text-zinc-100 border border-white/20 hover:border-sky-400/50'
                }`}
              >
                Telemetry Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PAGE 8 (EIGHTH VIEW): END OF PAGE MODERN ARCHITECTURAL HOUSE IMAGE
          WITH THE FOOTER TEXTS OVERLAID AT THE END OF THE PAGE
         ===================================================================== */}
      <section
        aria-label="Ambient Architectural Environment Panorama"
        className={`relative w-full min-h-[720px] h-[85vh] sm:h-[92vh] lg:h-[95vh] overflow-hidden ${
          isLight ? 'bg-zinc-100' : 'bg-zinc-950'
        }`}
      >
        {/* Full-Cover Edge-to-Edge House Environment Image */}
        {!houseImgFailed ? (
          <div className="absolute inset-0 overflow-hidden pointer-events-none reflective-image">
            <img
              src={HOUSE_END_PAGE_IMAGE}
              alt="Modern architectural glass house nestled in nature with ambient lighting"
              referrerPolicy="no-referrer"
              onError={() => setHouseImgFailed(true)}
              className="w-full h-full object-cover object-center animate-slow-zoom brightness-95"
            />
          </div>
        ) : (
          <div className={`w-full h-full ${
            isLight
              ? 'bg-gradient-to-r from-sky-100 via-zinc-200 to-indigo-100'
              : 'bg-gradient-to-r from-sky-950 via-zinc-900 to-indigo-950'
          }`} />
        )}

        {/* Transparent Animated Gradient Wash over the end-of-page artwork */}
        <div className="absolute inset-0 hero-animated-gradient opacity-20 pointer-events-none" />

        {/* Smooth Legibility Gradient Only Where the Footer Text Sits */}
        <div
          className={`absolute inset-x-0 bottom-0 h-2/3 pointer-events-none ${
            isLight
              ? 'bg-gradient-to-t from-white/90 via-white/45 to-transparent'
              : 'bg-gradient-to-t from-black/85 via-black/45 to-transparent'
          }`}
        />

        {/* End-of-Page Footer Texts */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-4 sm:px-6 pb-5 sm:pb-7">
          <div className="max-w-7xl mx-auto glass-footer relative overflow-hidden rounded-2xl p-5 sm:p-7 shadow-2xl">
            <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 pb-5 border-b ${
              isLight ? 'border-zinc-300/70' : 'border-white/10'
            }`}>
              <div className="md:col-span-6 space-y-2">
                <div className="text-lg font-extrabold tracking-tight animated-gradient-text">
                  Afro Lab
                </div>
              </div>

              <div className="md:col-span-3 space-y-2 text-xs">
                <h4 className={`font-semibold ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
                  Product
                </h4>
                <ul className={`space-y-1.5 ${isLight ? 'text-zinc-600' : 'text-zinc-300'}`}>
                  <li><button type="button" onClick={() => setTab('chat')} className={`cursor-pointer ${isLight ? 'hover:text-black' : 'hover:text-white'}`}>AI Workspace</button></li>
                  <li><button type="button" onClick={() => setTab('context')} className={`cursor-pointer ${isLight ? 'hover:text-black' : 'hover:text-white'}`}>Context Observability</button></li>
                  <li><button type="button" onClick={() => setTab('memory')} className={`cursor-pointer ${isLight ? 'hover:text-black' : 'hover:text-white'}`}>Memory Manager</button></li>
                  <li><button type="button" onClick={() => setTab('tasks')} className={`cursor-pointer ${isLight ? 'hover:text-black' : 'hover:text-white'}`}>Long-Horizon Tasks</button></li>
                </ul>
              </div>

              <div className="md:col-span-3 space-y-2 text-xs">
                <h4 className={`font-semibold ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
                  Developers
                </h4>
                <ul className={`space-y-1.5 ${isLight ? 'text-zinc-600' : 'text-zinc-300'}`}>
                  <li><a href="https://www.npmjs.com" target="_blank" rel="noreferrer" className="hover:text-sky-400">Documentation ↗</a></li>
                  <li><button type="button" onClick={() => setTab('settings')} className={`cursor-pointer ${isLight ? 'hover:text-black' : 'hover:text-white'}`}>Settings</button></li>
                </ul>
              </div>
            </div>

            <div className={`pt-4 flex flex-wrap items-center justify-between gap-3 text-xs ${
              isLight ? 'text-zinc-600' : 'text-zinc-400'
            }`}>
              <div>© 2026 Afro Lab. All rights reserved.</div>
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                <span className="font-semibold">Operational</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
