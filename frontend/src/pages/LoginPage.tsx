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
import { MacbookScroll, Badge } from '../components/ui/macbook-scroll';
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from '@tabler/icons-react';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { BottomGradient, LabelInputContainer } from '../components/ui/signup-form';

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
    <div className="min-h-screen w-full bg-[#070709] text-white flex flex-col items-center justify-start py-6 px-2 sm:px-4 relative overflow-x-hidden">
      <MacbookScroll
        title={
          <span className="font-rajdhani font-black tracking-tight uppercase text-2xl sm:text-4xl text-white">
            CartVerse Terminal Authentication. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-purple-400">
              Sign In to Access Cloud Rig Profiles.
            </span>
          </span>
        }
        badge={
          <a href="https://peerlist.io/manuarora" target="_blank" rel="noopener noreferrer">
            <Badge className="h-10 w-10 -rotate-12 transform hover:rotate-0 transition-transform duration-300" />
          </a>
        }
        url="cartverse.io/login"
        showGradient={false}
      >
        <div className="min-h-full w-full flex flex-col items-center justify-center py-8 px-4 sm:px-6 relative overflow-hidden bg-[#000000]">
          {/* MagicUI Interactive Grid Pattern in Black & Red */}
          <InteractiveGridPattern
            className={cn(
              'opacity-60 [mask-image:radial-gradient(400px_circle_at_center,white,transparent)]'
            )}
            width={24}
            height={24}
            squares={[40, 30]}
            squaresClassName="hover:fill-red-600/50 hover:stroke-red-500 transition-all duration-150"
          />

          {/* Subtle Red Ambient Glow against deep black */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-600/[0.08] rounded-full blur-[120px] pointer-events-none" />

          {/* Main Container */}
          <div className="w-full max-w-md flex flex-col items-center z-10">
            {/* Top Header with Logo and Brand */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 p-0.5 shadow-lg shadow-red-950/60 flex items-center justify-center">
                <img src={webIcon} alt="CartVerse Logo" className="w-6 h-6 object-contain" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans uppercase">
                {mode === 'login' ? 'Login' : 'Sign Up'}
              </h1>
            </div>

            {/* Tab Buttons (LOGIN / SIGNUP) */}
            <div className="flex items-center justify-center gap-10 mb-6 font-mono text-xs font-bold tracking-widest uppercase">
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

            {/* Form Card */}
            {mode === 'signup' ? (
              <div className="shadow-input mx-auto w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 dark:bg-black border border-neutral-200 dark:border-neutral-800/90 shadow-2xl">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                  Welcome to Aceternity
                </h2>
                <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                  Login to aceternity if you can because we don&apos;t have a login flow yet
                </p>

                {/* Inline Error Alert */}
                {displayError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-2.5 rounded-lg bg-red-950/40 border border-red-800/80 flex items-start gap-2 text-xs text-red-300 font-mono"
                  >
                    <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span className="flex-1">{displayError}</span>
                  </motion.div>
                )}

                <form className="my-6 space-y-4" onSubmit={handleSubmit}>
                  <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                    <LabelInputContainer>
                      <Label htmlFor="firstname">First name</Label>
                      <Input
                        id="firstname"
                        placeholder="Tyler"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </LabelInputContainer>
                    <LabelInputContainer>
                      <Label htmlFor="lastname">Last name</Label>
                      <Input
                        id="lastname"
                        placeholder="Durden"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </LabelInputContainer>
                  </div>

                  <LabelInputContainer>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      placeholder="projectmayhem@fc.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </LabelInputContainer>

                  <LabelInputContainer>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </LabelInputContainer>

                  <LabelInputContainer className="mb-2">
                    <Label htmlFor="twitterpassword">Your twitter password</Label>
                    <Input
                      id="twitterpassword"
                      placeholder="••••••••"
                      type="password"
                      value={twitterPassword}
                      onChange={(e) => setTwitterPassword(e.target.value)}
                    />
                  </LabelInputContainer>

                  <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] cursor-pointer mt-4"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing up...' : 'Sign up →'}
                    <BottomGradient />
                  </button>

                  <div className="my-6 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

                  <div className="flex flex-col space-y-3">
                    <button
                      className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] cursor-pointer hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
                      type="button"
                      onClick={() => handleSocialClick('github')}
                    >
                      <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        GitHub
                      </span>
                      <BottomGradient />
                    </button>
                    <button
                      className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] cursor-pointer hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
                      type="button"
                      onClick={() => handleSocialClick('google')}
                    >
                      <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        Google
                      </span>
                      <BottomGradient />
                    </button>
                    <button
                      className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] cursor-pointer hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
                      type="button"
                      onClick={() => handleSocialClick('onlyfans')}
                    >
                      <IconBrandOnlyfans className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        OnlyFans
                      </span>
                      <BottomGradient />
                    </button>
                  </div>

                  <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 pt-2">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => handleTabSwitch('login')}
                      className="text-red-500 hover:text-red-400 font-semibold cursor-pointer underline underline-offset-2"
                    >
                      Log in
                    </button>
                  </p>
                </form>
              </div>
            ) : (
              <div className="shadow-input mx-auto w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 dark:bg-black border border-neutral-200 dark:border-neutral-800/90 shadow-2xl">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                  Welcome to CartVerse
                </h2>
                <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                  Sign in to access your saved PC builds, custom rigs, and cart orders
                </p>

                {/* Inline Query Notification Message */}
                {queryMessage && !displayError && (
                  <div className="mt-4 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-start gap-2 text-xs text-neutral-300 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{queryMessage}</span>
                  </div>
                )}

                {/* Inline Error Alert */}
                {displayError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-2.5 rounded-lg bg-red-950/40 border border-red-800/80 flex items-start gap-2 text-xs text-red-300 font-mono"
                  >
                    <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span className="flex-1">{displayError}</span>
                  </motion.div>
                )}

                <form className="my-6 space-y-4" onSubmit={handleSubmit}>
                  <LabelInputContainer>
                    <Label htmlFor="login-email">Email Address / Username</Label>
                    <Input
                      id="login-email"
                      placeholder="projectmayhem@fc.com"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </LabelInputContainer>

                  <LabelInputContainer>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </LabelInputContainer>

                  <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] cursor-pointer mt-4"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Log in →'}
                    <BottomGradient />
                  </button>

                  <div className="my-6 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

                  <div className="flex flex-col space-y-3">
                    <button
                      className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] cursor-pointer hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
                      type="button"
                      onClick={() => handleSocialClick('github')}
                    >
                      <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        Continue with GitHub (Demo)
                      </span>
                      <BottomGradient />
                    </button>
                    <button
                      className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] cursor-pointer hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
                      type="button"
                      onClick={() => handleSocialClick('google')}
                    >
                      <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        Continue with Google (Demo)
                      </span>
                      <BottomGradient />
                    </button>
                  </div>

                  <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 pt-2">
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => handleTabSwitch('signup')}
                      className="text-red-500 hover:text-red-400 font-semibold cursor-pointer underline underline-offset-2"
                    >
                      Sign up
                    </button>
                  </p>
                </form>
              </div>
            )}

            {/* Footer Back Link */}
            <div className="mt-8 text-center pb-4">
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
      </MacbookScroll>
    </div>
  );
};


export default LoginPage;
