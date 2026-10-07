import React from 'react';
import {
  Home,
  LayoutDashboard,
  ListChecks,
  Terminal,
  Settings,
  X,
  Layers,
} from 'lucide-react';
import { useContextFlow } from '../../context/ContextFlowContext';
import { NavigationTab } from '../../types/contextflow';

interface NavItem {
  id: NavigationTab;
  label: string;
  shortcut: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', shortcut: '0', icon: Home },
  { id: 'dashboard', label: 'Dashboard', shortcut: '1', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', shortcut: '2', icon: ListChecks },
  { id: 'chat', label: 'Chat', shortcut: '3', icon: Terminal },
  { id: 'settings', label: 'Settings', shortcut: '9', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { state, setTab, setMobileSidebar } = useContextFlow();
  const { activeTab, isMobileSidebarOpen, settings } = state;
  const isLight = settings.colorMode === 'light';

  const navigateToSection = (sectionId: string) => {
    setMobileSidebar(false);
    if (activeTab !== 'home') {
      setTab('home');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderSidebarContent = () => (
    <div
      className={`flex flex-col h-full border-r select-none transition-colors duration-200 ${
        isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
      }`}
    >
      {/* Brand Header */}
      <div className={`h-14 px-3.5 border-b flex items-center justify-between shrink-0 ${
        isLight ? 'border-zinc-200' : 'border-zinc-800'
      }`}>
        <div className="min-w-0 flex items-center gap-2.5">
          <span className="icon-tile icon-tile-active" aria-hidden="true">
            <Layers className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <div className={`text-sm font-bold tracking-tight truncate ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
              ContextFlow
            </div>
            <div className={`text-[11px] font-mono truncate ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
              v1.0 · Local Engine
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileSidebar(false)}
          aria-label="Hide navigation"
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isLight ? 'text-zinc-700 hover:text-black hover:bg-zinc-100' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav
        aria-label="Primary Workspace Navigation"
        className="flex-1 py-2.5 px-2 space-y-1 overflow-y-auto"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTab(item.id);
                setMobileSidebar(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                isActive
                  ? isLight
                    ? 'bg-black text-white border border-black shadow-xs'
                    : 'bg-zinc-900 text-zinc-100 border border-zinc-700/80 shadow-xs'
                  : isLight
                  ? 'text-zinc-700 hover:text-black hover:bg-zinc-100 border border-transparent'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <span className={`icon-tile ${isActive ? 'icon-tile-active' : ''}`}>
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? (isLight ? 'text-white' : 'text-sky-300') : 'text-zinc-400'
                    }`}
                  />
                </span>
                <span className="truncate">{item.label}</span>
              </span>
              <span className={`text-[10px] font-mono tabular-nums ml-2 ${
                isActive ? (isLight ? 'text-zinc-300' : 'text-zinc-400') : 'text-zinc-500'
              }`}>
                {item.shortcut}
              </span>
            </button>
          );
        })}

        {/* Quick Landing Sections on Drawer */}
        <div className={`pt-3 mt-3 border-t space-y-1 ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}>
          <div className={`px-2.5 text-[10px] font-mono uppercase tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
            Landing Sections
          </div>
          <button
            type="button"
            onClick={() => navigateToSection('features')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
              isLight ? 'bg-black text-white' : 'text-zinc-300 hover:bg-white/5'
            }`}
          >
            Features & Engine
          </button>
          <button
            type="button"
            onClick={() => navigateToSection('product-versions')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
              isLight ? 'bg-black text-white' : 'text-zinc-300 hover:bg-white/5'
            }`}
          >
            Product Versions
          </button>
          <button
            type="button"
            onClick={() => navigateToSection('trusted-ecosystem')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
              isLight ? 'bg-black text-white' : 'text-zinc-300 hover:bg-white/5'
            }`}
          >
            AI Ecosystem
          </button>
          <button
            type="button"
            onClick={() => navigateToSection('company-team')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
              isLight ? 'bg-black text-white' : 'text-zinc-300 hover:bg-white/5'
            }`}
          >
            Engineering Team
          </button>
          <button
            type="button"
            onClick={() => navigateToSection('pricing')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
              isLight ? 'bg-black text-white' : 'text-zinc-300 hover:bg-white/5'
            }`}
          >
            Pricing & Primitives
          </button>
        </div>
      </nav>

      {/* Bottom Engine Status */}
      <div className={`p-3 border-t shrink-0 ${
        isLight ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-800 bg-zinc-950'
      }`}>
        <div className="flex items-center justify-between text-xs">
          <span className={`font-medium truncate ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>Local Engine</span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-500 whitespace-nowrap">
            <span
              aria-hidden="true"
              className={`w-1.5 h-1.5 rounded-full ${
                settings.engineConnected ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            <span className="font-semibold">{settings.engineConnected ? 'Connected' : 'Offline'}</span>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Slide-over Navigation Drawer (hidden by default; opened from the corner menu button) */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-[55] flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-xs"
            onClick={() => setMobileSidebar(false)}
          />
          <div className="relative w-64 max-w-[85vw] h-full z-10 shadow-2xl animate-slide-in-left">
            {renderSidebarContent()}
          </div>
        </div>
      )}
    </>
  );
};