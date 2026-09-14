import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Boxes } from '../components/ui/background-boxes';
import { HoverBorderGradient } from '../components/ui/hover-border-gradient';
import { NoiseBackground } from '../components/ui/noise-background';
import { Social } from '../components/common/SocialButtons';
import { cn } from '../lib/utils';
import webIcon from '../assets/icons/web_icon.png';
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from '@tabler/icons-react';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { BottomGradient, LabelInputContainer } from '../components/ui/signup-form';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twitterPassword, setTwitterPassword] = useState('');
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

  const handleSocialClick = (provider: string) => {
    setClientError(null);
    if (provider === 'github') {
      setEmail('developer@github.com');
      setPassword('demoGithubPass123');
      setFirstName('Linus');
      setLastName('Torvalds');
    } else if (provider === 'google') {
      setEmail('user@gmail.com');
      setPassword('demoGooglePass123');
      setFirstName('Ada');
      setLastName('Lovelace');
    } else if (provider === 'onlyfans') {
      setEmail('creator@onlyfans.com');
      setPassword('demoOfPass123');
      setFirstName('Tyler');
      setLastName('Durden');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);
    clearError();

    // 1. Validation for Email
    if (!email.trim()) {
      setClientError('Please enter your email address.');
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
      if (password.length < 6) {
        setClientError('Password must be at least 6 characters long.');
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
        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || email.split('@')[0];
        const signupPayload = {
          name: fullName,
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
    <div className="min-h-[calc(100vh-100px)] w-full bg-[#070709] text-white flex flex-col items-center justify-center py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Aceternity Background Boxes Animation with Radial Mask */}
      <div className="absolute inset-0 w-full h-full bg-[#070709]/80 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes className="opacity-45" />

      {/* Subtle Red Ambient Glow against deep black */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#FF1E2D]/[0.08] rounded-full blur-[130px] pointer-events-none z-10" />

      {/* Main Container */}
      <div className="w-full max-w-md flex flex-col items-center relative z-20">
        {/* Top Header with Logo and Brand */}
        <div className="flex flex-col items-center text-center mb-6">
          <Link to="/" className="flex items-center gap-3 mb-2 group">
            <div className="w-12 h-12 rounded-none border-2 border-[#FF1E2D] bg-neutral-950 p-1.5 shadow-[3px_3px_0px_0px_#FF1E2D] flex items-center justify-center group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-[4px_4px_0px_0px_#FF1E2D] transition-all">
              <img src={webIcon} alt="CartVerse Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white font-sans uppercase">
              Cart<span className="text-[#FF1E2D]">Verse</span>
            </span>
          </Link>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-none bg-[#FF1E2D]/15 border border-[#FF1E2D]/40 text-[#FF1E2D] text-[10px] font-mono font-bold uppercase tracking-widest mt-1">
            // {mode === 'login' ? 'ACCOUNT_SIGN_IN' : 'REGISTRATION_PORTAL'}
          </div>
        </div>

        {/* Tab Buttons (LOGIN / SIGNUP) */}
        <div className="grid grid-cols-2 gap-2 mb-6 w-full p-1 bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FF1E2D]">
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            className={`py-2 px-3 text-xs font-mono font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer ${
              mode === 'login'
                ? 'bg-[#FF1E2D] text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff]'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white border-2 border-transparent'
            }`}
          >
            [01] LOGIN
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('signup')}
            className={`py-2 px-3 text-xs font-mono font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#FF1E2D] text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#ffffff]'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white border-2 border-transparent'
            }`}
          >
            [02] SIGNUP
          </button>
        </div>

        {/* Form Card */}
        {mode === 'signup' ? (
          <div className="w-full max-w-md rounded-none border-2 sm:border-[3px] border-neutral-900 dark:border-neutral-700 bg-white dark:bg-[#120F17] p-6 sm:p-8 shadow-[8px_8px_0px_0px_#000000] dark:shadow-[8px_8px_0px_0px_#FF1E2D] relative z-20">
            {/* Top Telemetry Header */}
            <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-neutral-200 dark:border-neutral-800">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF1E2D] bg-[#FF1E2D]/10 px-2 py-0.5 border border-[#FF1E2D]/30">
                // SYS.REGISTRATION
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                [SECURE_CHANNEL]
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white uppercase font-sans tracking-tight">
              CREATE ACCOUNT
            </h2>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 font-sans">
              Save custom rig builds, track hardware dispatches, and sync your cart orders.
            </p>

            {/* Inline Error Alert */}
            {displayError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <Alert variant="destructive">
                  <ShieldAlert className="w-4 h-4" />
                  <AlertTitle>Authentication Error</AlertTitle>
                  <AlertDescription>{displayError}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form className="my-6 space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <LabelInputContainer>
                  <Label htmlFor="firstname" className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    First Name
                  </Label>
                  <Input
                    id="firstname"
                    placeholder="Tyler"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="rounded-none border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/90 text-neutral-900 dark:text-white focus:border-[#FF1E2D] dark:focus:border-[#FF1E2D] focus:ring-0 shadow-none font-sans"
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="lastname" className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Last Name
                  </Label>
                  <Input
                    id="lastname"
                    placeholder="Durden"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="rounded-none border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/90 text-neutral-900 dark:text-white focus:border-[#FF1E2D] dark:focus:border-[#FF1E2D] focus:ring-0 shadow-none font-sans"
                  />
                </LabelInputContainer>
              </div>

              <LabelInputContainer>
                <Label htmlFor="email" className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  placeholder="projectmayhem@fc.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-none border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/90 text-neutral-900 dark:text-white focus:border-[#FF1E2D] dark:focus:border-[#FF1E2D] focus:ring-0 shadow-none font-sans"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="password" className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Password
                </Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-none border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/90 text-neutral-900 dark:text-white focus:border-[#FF1E2D] dark:focus:border-[#FF1E2D] focus:ring-0 shadow-none font-sans"
                />
              </LabelInputContainer>

              <LabelInputContainer className="mb-2">
                <Label htmlFor="twitterpassword" className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Backup Passkey / Token
                </Label>
                <Input
                  id="twitterpassword"
                  placeholder="••••••••"
                  type="password"
                  value={twitterPassword}
                  onChange={(e) => setTwitterPassword(e.target.value)}
                  className="rounded-none border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/90 text-neutral-900 dark:text-white focus:border-[#FF1E2D] dark:focus:border-[#FF1E2D] focus:ring-0 shadow-none font-sans"
                />
              </LabelInputContainer>

              <button
                className="relative block h-11 w-full rounded-none bg-[#FF1E2D] hover:bg-[#FF3B48] font-mono font-bold text-xs uppercase tracking-widest text-white border-2 border-neutral-900 dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000000] dark:hover:shadow-[5px_5px_0px_0px_#ffffff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer transition-all mt-5"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? '// INITIALIZING...' : 'INITIALIZE ACCOUNT →'}
              </button>

              <div className="my-6 border-t-2 border-neutral-200 dark:border-neutral-800" />

              <div className="flex flex-col space-y-2.5">
                <button
                  className="relative flex h-10 w-full items-center justify-start space-x-2.5 rounded-none border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/80 px-4 font-mono text-xs text-neutral-800 dark:text-neutral-200 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#333333] hover:border-[#FF1E2D] dark:hover:border-[#FF1E2D] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#FF1E2D] cursor-pointer transition-all"
                  type="button"
                  onClick={() => handleSocialClick('github')}
                >
                  <IconBrandGithub className="h-4 w-4 text-neutral-900 dark:text-neutral-100" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    GITHUB DEMO ACCESS
                  </span>
                </button>
                <button
                  className="relative flex h-10 w-full items-center justify-start space-x-2.5 rounded-none border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/80 px-4 font-mono text-xs text-neutral-800 dark:text-neutral-200 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#333333] hover:border-[#FF1E2D] dark:hover:border-[#FF1E2D] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#FF1E2D] cursor-pointer transition-all"
                  type="button"
                  onClick={() => handleSocialClick('google')}
                >
                  <IconBrandGoogle className="h-4 w-4 text-neutral-900 dark:text-neutral-100" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    GOOGLE DEMO ACCESS
                  </span>
                </button>
                <button
                  className="relative flex h-10 w-full items-center justify-start space-x-2.5 rounded-none border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/80 px-4 font-mono text-xs text-neutral-800 dark:text-neutral-200 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#333333] hover:border-[#FF1E2D] dark:hover:border-[#FF1E2D] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#FF1E2D] cursor-pointer transition-all"
                  type="button"
                  onClick={() => handleSocialClick('onlyfans')}
                >
                  <IconBrandOnlyfans className="h-4 w-4 text-neutral-900 dark:text-neutral-100" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    ONLYFANS CREATOR DEMO
                  </span>
                </button>
              </div>

              <p className="text-center text-xs font-mono text-neutral-500 dark:text-neutral-400 pt-2">
                ALREADY REGISTERED?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('login')}
                  className="text-[#FF1E2D] hover:text-[#FF3B48] font-bold cursor-pointer underline underline-offset-2"
                >
                  LOG IN →
                </button>
              </p>
            </form>
          </div>
        ) : (
          <div className="w-full max-w-md rounded-none border-2 sm:border-[3px] border-neutral-900 dark:border-neutral-700 bg-white dark:bg-[#120F17] p-6 sm:p-8 shadow-[8px_8px_0px_0px_#000000] dark:shadow-[8px_8px_0px_0px_#FF1E2D] relative z-20">
            {/* Top Telemetry Header */}
            <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-neutral-200 dark:border-neutral-800">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF1E2D] bg-[#FF1E2D]/10 px-2 py-0.5 border border-[#FF1E2D]/30">
                // SYS.AUTHENTICATION
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                [GATEWAY_ACTIVE]
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white uppercase font-sans tracking-tight">
              WELCOME TO CARTVERSE
            </h2>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 font-sans">
              Sign in to access your saved PC builds, custom rigs, and cart orders.
            </p>

            {/* Inline Query Notification Message */}
            {queryMessage && !displayError && (
              <Alert variant="default" className="mt-4">
                <CheckCircle2 className="w-4 h-4 text-[#FF1E2D]" />
                <AlertTitle>Notice</AlertTitle>
                <AlertDescription>{queryMessage}</AlertDescription>
              </Alert>
            )}

            {/* Inline Error Alert */}
            {displayError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <Alert variant="destructive">
                  <ShieldAlert className="w-4 h-4" />
                  <AlertTitle>Authentication Error</AlertTitle>
                  <AlertDescription>{displayError}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form className="my-6 space-y-4" onSubmit={handleSubmit}>
              <LabelInputContainer>
                <Label htmlFor="login-email" className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Email Address / Username
                </Label>
                <Input
                  id="login-email"
                  placeholder="projectmayhem@fc.com"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-none border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/90 text-neutral-900 dark:text-white focus:border-[#FF1E2D] dark:focus:border-[#FF1E2D] focus:ring-0 shadow-none font-sans"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="login-password" className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Password
                </Label>
                <Input
                  id="login-password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-none border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/90 text-neutral-900 dark:text-white focus:border-[#FF1E2D] dark:focus:border-[#FF1E2D] focus:ring-0 shadow-none font-sans"
                />
              </LabelInputContainer>

              <button
                className="relative block h-11 w-full rounded-none bg-[#FF1E2D] hover:bg-[#FF3B48] font-mono font-bold text-xs uppercase tracking-widest text-white border-2 border-neutral-900 dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#ffffff] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000000] dark:hover:shadow-[5px_5px_0px_0px_#ffffff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer transition-all mt-5"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? '// AUTHENTICATING...' : 'ACCESS ACCOUNT →'}
              </button>

              <div className="my-6 border-t-2 border-neutral-200 dark:border-neutral-800" />

              <div className="flex flex-col space-y-2.5">
                <button
                  className="relative flex h-10 w-full items-center justify-start space-x-2.5 rounded-none border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/80 px-4 font-mono text-xs text-neutral-800 dark:text-neutral-200 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#333333] hover:border-[#FF1E2D] dark:hover:border-[#FF1E2D] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#FF1E2D] cursor-pointer transition-all"
                  type="button"
                  onClick={() => handleSocialClick('github')}
                >
                  <IconBrandGithub className="h-4 w-4 text-neutral-900 dark:text-neutral-100" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    CONTINUE WITH GITHUB (DEMO)
                  </span>
                </button>
                <button
                  className="relative flex h-10 w-full items-center justify-start space-x-2.5 rounded-none border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/80 px-4 font-mono text-xs text-neutral-800 dark:text-neutral-200 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#333333] hover:border-[#FF1E2D] dark:hover:border-[#FF1E2D] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#FF1E2D] cursor-pointer transition-all"
                  type="button"
                  onClick={() => handleSocialClick('google')}
                >
                  <IconBrandGoogle className="h-4 w-4 text-neutral-900 dark:text-neutral-100" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    CONTINUE WITH GOOGLE (DEMO)
                  </span>
                </button>
              </div>

              <p className="text-center text-xs font-mono text-neutral-500 dark:text-neutral-400 pt-2">
                DON&apos;T HAVE AN ACCOUNT?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('signup')}
                  className="text-[#FF1E2D] hover:text-[#FF3B48] font-bold cursor-pointer underline underline-offset-2"
                >
                  SIGN UP →
                </button>
              </p>
            </form>
          </div>
        )}

        {/* Footer Back Link */}
        <div className="mt-8 text-center pb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 hover:text-[#FF1E2D] transition-colors py-1.5 px-3 border border-transparent hover:border-neutral-700 bg-neutral-900/50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[RETURN TO HARDWARE STORE]</span>
          </Link>
        </div>
          </div>
    </div>
  );
};


export default LoginPage;
