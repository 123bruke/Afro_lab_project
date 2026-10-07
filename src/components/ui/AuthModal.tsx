import React, { useState } from 'react';
import { Github, X } from 'lucide-react';
import { useContextFlow } from '../../context/ContextFlowContext';

type AuthMode = 'signin' | 'create';

const GoogleMark: React.FC = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4">
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
    />
  </svg>
);

export const AuthModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { loginUser, notify } = useContextFlow();

  const [mode, setMode] = useState<AuthMode>('create');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!open) return null;

  const providerLogin = (provider: 'google' | 'github') => {
    loginUser({
      name: provider === 'google' ? 'Google User' : 'GitHub User',
      email:
        provider === 'google'
          ? 'google.user@gmail.com'
          : 'github.user@users.noreply.github.com',
      provider,
    });
    notify(`Signed in with ${provider === 'google' ? 'Google' : 'GitHub'}`);
    onClose();
  };

  const submitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    loginUser({
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      provider: 'email',
    });
    notify(
      `Welcome${name ? `, ${name.trim()}` : ''} · account ready (${mode === 'create' ? 'created' : 'signed in'})`
    );
    onClose();
  };

  const inputCls =
    'w-full px-3 py-2 text-sm bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-sky-500';

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Accounts · sign in or create account"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
              {mode === 'create' ? 'Create account' : 'Welcome back'}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Smart SDK System · secure workspace access
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl border border-zinc-200 mb-5 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setMode('create')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'create'
                ? 'bg-black text-white dark:bg-white dark:text-zinc-950'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Create account
          </button>
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-black text-white dark:bg-white dark:text-zinc-950'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Sign in
          </button>
        </div>

        <form onSubmit={submitEmail} className="space-y-3">
          {mode === 'create' && (
            <div>
              <label className="block text-xs font-medium text-zinc-600 mb-1 dark:text-zinc-400">
                Display name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={inputCls}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1 dark:text-zinc-400">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1 dark:text-zinc-400">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer text-white ${
              mode === 'create' ? 'bg-sky-600 hover:bg-sky-500' : 'bg-black hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200'
            }`}
          >
            {mode === 'create' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4 text-[11px] text-zinc-400">
          <span className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          <span className="font-mono uppercase">or</span>
          <span className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => providerLogin('google')}
            className="inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors cursor-pointer bg-white dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-800"
          >
            <GoogleMark />
            Google
          </button>
          <button
            type="button"
            onClick={() => providerLogin('github')}
            className="inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors cursor-pointer bg-white dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-800"
          >
            <Github className="w-4 h-4" />
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
};