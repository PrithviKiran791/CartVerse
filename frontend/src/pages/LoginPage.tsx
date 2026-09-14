import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Boxes } from '../components/ui/background-boxes';
import webIcon from '../assets/icons/web_icon.png';
import {
  IconBrandGithub,
  IconBrandGoogle,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
      if (confirmPassword && password !== confirmPassword) {
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
    <div className="min-h-[calc(100vh-100px)] w-full bg-[#070709] text-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Background Boxes Animation with Radial Mask */}
      <div className="absolute inset-0 w-full h-full bg-[#070709]/80 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes className="opacity-40" />

      {/* Subtle Red Ambient Glow against deep black */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF1E2D]/[0.08] rounded-full blur-[140px] pointer-events-none z-10" />

      {/* Main Container */}
      <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center relative z-20">
        {/* Top Brand Link */}
        <div className="flex flex-col items-center text-center mb-6">
          <Link to="/" className="flex items-center gap-3 mb-2 group">
            <div className="w-11 h-11 rounded-none border-2 border-[#FF1E2D] bg-neutral-950 p-1.5 shadow-[3px_3px_0px_0px_#FF1E2D] flex items-center justify-center group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] transition-all">
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

        {/* Neobrutalism Card Component */}
        <Card className="w-full max-w-sm sm:max-w-md shadow-[8px_8px_0px_0px_#000000] dark:shadow-[8px_8px_0px_0px_#FF1E2D]">
          <CardHeader>
            <CardTitle>
              {mode === 'login' ? 'Login to your account' : 'Create your account'}
            </CardTitle>
            <CardDescription>
              {mode === 'login'
                ? 'Enter your email below to login to your account'
                : 'Enter your details below to create your account'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Inline Query Notification Message */}
            {queryMessage && !displayError && (
              <Alert variant="default" className="mb-4">
                <CheckCircle2 className="w-4 h-4 text-[#FF1E2D]" />
                <AlertTitle>Notice</AlertTitle>
                <AlertDescription>{queryMessage}</AlertDescription>
              </Alert>
            )}

            {/* Inline Error Alert */}
            {displayError && (
              <Alert variant="destructive" className="mb-4">
                <ShieldAlert className="w-4 h-4" />
                <AlertTitle>Authentication Error</AlertTitle>
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} id="auth-form">
              <div className="flex flex-col gap-5">
                {mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="firstname">First Name</Label>
                      <Input
                        id="firstname"
                        placeholder="Tyler"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastname">Last Name</Label>
                      <Input
                        id="lastname"
                        placeholder="Durden"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === 'login' && (
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setClientError('Password reset is currently in maintenance. Please use demo access.');
                        }}
                        className="ml-auto inline-block text-xs text-neutral-500 dark:text-neutral-400 underline-offset-4 hover:underline hover:text-[#FF1E2D]"
                      >
                        Forgot your password?
                      </a>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {mode === 'signup' && (
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-2.5">
            <Button
              type="submit"
              form="auth-form"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Processing...' : mode === 'login' ? 'Login' : 'Create Account'}
            </Button>

            <Button
              type="button"
              variant="neutral"
              onClick={() => handleSocialClick('google')}
              className="w-full flex items-center justify-center gap-2"
            >
              <IconBrandGoogle className="h-4 w-4" />
              <span>Login with Google</span>
            </Button>

            <Button
              type="button"
              variant="neutral"
              onClick={() => handleSocialClick('github')}
              className="w-full flex items-center justify-center gap-2"
            >
              <IconBrandGithub className="h-4 w-4" />
              <span>Login with GitHub</span>
            </Button>

            <div className="mt-4 text-center text-sm font-sans text-neutral-600 dark:text-neutral-400">
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('signup')}
                    className="underline underline-offset-4 text-neutral-950 dark:text-white font-bold hover:text-[#FF1E2D] dark:hover:text-[#FF1E2D] cursor-pointer"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('login')}
                    className="underline underline-offset-4 text-neutral-950 dark:text-white font-bold hover:text-[#FF1E2D] dark:hover:text-[#FF1E2D] cursor-pointer"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>

        {/* Footer Back Link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 hover:text-[#FF1E2D] transition-colors py-1.5 px-3 border border-transparent hover:border-neutral-800 bg-neutral-900/50"
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
