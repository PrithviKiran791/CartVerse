import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { InteractiveGridPattern } from '../components/ui/interactive-grid-pattern';
import { HoverBorderGradient } from '../components/ui/hover-border-gradient';
import { NoiseBackground } from '../components/ui/noise-background';
import { Social } from '../components/common/SocialButtons';
import { cn } from '../lib/utils';
import webIcon from '../assets/icons/web_icon.png';

export interface LoginPageProps {
  onLogin?: (credentials: { email: string; password: string }) => Promise<void> | void;
  onSignup?: (data: { name: string; email: string; password: string }) => Promise<void> | void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSignup }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const queryMessage = searchParams.get('message');

  const {
    login: storeLogin,
    signup: storeSignup,
    isLoading: storeLoading,
    error: storeError,
    clearError,
    isAuthenticated,
  } = useAuthStore();

  // Mode: 'login' | 'signup'
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Local state for client validation error & loading
  const [clientError, setClientError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  // Clear errors when switching tabs
  const handleTabSwitch = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setClientError(null);
    clearError();
  };

  const validateEmail = (val: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);
    clearError();

    // 1. Validation for Email
    if (!email.trim()) {
      setClientError('Please enter your email / username.');
      return;
    }
    if (!validateEmail(email)) {
      setClientError('Please enter a valid email address.');
      return;
    }

    // 2. Validation for Password
    if (!password) {
      setClientError('Please enter your password.');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 8) {
        setClientError('Password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setClientError('Passwords do not match.');
        return;
      }
    }

    setLocalLoading(true);

    try {
      if (mode === 'login') {
        if (onLogin) {
          await onLogin({ email: email.trim(), password });
        } else {
          const success = await storeLogin({ email: email.trim(), password });
          if (success) {
            navigate(redirectUrl, { replace: true });
          }
        }
      } else {
        const signupPayload = {
          name: name.trim() || email.split('@')[0],
          email: email.trim(),
          password,
        };
        if (onSignup) {
          await onSignup(signupPayload);
        } else {
          const success = await storeSignup(signupPayload);
          if (success) {
            navigate(redirectUrl, { replace: true });
          }
        }
      }
    } catch (err: any) {
      setClientError(err?.message || 'Authentication failed.');
    } finally {
      setLocalLoading(false);
    }
  };

  const isLoading = storeLoading || localLoading;
  const displayError = clientError || storeError;

  return (
    <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center py-10 px-4 sm:px-6 relative overflow-hidden bg-[#000000]">
      {/* MagicUI Interactive Grid Pattern in Black & Red */}
      <InteractiveGridPattern
        className={cn(
          'opacity-60 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]'
        )}
        width={24}
        height={24}
        squares={[60, 45]}
        squaresClassName="hover:fill-red-600/50 hover:stroke-red-500 transition-all duration-150"
      />

      {/* Subtle Red Ambient Glow against deep black */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/[0.06] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-red-950/[0.12] rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[540px] flex flex-col items-center z-10">
        {/* Top Header with Logo and Brand */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 p-0.5 shadow-lg shadow-red-950/60 flex items-center justify-center">
            <img src={webIcon} alt="CartVerse Logo" className="w-7 h-7 object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans uppercase">
            Login
          </h1>
        </div>

        {/* Tab Buttons (LOGIN / SIGNUP) */}
        <div className="flex items-center justify-center gap-12 mb-8 font-mono text-xs font-bold tracking-widest uppercase">
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            className={`transition-all duration-300 relative py-1 cursor-pointer ${
              mode === 'login'
                ? 'text-white'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            LOGIN
            {mode === 'login' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-red-600 shadow-[0_0_8px_#E31B23]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('signup')}
            className={`transition-all duration-300 relative py-1 cursor-pointer ${
              mode === 'signup'
                ? 'text-white'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            SIGNUP
            {mode === 'signup' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-red-600 shadow-[0_0_8px_#E31B23]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        </div>

        {/* Layered Card Container */}
        <div className="relative w-full max-w-[340px] sm:max-w-[360px] min-h-[360px]">
          {/* Background Layer Card with Offset (Simulating Page 8 Depth in Dark Theme) */}
          <motion.div
            initial={false}
            animate={{
              x: mode === 'login' ? 36 : -36,
              y: 18,
              opacity: 0.45,
              scale: 0.96,
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="absolute inset-0 bg-[#1a1a22] border border-neutral-800/80 rounded-md shadow-xl pointer-events-none"
            style={{ backdropFilter: 'blur(10px)' }}
          />

          {/* Front Active Form Card in Sleek Black */}
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className="relative bg-[#121216] border border-neutral-800/90 rounded-md p-6 sm:p-7 shadow-2xl z-10 text-white"
          >
            {/* Inline Query Notification Message */}
            {queryMessage && !displayError && (
              <div className="mb-4 p-2.5 rounded bg-neutral-900 border border-neutral-800 flex items-start gap-2 text-[11px] text-neutral-300 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span>{queryMessage}</span>
              </div>
            )}

            {/* Inline Error Alert */}
            {displayError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-2.5 rounded bg-red-950/40 border border-red-800/80 flex items-start gap-2 text-[11px] text-red-300 font-mono"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span className="flex-1">{displayError}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  <motion.div
                    key="login-fields"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Username / Email Field */}
                    <div>
                      <label className="block text-xs text-neutral-400 font-sans mb-1.5 font-medium">
                        Username
                      </label>
                      <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Username"
                        disabled={isLoading}
                        className="w-full px-3.5 py-2.5 bg-[#0A0A0E] border border-neutral-800 rounded text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                      />
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-xs text-neutral-400 font-sans mb-1.5 font-medium">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        disabled={isLoading}
                        className="w-full px-3.5 py-2.5 bg-[#0A0A0E] border border-neutral-800 rounded text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup-fields"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3.5"
                  >
                    {/* Email Field */}
                    <div>
                      <label className="block text-xs text-neutral-400 font-sans mb-1.5 font-medium">
                        E-mail
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail"
                        disabled={isLoading}
                        className="w-full px-3.5 py-2.5 bg-[#0A0A0E] border border-neutral-800 rounded text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                      />
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-xs text-neutral-400 font-sans mb-1.5 font-medium">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        disabled={isLoading}
                        className="w-full px-3.5 py-2.5 bg-[#0A0A0E] border border-neutral-800 rounded text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                      />
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                      <label className="block text-xs text-neutral-400 font-sans mb-1.5 font-medium">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        disabled={isLoading}
                        className="w-full px-3.5 py-2.5 bg-[#0A0A0E] border border-neutral-800 rounded text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button in CartVerse NoiseBackground */}
              <NoiseBackground
                containerClassName="w-full p-0.5 rounded-xl mt-5 shadow-lg"
                gradientColors={[
                  "rgb(255, 100, 150)",
                  "rgb(100, 150, 255)",
                  "rgb(255, 200, 100)",
                ]}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-full w-full cursor-pointer rounded-xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-black py-2.5 px-4 text-base font-rajdhani font-bold uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)] transition-all duration-100 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : mode === 'login' ? (
                    <span>Log In &rarr;</span>
                  ) : (
                    <span>Sign Up &rarr;</span>
                  )}
                </button>
              </NoiseBackground>
            </form>

            {/* Social Sign-In Options */}
            <Social />
          </motion.div>
        </div>

        {/* Footer Back Link */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-red-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to CartVerse Hardware Store</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
