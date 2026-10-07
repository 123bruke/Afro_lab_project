import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  Ellipsis,
  LogOut,
  Moon,
  SlidersHorizontal,
  Sparkles,
  Sun,
  User,
} from 'lucide-react';
import { useContextFlow } from '../../context/ContextFlowContext';
import { AuthModal } from '../ui/AuthModal';

export const TopHeader: React.FC = () => {
  const {
    state,
    setTab,
    toggleColorMode,
    setMobileSidebar,
    setMobileInspector,
    loginUser,
    logoutUser,
  } = useContextFlow();

  const isLight = state.settings.colorMode === 'light';
  const user = state.user;

  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const root =
      document.getElementById('app-scroll-root') || document.documentElement;
    const update = () => {
      const top =
        root === document.documentElement ? window.scrollY : root.scrollTop;
      setIsNavVisible(top > 40);
    };
    update();
    root.addEventListener('scroll', update, { passive: true });
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      root.removeEventListener('scroll', update);
      window.removeEventListener('scroll', update);
    };
  }, []);

  const navigateToHomeSection = (sectionId: string) => {
    if (state.activeTab !== 'home') {
      setTab('home');
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Features', id: 'features' },
    { label: 'Engine', id: 'demo-engine' },
    { label: 'Versions', id: 'product-versions' },
    { label: 'Ecosystem', id: 'trusted-ecosystem' },
    { label: 'Team', id: 'company-team' },
    { label: 'Pricing', id: 'pricing' },
  ];

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const reader = new FileReader();
    reader.onload = () => {
      loginUser({ ...user, photoUrl: String(reader.result) });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="sticky top-0 z-40 shrink-0">
      <header
        className={`h-14 px-3 sm:px-6 border-b transition-colors duration-200 flex items-center justify-between backdrop-blur-md ${
          isLight
            ? 'border-zinc-200 bg-white/90 text-zinc-900 shadow-xs'
            : 'border-zinc-800/80 bg-zinc-950/90 text-zinc-100'
        }`}
      >
        {/* Zone 1: Brand Wordmark & Mobile Drawer Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileSidebar(true)}
            aria-label="Show navigation"
            aria-expanded={state.isMobileSidebarOpen}
            className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
              isLight
                ? 'bg-black text-white hover:bg-zinc-800 border-black shadow-xs'
                : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:border-sky-400/40'
            }`}
          >
            <Ellipsis className="w-5 h-5 icon-premium" />
          </button>
          <button
            type="button"
            onClick={() => setTab('home')}
            className={`text-sm sm:text-base font-semibold tracking-tight transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-2 group ${
              isLight
                ? 'text-zinc-950 hover:text-sky-600'
                : 'text-zinc-100 hover:text-sky-400'
            }`}
          >
            <span className="icon-tile icon-tile-active transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold">ContextFlow</span>
          </button>
        </div>

        {/* Zone 2: Desktop Navigation Bar in Semi-Transparent Blurred Pill */}
        <nav
          aria-label="Primary Navigation"
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-500 ${
            isNavVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          } ${
            isLight
              ? 'border-zinc-200/70 bg-white/35 backdrop-blur-2xl shadow-sm shadow-zinc-900/5'
              : 'border-white/15 bg-white/5 backdrop-blur-2xl shadow-sm shadow-zinc-950/40'
          }`}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigateToHomeSection(item.id)}
              className={`px-3.5 py-1 rounded-full text-sm font-semibold tracking-tight transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isLight
                  ? 'bg-black text-white hover:bg-zinc-800 border border-black shadow-xs'
                  : 'text-zinc-200 hover:text-white hover:bg-white/15'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Utility Controls (Theme, Account, Workspace Buttons) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleColorMode}
            aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-center shrink-0 cursor-pointer ${
              isLight
                ? 'bg-black text-white hover:bg-zinc-800 border-black shadow-xs'
                : 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white text-white'
            }`}
          >
            {isLight ? (
              <Moon className="w-4 h-4 text-white icon-premium" aria-hidden="true" />
            ) : (
              <Sun className="w-4 h-4 text-white icon-premium" aria-hidden="true" />
            )}
          </button>

          <div className="relative shrink-0">
            {user ? (
              <button
                type="button"
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-label="Account menu"
                title="Account"
                className="w-9 h-9 rounded-lg border overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-200 bg-white/10 border-white/20 dark:border-white/20"
              >
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-sky-500 to-indigo-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                aria-label="Create account or sign in"
                title="Premium account"
                className="p-2 rounded-lg border transition-all duration-200 cursor-pointer bg-white/10 border-white/20 text-white hover:border-sky-400/50"
              >
                <User className="w-4 h-4 icon-premium" aria-hidden="true" />
              </button>
            )}

            {isMenuOpen && user && (
              <>
                <button
                  type="button"
                  aria-label="Close account menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 z-50 rounded-xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/10 p-3 transition-colors dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="flex items-center gap-3">
                    {user.photoUrl ? (
                      <img
                        src={user.photoUrl}
                        alt={user.name}
                        className="w-11 h-11 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="w-11 h-11 rounded-lg flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br from-sky-500 to-indigo-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 truncate dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">
                        <span className="inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-sky-500" aria-hidden="true" />
                          Premium account · {user.email}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-zinc-700 rounded-lg hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer transition-colors dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                    >
                      <Camera className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
                      Upload your photo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setTab('settings');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-zinc-700 rounded-lg hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer transition-colors dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
                      Account & Analytics
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        logoutUser();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition-colors dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                      <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                      Sign out
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhoto}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              setTab(state.activeTab === 'dashboard' ? 'chat' : 'dashboard')
            }
            className={`relative group px-3.5 sm:px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 whitespace-nowrap cursor-pointer overflow-hidden border ${
              isLight
                ? 'bg-black text-white hover:bg-zinc-800 border-black shadow-md shadow-zinc-900/20'
                : 'border-white bg-white text-zinc-950 hover:bg-zinc-100 shadow-md shadow-zinc-950/40'
            }`}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <span>{state.activeTab === 'dashboard' ? 'AI Workspace' : 'Dashboard'}</span>
            </span>
          </button>

          {state.activeTab === 'chat' && (
            <button
              type="button"
              onClick={() => setMobileInspector(true)}
              aria-label="Open Context Inspector drawer"
              className={`xl:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isLight
                  ? 'bg-black text-white hover:bg-zinc-800 border-black shadow-xs'
                  : 'bg-white/5 hover:bg-white/15 border-white/10 hover:border-sky-400/40 text-zinc-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400 icon-premium" aria-hidden="true" />
              <span>Inspector</span>
            </button>
          )}
        </div>
      </header>

      {/* Sub-Header Bar ALWAYS visible in phone mode for Features, Engine, Versions, Ecosystem, Team, Pricing */}
      <div
        className={`md:hidden w-full px-3 py-1.5 border-b backdrop-blur-md flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth transition-colors duration-200 ${
          isLight
            ? 'border-zinc-200 bg-white/95 text-zinc-900 shadow-2xs'
            : 'border-zinc-800/90 bg-zinc-950/95 text-zinc-200'
        }`}
      >
        {navItems.map((item) => (
          <button
            key={`mobile-${item.id}`}
            type="button"
            onClick={() => navigateToHomeSection(item.id)}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer ${
              isLight
                ? 'bg-black text-white hover:bg-zinc-800 border border-black shadow-xs'
                : 'bg-white/10 text-zinc-200 hover:text-white hover:bg-white/20 border border-white/15'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <AuthModal open={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};