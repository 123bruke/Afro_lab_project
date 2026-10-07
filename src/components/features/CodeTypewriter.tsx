import React, { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';

interface CodeSnippet {
  filename: string;
  code: string;
}

const SNIPPETS: CodeSnippet[] = [
  {
    filename: 'agent-orchestrator.ts',
    code: `import { ContextFlowAgent, PgVectorStore } from '@contextflow/sdk';

// Initialize autonomous agent with 128K budget
const agent = new ContextFlowAgent({
  horizon: 'long-term',
  memory: new PgVectorStore({ efSearch: 64 }),
  maxTokens: 128_000,
});

// Recover previous session and active decisions
const session = await agent.recoverSession('sess_42');
console.log('Context ready:', session.activeMemories.length);`,
  },
  {
    filename: 'capability-hooks.tsx',
    code: `import { useCapability } from '@voxide/react';

// Register deterministic client function calling
useCapability({
  name: 'syncBioCypherGraph',
  description: 'Traverses Neo4j pathway subgraphs',
  execute: async ({ pathwayId }) => {
    return await neo4j.traverseSubgraphs({
      pathwayId,
      batchSize: 2500,
    });
  },
});`,
  },
  {
    filename: 'context-compression.ts',
    code: `// Perform semantic context window compression
const compressed = await agent.compressContext({
  threshold: 0.75,
  preservePinned: true,
  pruneHistoryTurns: 12,
});

// Commit episodic memory to pgvector
await agent.commitEpisodicCheckpoint({
  status: 'Phase completed',
  savedTokens: 3_400,
});`,
  },
];

export const CodeTypewriter: React.FC = () => {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const currentSnippet = SNIPPETS[snippetIndex];

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < currentSnippet.code.length) {
        const nextChar = currentSnippet.code[displayText.length];
        const speed = nextChar === '\n' ? 60 : 20 + Math.random() * 12;
        timeout = setTimeout(() => {
          setDisplayText(currentSnippet.code.slice(0, displayText.length + 1));
        }, speed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 3000);
      }
    } else {
      if (displayText.length > 0) {
        const deleteStep = displayText.length > 30 ? 2 : 1;
        timeout = setTimeout(() => {
          setDisplayText(currentSnippet.code.slice(0, Math.max(0, displayText.length - deleteStep)));
        }, 12);
      } else {
        setIsDeleting(false);
        setSnippetIndex((prev) => (prev + 1) % SNIPPETS.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, snippetIndex, currentSnippet.code]);

  const renderHighlightedCode = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      if (line.trim().startsWith('//')) {
        return (
          <div key={lineIdx} className="text-zinc-500 font-mono italic">
            {line}
          </div>
        );
      }

      const parts = line.split(/(\b(?:import|from|const|await|new|async|return|console|export)\b|'[^']*'|`[^`]*`|\d+[\d_]*)/g);

      return (
        <div key={lineIdx} className="leading-relaxed">
          {parts.map((part, pIdx) => {
            if (/^(?:import|from|const|await|new|async|return|export)$/.test(part)) {
              return (
                <span key={pIdx} className="text-sky-400 font-semibold">
                  {part}
                </span>
              );
            }
            if (/^(?:console)$/.test(part)) {
              return (
                <span key={pIdx} className="text-amber-400">
                  {part}
                </span>
              );
            }
            if (/^'[^']*'|`[^`]*`$/.test(part)) {
              return (
                <span key={pIdx} className="text-emerald-400">
                  {part}
                </span>
              );
            }
            if (/^\d+[\d_]*$/.test(part)) {
              return (
                <span key={pIdx} className="text-purple-400">
                  {part}
                </span>
              );
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="w-full border border-white/10 bg-zinc-950/95 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md pointer-events-none select-none">
      {/* Editor Window Header: Pure subtle dots + filename */}
      <div className="h-9 px-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
          <Terminal className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
          <span>{currentSnippet.filename}</span>
        </div>

        <div className="w-10" />
      </div>

      {/* Code Text Area with Line Numbers */}
      <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] text-zinc-200 min-h-[240px] max-h-[310px] overflow-hidden">
        <div className="flex gap-4">
          <div
            className="select-none text-right text-zinc-600 font-mono pr-3 border-r border-white/10 shrink-0"
            aria-hidden="true"
          >
            {displayText.split('\n').map((_, idx) => (
              <div key={idx} className="leading-relaxed">
                {idx + 1}
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-hidden">
            {renderHighlightedCode(displayText)}
            <span
              className="inline-block w-2 h-4 bg-sky-400 ml-0.5 align-middle animate-pulse"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
