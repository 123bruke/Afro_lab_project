import React, { useState } from 'react';
import { BarChart3, Check, ChevronDown, RefreshCw } from 'lucide-react';
import { useContextFlow } from '../context/ContextFlowContext';
import { WorkspaceSettings } from '../types/contextflow';
import { AnalyticsView } from './AnalyticsView';

export const SettingsView: React.FC = () => {
  const { state, updateSettings, notify } = useContextFlow();
  const [form, setForm] = useState<WorkspaceSettings>(state.settings);
  const [testingPing, setTestingPing] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
  };

  const handleTestConnection = () => {
    setTestingPing(true);
    window.setTimeout(() => {
      setTestingPing(false);
      updateSettings({ engineConnected: true });
      notify('Local Context Engine reachable · Handshake 4ms');
    }, 300);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
            Settings
          </h1>
          <p className="text-xs mt-0.5 font-semibold animated-gradient-text">
            ContextFlow
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-950 bg-sky-400 hover:bg-sky-300 rounded-sm transition-colors duration-150 whitespace-nowrap"
        >
          <Check className="w-3.5 h-3.5 icon-premium" aria-hidden="true" />
          <span>Save Configuration</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-5 text-xs">
        {/* 1. Workspace */}
        <section className="border border-zinc-800 bg-zinc-900/35 rounded-md p-4 space-y-4">
          <div className="border-b border-zinc-800 pb-2.5">
            <h2 className="text-xs font-semibold text-zinc-200">Workspace</h2>
            <p className="text-[11px] font-mono text-zinc-500">
              Workspace identity, interface density, and default session continuity behavior
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-zinc-400 mb-1">
                Workspace Name
              </label>
              <input
                type="text"
                value={form.workspaceName}
                onChange={(e) => setForm({ ...form, workspaceName: e.target.value })}
                className="w-full px-3 py-2 font-mono bg-zinc-950 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-mono text-zinc-400 mb-1">
                Theme Profile
              </label>
              <select
                value={form.theme}
                onChange={(e) => {
                  const nextTheme = e.target.value as WorkspaceSettings['theme'];
                  setForm({
                    ...form,
                    theme: nextTheme,
                    colorMode: nextTheme === 'light-zinc' ? 'light' : 'dark',
                  });
                }}
                className="w-full px-3 py-2 font-mono bg-zinc-950 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
              >
                <option value="dark-zinc">Zinc-950 Developer Dark</option>
                <option value="high-contrast-slate">Slate-950 High Contrast</option>
                <option value="light-zinc">Zinc-50 Developer Light</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-zinc-400 mb-1">
                Default Session Behavior
              </label>
              <select
                value={form.defaultBehavior}
                onChange={(e) =>
                  setForm({
                    ...form,
                    defaultBehavior: e.target.value as WorkspaceSettings['defaultBehavior'],
                  })
                }
                className="w-full px-3 py-2 font-mono bg-zinc-950 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
              >
                <option value="auto-recover">Auto-recover top task memories</option>
                <option value="prompt-recover">Prompt before restoring session</option>
                <option value="clean-session">Start clean buffer per session</option>
              </select>
            </div>
          </div>
        </section>

        {/* 2. Context */}
        <section className="border border-zinc-800 bg-zinc-900/35 rounded-md p-4 space-y-4">
          <div className="border-b border-zinc-800 pb-2.5">
            <h2 className="text-xs font-semibold text-zinc-200">Context</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono tabular-nums">
            <div>
              <label className="block text-zinc-400 mb-1">
                Maximum Token Budget
              </label>
              <select
                value={form.maxTokenBudget}
                onChange={(e) =>
                  setForm({ ...form, maxTokenBudget: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
              >
                <option value={64000}>64,000 tokens</option>
                <option value={128000}>128,000 tokens</option>
                <option value={200000}>200,000 tokens</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">
                Compression Threshold ({form.compressionThreshold}%)
              </label>
              <input
                type="number"
                min={50}
                max={95}
                value={form.compressionThreshold}
                onChange={(e) =>
                  setForm({ ...form, compressionThreshold: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">
                Memory Retrieval Limit (top-K)
              </label>
              <input
                type="number"
                min={2}
                max={32}
                value={form.memoryRetrievalLimit}
                onChange={(e) =>
                  setForm({ ...form, memoryRetrievalLimit: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </section>

        {/* 3. Storage */}
        <section className="border border-zinc-800 bg-zinc-900/35 rounded-md p-4 space-y-4">
          <div className="border-b border-zinc-800 pb-2.5">
            <h2 className="text-xs font-semibold text-zinc-200">Storage</h2>
            <p className="text-[11px] font-mono text-zinc-500">
              Vector database backend, local persistence path, and knowledge source indexing
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-zinc-400 mb-1">
                Vector Storage Engine
              </label>
              <select
                value={form.vectorStorage}
                onChange={(e) =>
                  setForm({
                    ...form,
                    vectorStorage: e.target.value as WorkspaceSettings['vectorStorage'],
                  })
                }
                className="w-full px-3 py-2 font-mono bg-zinc-950 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
              >
                <option value="pgvector (PostgreSQL 16)">pgvector (PostgreSQL 16)</option>
                <option value="ChromaDB Local">ChromaDB Local</option>
                <option value="Qdrant Embedded">Qdrant Embedded</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-zinc-400 mb-1">
                Local Storage Volume Path
              </label>
              <input
                type="text"
                value={form.localStoragePath}
                onChange={(e) => setForm({ ...form, localStoragePath: e.target.value })}
                className="w-full px-3 py-2 font-mono bg-zinc-950 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.autoIndexKnowledge}
              onChange={(e) =>
                setForm({ ...form, autoIndexKnowledge: e.target.checked })
              }
              className="accent-sky-400"
            />
            <span>
              Automatically chunk and index new documents attached in the Chat Workspace
            </span>
          </label>
        </section>

        {/* 4. Model */}
        <section className="border border-zinc-800 bg-zinc-900/35 rounded-md p-4 space-y-4">
          <div className="border-b border-zinc-800 pb-2.5">
            <h2 className="text-xs font-semibold text-zinc-200">Model</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono tabular-nums">
            <div>
              <label className="block text-zinc-400 mb-1">Model Target</label>
              <select
                value={form.modelTarget}
                onChange={(e) => setForm({ ...form, modelTarget: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
              >
                <option value="gemini-2.5-pro-long-context">
                  gemini-2.5-pro-long-context
                </option>
                <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                <option value="local-qwen-2.5-coder-32b">
                  local-qwen-2.5-coder-32b
                </option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">
                Temperature ({form.temperature})
              </label>
              <input
                type="number"
                step="0.05"
                min={0}
                max={1}
                value={form.temperature}
                onChange={(e) =>
                  setForm({ ...form, temperature: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">
                Maximum Output Tokens
              </label>
              <select
                value={form.maxOutputTokens}
                onChange={(e) =>
                  setForm({ ...form, maxOutputTokens: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
              >
                <option value={4096}>4,096 tokens</option>
                <option value={8192}>8,192 tokens</option>
                <option value={16384}>16,384 tokens</option>
              </select>
            </div>
          </div>
        </section>

        {/* 5. API */}
        <section className="border border-zinc-800 bg-zinc-900/35 rounded-md p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
            <div>
              <h2 className="text-xs font-semibold text-zinc-200">API</h2>
            </div>

            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
              <span>{form.engineConnected ? 'Connected · 4ms' : 'Disconnected'}</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div className="flex-1">
              <label className="block font-mono text-zinc-400 mb-1">
                Context Engine Endpoint
              </label>
              <input
                type="text"
                value={form.apiEndpoint}
                onChange={(e) => setForm({ ...form, apiEndpoint: e.target.value })}
                className="w-full px-3 py-2 font-mono bg-zinc-950 border border-zinc-800 rounded-sm text-zinc-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testingPing}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-mono text-zinc-200 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-sm transition-colors whitespace-nowrap"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${testingPing ? 'animate-spin text-sky-400' : ''}`}
                aria-hidden="true"
              />
              <span>Test Connection</span>
            </button>
          </div>
        </section>
      </form>

      {/* 6. Analytics (controlled from Settings) */}
      <section className="border border-zinc-800 bg-zinc-900/35 rounded-md overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAnalytics((v) => !v)}
          aria-expanded={showAnalytics}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left cursor-pointer hover:bg-zinc-900/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sky-400 icon-premium" aria-hidden="true" />
            <div>
              <h2 className="text-xs font-semibold text-zinc-200">
                Analytics Dashboard
              </h2>
              <p className="text-[11px] font-mono text-zinc-500">
                Developer telemetry, context utilization, compression and memory growth
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
              showAnalytics ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {showAnalytics && (
          <div className="border-t border-zinc-800 -mx-4 sm:-mx-6">
            <AnalyticsView />
          </div>
        )}
      </section>
    </div>
  );
};
