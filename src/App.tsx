/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ContextFlowProvider, useContextFlow } from './context/ContextFlowContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { CommandMenu } from './components/ui/CommandMenu';
import { CursorEffects } from './components/ui/CursorEffects';
import { HomeView } from './views/HomeView';
import { DashboardView } from './views/DashboardView';
import { ChatWorkspaceView } from './views/ChatWorkspaceView';
import { MemoryManagerView } from './views/MemoryManagerView';
import { ContextObservabilityView } from './views/ContextObservabilityView';
import { TasksView } from './views/TasksView';
import { KnowledgeBaseView } from './views/KnowledgeBaseView';
import { AgentsView } from './views/AgentsView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';
import { NavigationTab } from './types/contextflow';

const SHORTCUT_MAP: Record<string, NavigationTab> = {
  '0': 'home',
  '1': 'dashboard',
  '2': 'tasks',
  '3': 'chat',
  '4': 'memory',
  '5': 'context',
  '6': 'knowledge',
  '7': 'agents',
  '8': 'analytics',
  '9': 'settings',
};

const WorkspaceShell: React.FC = () => {
  const { state, setTab } = useContextFlow();
  const isLight = state.settings.colorMode === 'light';

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [isLight]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && SHORTCUT_MAP[e.key]) {
        e.preventDefault();
        setTab(SHORTCUT_MAP[e.key]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setTab]);

  const renderMainContent = () => {
    switch (state.activeTab) {
      case 'home':
        return <HomeView />;
      case 'dashboard':
        return <DashboardView />;
      case 'tasks':
        return <TasksView />;
      case 'chat':
        return <ChatWorkspaceView />;
      case 'memory':
        return <MemoryManagerView />;
      case 'context':
        return <ContextObservabilityView />;
      case 'knowledge':
        return <KnowledgeBaseView />;
      case 'agents':
        return <AgentsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <ChatWorkspaceView />;
    }
  };

  const isFullHeightWorkspace = state.activeTab === 'chat';

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden ${
        isLight
          ? 'bg-zinc-50 text-zinc-900'
          : state.settings.theme === 'high-contrast-slate'
          ? 'bg-slate-950 text-zinc-100'
          : 'bg-zinc-950 text-zinc-100'
      }`}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopHeader />

        <div
          id="app-scroll-root"
          className={`flex-1 min-h-0 ${
            isFullHeightWorkspace ? 'overflow-hidden' : 'overflow-y-auto'
          }`}
        >
          {renderMainContent()}
        </div>
      </div>

      <CommandMenu />

      {/* Cursor-follow light + tiny click flash */}
      <CursorEffects />

      {/* Subtle Developer Feedback Toast */}
      {state.toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 px-3.5 py-2 border border-zinc-700 bg-zinc-900 text-xs font-mono text-zinc-100 rounded-sm shadow-lg flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" aria-hidden="true" />
          <span>{state.toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ContextFlowProvider>
      <WorkspaceShell />
    </ContextFlowProvider>
  );
}
