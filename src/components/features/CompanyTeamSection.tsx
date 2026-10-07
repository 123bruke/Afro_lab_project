import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { useContextFlow } from '../../context/ContextFlowContext';
import teamArchitect from '../../assets/images/team_architect_1791338239533.jpg';
import teamResearcher from '../../assets/images/team_researcher_1791338250170.jpg';
import teamSystems from '../../assets/images/team_systems_1791338262736.jpg';
import teamDx from '../../assets/images/team_dx_1791338273483.jpg';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  specialty: string;
  githubUser: string;
  twitterUser: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'marcus',
    name: 'Marcus Vance',
    role: 'Principal Systems Architect',
    bio: 'Pioneered deterministic context caching and MeTTa graph unification pipelines.',
    photoUrl: teamArchitect,
    specialty: 'Distributed Graph Engine & MORK Symbolic Unification',
    githubUser: 'marcusvance',
    twitterUser: 'marcus_vance',
  },
  {
    id: 'elena',
    name: 'Dr. Elena Rostova',
    role: 'Head of Cognitive Context',
    bio: 'Specialized in semantic token pruning algorithms and hybrid dense-sparse RRF retrieval.',
    photoUrl: teamResearcher,
    specialty: 'pgvector HNSW Cosine Indexing & Semantic Pruning',
    githubUser: 'elena-rostova',
    twitterUser: 'dr_elena_ai',
  },
  {
    id: 'devon',
    name: 'Devon Takahashi',
    role: 'Lead Runtime Infrastructure',
    bio: 'Architected high-throughput hosted engine ingress and zero-copy gRPC streaming.',
    photoUrl: teamSystems,
    specialty: 'CORS Security Proxies, Kernel I/O & Memory Compaction',
    githubUser: 'devontakahashi',
    twitterUser: 'devon_taka',
  },
  {
    id: 'sophia',
    name: 'Sophia Lindqvist',
    role: 'Developer Experience Lead',
    bio: 'Creator of @voxide/react client-side capability hooks and DOM state sync.',
    photoUrl: teamDx,
    specialty: 'Client-Side Function Calling & AST Type-Checking',
    githubUser: 'sophialind',
    twitterUser: 'sophia_codes',
  },
  {
    id: 'alex',
    name: 'Alex Chen',
    role: 'Vector Index Optimization',
    bio: 'Engineered sub-38ms p95 SIMD distance calculations on pgvector partitions.',
    photoUrl: teamArchitect,
    specialty: 'SIMD HNSW Clustering & Vector Sharding',
    githubUser: 'alexchen',
    twitterUser: 'alex_chen_dev',
  },
  {
    id: 'maya',
    name: 'Maya Patel',
    role: 'Symbolic Knowledge Engineering',
    bio: 'Authored BioCypher biomedical graph adapters and MeTTa rule bindings.',
    photoUrl: teamResearcher,
    specialty: 'Ontology Mappings & BioCypher Bridge',
    githubUser: 'mayapatel',
    twitterUser: 'maya_ai_sys',
  },
  {
    id: 'liam',
    name: 'Liam O’Connor',
    role: 'Edge Runtime & Security',
    bio: 'Maintains per-origin CORS policy enforcement and PII pre-redaction engines.',
    photoUrl: teamSystems,
    specialty: 'Cryptographic Enclaves & Sandbox Redaction',
    githubUser: 'liamoconnor',
    twitterUser: 'liam_edge',
  },
  {
    id: 'zahra',
    name: 'Zahra Al-Mansoor',
    role: 'Context Observability Lead',
    bio: 'Built real-time token telemetry pipelines and rolling window inspection tools.',
    photoUrl: teamDx,
    specialty: 'Window Telemetry & Prometheus Metrics Exporter',
    githubUser: 'zahra_dev',
    twitterUser: 'zahra_codes',
  },
];

export const CompanyTeamSection: React.FC = () => {
  const { state } = useContextFlow();
  const isLight = state.settings.colorMode === 'light';

  return (
    <section
      id="company-team"
      aria-label="Engine Builders & Engineering Team"
      className={`relative w-full py-20 border-b overflow-hidden transition-colors duration-200 ${
        isLight ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-800 bg-zinc-950'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 text-center space-y-3">
        <h2 className={`text-2xl sm:text-4xl font-bold tracking-tight ${isLight ? 'text-zinc-950' : 'text-white'}`}>
          ContextFlow Core Contributors
        </h2>
        <p className={`text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
          Engineered by researchers and systems practitioners dedicated to deterministic long-horizon intelligence.
        </p>
      </div>

      {/* Scrolling Team Carousel with Gradient Hiding Masks on Both Sides */}
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

        <div className="flex animate-marquee-left pause-on-hover gap-5 px-6">
          {[...TEAM_MEMBERS, ...TEAM_MEMBERS].map((member, idx) => (
            <div
              key={`${member.id}-${idx}`}
              className={`w-[280px] sm:w-[310px] shrink-0 rounded-2xl border p-5 transition-all duration-300 flex flex-col items-center text-center justify-between group hover:scale-105 ${
                isLight
                  ? 'border-zinc-200 bg-white text-zinc-900 shadow-xl shadow-zinc-200/50 hover:shadow-2xl hover:border-zinc-400'
                  : 'border-white/10 bg-zinc-900/80 backdrop-blur-md text-zinc-100 shadow-2xl shadow-black/80 hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] hover:border-sky-400/50'
              }`}
            >
              <div className="space-y-3 w-full flex flex-col items-center">
                {/* Circular Image for Developer People */}
                <div className={`relative w-24 h-24 rounded-full overflow-hidden border-2 shadow-xl group-hover:scale-105 transition-transform duration-300 ${
                  isLight
                    ? 'border-sky-500 shadow-sky-500/20 bg-zinc-100'
                    : 'border-sky-400/50 shadow-sky-500/10 bg-zinc-950'
                }`}>
                  <img
                    src={member.photoUrl}
                    alt={`${member.name} - ${member.role}`}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                {/* Details */}
                <div className="space-y-1 w-full">
                  <h3 className={`text-base font-bold tracking-tight transition-colors ${
                    isLight ? 'text-zinc-950 group-hover:text-sky-600' : 'text-white group-hover:text-sky-200'
                  }`}>
                    {member.name}
                  </h3>
                  <div className="text-xs font-medium text-sky-500 font-mono">
                    {member.role}
                  </div>
                  <p className={`text-xs leading-relaxed pt-1 line-clamp-2 ${
                    isLight ? 'text-zinc-700' : 'text-zinc-300'
                  }`}>
                    {member.bio}
                  </p>
                </div>
              </div>

              {/* Specialty & Social Links */}
              <div className={`pt-3 mt-3 w-full border-t flex items-center justify-between text-xs font-mono ${
                isLight ? 'border-zinc-200 text-zinc-600' : 'border-white/10 text-zinc-400'
              }`}>
                <span className={`text-[10px] truncate max-w-[150px] text-left ${
                  isLight ? 'text-zinc-500' : 'text-zinc-500'
                }`}>
                  {member.specialty}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} on GitHub`}
                    className={`p-1 transition-colors ${
                      isLight ? 'text-zinc-700 hover:text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} on X`}
                    className={`p-1 transition-colors ${
                      isLight ? 'text-zinc-700 hover:text-sky-600' : 'text-zinc-400 hover:text-sky-400'
                    }`}
                  >
                    <Twitter className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    className={`p-1 transition-colors ${
                      isLight ? 'text-zinc-700 hover:text-sky-600' : 'text-zinc-400 hover:text-sky-400'
                    }`}
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
