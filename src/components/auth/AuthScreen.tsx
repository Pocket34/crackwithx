'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Lock,
  Mail,
  User,
  GraduationCap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Flame,
  ShieldCheck,
  ChevronRight,
  Send,
  KeyRound,
  RotateCw
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useStudent } from '@/context/StudentContext';

interface AuthScreenProps {
  initialMode?: 'SIGN_IN' | 'SIGN_UP' | 'FORGOT_PASSWORD' | 'VERIFY_OTP';
  initialEmail?: string;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'SIGN_IN',
  initialEmail = '',
}) => {
  const router = useRouter();
  const supabase = createClient();
  const { user, isLoadingAuth } = useStudent();

  // Mode: 'SIGN_IN' | 'SIGN_UP' | 'FORGOT_PASSWORD' | 'VERIFY_OTP'
  const [mode, setMode] = useState<'SIGN_IN' | 'SIGN_UP' | 'FORGOT_PASSWORD' | 'VERIFY_OTP'>(initialMode);

  // Form Fields
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [collegeDegree, setCollegeDegree] = useState('B.E. Computer Science');

  // Password Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Verification Screen States
  const [verificationEmail, setVerificationEmail] = useState(initialEmail);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle URL query parameters (e.g. from /auth/callback redirects, email confirmations, or code exchange)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const urlError = searchParams.get('error') || searchParams.get('error_description');
      const urlVerified = searchParams.get('verified');
      const urlVerify = searchParams.get('verify');
      const urlEmail = searchParams.get('email');
      const code = searchParams.get('code');
      const tokenHash = searchParams.get('token_hash') || searchParams.get('token');

      if (urlEmail) {
        setEmail(urlEmail);
        setVerificationEmail(urlEmail);
      }

      if (urlVerify === 'true') {
        setMode('VERIFY_OTP');
      }

      // Check hash fragment for errors
      let hashError: string | null = null;
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        hashError = hashParams.get('error_description') || hashParams.get('error');
      }

      if (urlError || hashError) {
        const rawErr = urlError || hashError || '';
        setErrorMessage(decodeURIComponent(rawErr.replace(/\+/g, ' ')));
      } else if (urlVerified === 'true') {
        setSuccessMessage('Email verified successfully! You can now sign in to your CrackwithX account.');
        setMode('SIGN_IN');
      }

      // If code query param is present on /
      if (code) {
        setIsSubmitting(true);
        supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
          setIsSubmitting(false);
          if (!error && data.session && data.user?.email_confirmed_at) {
            window.location.href = '/app';
          } else {
            setSuccessMessage('Email confirmation verified! Please sign in with your email and password.');
            setMode('SIGN_IN');
          }
        });
      }

      // If token_hash is present on /
      if (tokenHash) {
        setIsSubmitting(true);
        const type = (searchParams.get('type') as any) || 'signup';
        supabase.auth.verifyOtp({ token_hash: tokenHash, type }).then(({ data, error }) => {
          setIsSubmitting(false);
          if (!error && data.session && data.user?.email_confirmed_at) {
            window.location.href = '/app';
          } else {
            setSuccessMessage('Email confirmation verified! Please sign in with your email and password.');
            setMode('SIGN_IN');
          }
        });
      }

      // If user opened with hash containing access_token from Supabase implicit flow
      if (window.location.hash && window.location.hash.includes('access_token')) {
        setSuccessMessage('Session confirmed! Redirecting to CrackwithX...');
      }
    }
  }, [supabase]);

  // If already logged in, check verification status before allowing entry to /app
  useEffect(() => {
    if (!isLoadingAuth && user) {
      if (user.email_confirmed_at) {
        window.location.href = '/app';
      } else {
        // User is logged in but email is unverified
        setVerificationEmail(user.email || '');
        setMode('VERIFY_OTP');
      }
    }
  }, [user, isLoadingAuth]);

  // Auto-focus first OTP digit when entering VERIFY_OTP mode
  useEffect(() => {
    if (mode === 'VERIFY_OTP') {
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 150);
    }
  }, [mode]);

  const handleOtpChange = (index: number, value: string) => {
    // If user pasted multiple characters
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((char, i) => {
        newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pasted.length, 5);
      otpRefs.current[nextIndex]?.focus();
      return;
    }

    const cleanVal = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    if (cleanVal && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < pastedData.length; i++) {
        newDigits[i] = pastedData[i];
      }
      setOtpDigits(newDigits);
      const focusIndex = Math.min(pastedData.length, 5);
      otpRefs.current[focusIndex]?.focus();
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both your student email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        const msg = error.message.toLowerCase();
        // Check if error is unconfirmed email
        if (msg.includes('email not confirmed') || (error.status === 400 && msg.includes('not confirmed'))) {
          setVerificationEmail(email.trim());
          setOtpDigits(['', '', '', '', '', '']);
          setMode('VERIFY_OTP');
          setErrorMessage('Your email address has not been verified yet. Enter the 6-digit code sent to your email.');
          return;
        } else if (msg.includes('invalid login credentials')) {
          setErrorMessage('Invalid student email or password. If you do not have an account yet, click "Sign Up" above to register.');
        } else {
          setErrorMessage(error.message || 'Invalid email or password. Please verify your credentials.');
        }
        return;
      }

      // Check if user is authenticated but email is not confirmed
      if (data.user && !data.user.email_confirmed_at) {
        setVerificationEmail(email.trim());
        setOtpDigits(['', '', '', '', '', '']);
        setMode('VERIFY_OTP');
        setErrorMessage('Your email address has not been verified yet. Enter the 6-digit verification code.');
        return;
      }

      if (data.session) {
        window.location.href = '/app';
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected connection error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('Please provide an email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      const origin = typeof window !== 'undefined' && window.location.origin 
        ? window.location.origin 
        : 'http://localhost:3000';
      const emailRedirectTo = `${origin}/auth/callback`;

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo,
          data: {
            full_name: fullName.trim() || email.split('@')[0],
            name: fullName.trim() || email.split('@')[0],
            degree: collegeDegree.trim(),
            college: 'State Technical University',
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('rate limit')) {
          setErrorMessage(
            'Supabase confirmation email rate limit reached (free tier allows limited confirmation emails per hour). Please wait a few minutes before trying again, or sign in if already registered.'
          );
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      // Supabase returns an empty identities array if the email already exists
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setErrorMessage('An account with this student email already exists. Please sign in with your password or reset it.');
        setMode('SIGN_IN');
        return;
      }

      // DO NOT redirect unverified user to /app!
      // Navigate to dedicated email verification OTP screen:
      const targetEmail = email.trim();
      setVerificationEmail(targetEmail);
      setOtpDigits(['', '', '', '', '', '']);
      setMode('VERIFY_OTP');
      setSuccessMessage(`We've sent a 6-digit verification code to your email address.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Signup failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanOtp = otpDigits.join('').trim();
    if (cleanOtp.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    const targetEmail = verificationEmail.trim() || email.trim();
    if (!targetEmail) {
      setErrorMessage('No email address provided to verify. Please enter your email.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Attempt verifyOtp with type 'signup'
      let verifyRes = await supabase.auth.verifyOtp({
        email: targetEmail,
        token: cleanOtp,
        type: 'signup',
      });

      // 2. Fallback to 'email' if 'signup' failed
      if (verifyRes.error) {
        verifyRes = await supabase.auth.verifyOtp({
          email: targetEmail,
          token: cleanOtp,
          type: 'email',
        });
      }

      if (verifyRes.error) {
        setErrorMessage('Invalid or expired verification code.');
        return;
      }

      // 3. Verification successful! Refresh/get the current Supabase session
      const { data: sessionData } = await supabase.auth.getSession();

      // Only after successful verification redirect to /app
      if (sessionData.session && sessionData.session.user) {
        setSuccessMessage('Email verified successfully! Opening your student dashboard...');
        setTimeout(() => {
          window.location.href = '/app';
        }, 500);
      } else if (password) {
        // If password was entered during signup/signin, sign in to establish session
        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
          email: targetEmail,
          password: password,
        });
        if (!signInErr && signInData.session) {
          window.location.href = '/app';
        } else {
          setSuccessMessage('Email verified successfully! Please sign in with your password.');
          setMode('SIGN_IN');
        }
      } else {
        setSuccessMessage('Email verified successfully! Please sign in with your password.');
        setMode('SIGN_IN');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid or expired verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const targetEmail = verificationEmail.trim() || email.trim();
    if (!targetEmail) {
      setErrorMessage('No email address provided. Please return to sign in.');
      return;
    }

    setIsSubmitting(true);
    try {
      const origin = typeof window !== 'undefined' && window.location.origin 
        ? window.location.origin 
        : 'http://localhost:3000';
      const emailRedirectTo = `${origin}/auth/callback`;

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: targetEmail,
        options: {
          emailRedirectTo,
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('rate limit')) {
          setErrorMessage('Rate limit reached. Please wait a few minutes before requesting another code.');
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setSuccessMessage('A new verification code has been sent.');
        setOtpDigits(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const origin = typeof window !== 'undefined' && window.location.origin 
        ? window.location.origin 
        : 'http://localhost:3000';

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/auth/callback?next=/app/profile`,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage('Password reset instructions have been sent to your email.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Password reset request failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const redirectTo =
        typeof window !== 'undefined' && window.location.origin
          ? `${window.location.origin}/auth/callback`
          : 'http://localhost:3000/auth/callback';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      if (error) {
        setErrorMessage(error.message || 'Google sign-in could not be completed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickDemoCredentials = () => {
    setEmail('pushkar.student@engineering.edu');
    setPassword('Student@2026');
    setConfirmPassword('Student@2026');
    setFullName('Pushkar Sharma');
    setCollegeDegree('B.E. Computer Science & Engineering');
  };

  return (
    <div className="min-h-screen bg-[#06080e] flex flex-col justify-between text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="ambient-bg" />

      {/* Top Header Navigation */}
      <header className="h-16 border-b border-slate-800/60 bg-[#080c16]/80 backdrop-blur-xl sticky top-0 z-30 px-6 lg:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
            <div className="w-full h-full bg-[#080c16] rounded-[11px] flex items-center justify-center font-black tracking-wider text-base text-white">
              <span className="text-white">C</span>
              <span className="text-cyan-400 font-extrabold ml-[1px]">X</span>
            </div>
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-white text-base">Crackwith</span>
            <span className="font-black text-cyan-400 text-base">X</span>
            <span className="hidden sm:inline-block ml-2 text-[9px] uppercase tracking-widest text-slate-400 font-mono">
              STUDENT OS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/landing"
            className="text-xs font-semibold text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
          >
            <span>Product Overview</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Central Auth Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 my-4">
        <div className="w-full max-w-md rounded-3xl bg-[#0a0e1c] border border-slate-800/90 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          {/* Subtle top glow bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500" />

          {/* Title and Subtitle */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-mono mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {mode === 'VERIFY_OTP' ? 'Email Verification Required' : 'Student Intelligence Portal'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {mode === 'SIGN_IN' && 'Sign in to CrackwithX'}
              {mode === 'SIGN_UP' && 'Create Student Account'}
              {mode === 'FORGOT_PASSWORD' && 'Reset Student Password'}
              {mode === 'VERIFY_OTP' && 'Verify your email'}
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              {mode === 'SIGN_IN' && 'Access your academic risk radar, AI examiner, and task workflows.'}
              {mode === 'SIGN_UP' && 'Your AI-powered student survival & growth operating system.'}
              {mode === 'FORGOT_PASSWORD' && 'Enter your student email to receive recovery instructions.'}
              {mode === 'VERIFY_OTP' && "We've sent a 6-digit verification code to your email address."}
            </p>
          </div>

          {/* Mode Switcher Tabs (Only for SIGN_IN / SIGN_UP) */}
          {mode !== 'FORGOT_PASSWORD' && mode !== 'VERIFY_OTP' && (
            <div className="flex rounded-2xl bg-slate-900/90 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMode('SIGN_IN');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === 'SIGN_IN'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('SIGN_UP');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === 'SIGN_UP'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2 animate-in fade-in duration-150">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 leading-snug">{errorMessage}</div>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{successMessage}</div>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {mode === 'SIGN_IN' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Student Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu or email@domain.com"
                    className="w-full bg-[#0d1428] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('FORGOT_PASSWORD');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[#0d1428] border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-200"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-indigo-700 hover:from-cyan-400 hover:via-indigo-500 hover:to-indigo-600 disabled:opacity-50 text-white font-extrabold text-xs tracking-wider shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span>SIGN IN TO CRACKWITHX</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. SIGN UP FORM */}
          {mode === 'SIGN_UP' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Pushkar Sharma"
                    className="w-full bg-[#0d1428] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Degree / Specialization
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={collegeDegree}
                    onChange={(e) => setCollegeDegree(e.target.value)}
                    placeholder="e.g. B.E. Computer Science"
                    className="w-full bg-[#0d1428] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Student Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu or name@gmail.com"
                    className="w-full bg-[#0d1428] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              {/* Password Fields with Working Hide/Show Eye Toggles on Both */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full bg-[#0d1428] border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-200"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full bg-[#0d1428] border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-200"
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-indigo-700 hover:from-cyan-400 hover:via-indigo-500 hover:to-indigo-600 disabled:opacity-50 text-white font-extrabold text-xs tracking-wider shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>CREATING ACCOUNT...</span>
                  </>
                ) : (
                  <>
                    <span>REGISTER STUDENT ACCOUNT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. EMAIL OTP VERIFICATION SCREEN */}
          {mode === 'VERIFY_OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* Target Email Banner */}
              <div className="p-3.5 rounded-2xl bg-[#0d1428] border border-cyan-500/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                      Target Email
                    </span>
                    <span className="text-xs font-mono font-bold text-white truncate block">
                      {verificationEmail || email || 'student@college.edu'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMode('SIGN_UP');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold transition-colors flex-shrink-0"
                >
                  Change
                </button>
              </div>

              {/* 6-Digit OTP Input Grid */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block text-center">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="w-11 h-13 sm:w-12 sm:h-14 bg-[#0d1428] border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl text-center text-xl font-mono font-black text-cyan-400 placeholder:text-slate-600 focus:outline-none transition-all shadow-inner"
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons: VERIFY EMAIL & RESEND CODE */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting || otpDigits.join('').trim().length !== 6}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-indigo-700 hover:from-cyan-400 hover:via-indigo-500 hover:to-indigo-600 disabled:opacity-50 text-white font-extrabold text-xs tracking-wider shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>VERIFYING CODE...</span>
                    </>
                  ) : (
                    <>
                      <span>VERIFY EMAIL</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCw className={`w-3.5 h-3.5 text-cyan-400 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>RESEND CODE</span>
                </button>
              </div>

              {/* Back to Sign In Link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('SIGN_IN');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* 4. FORGOT PASSWORD FORM */}
          {mode === 'FORGOT_PASSWORD' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full bg-[#0d1428] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'SENDING RESET LINK...' : 'SEND RECOVERY EMAIL'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('SIGN_IN');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Social Auth & Google Option (Only for SIGN_IN / SIGN_UP) */}
          {mode !== 'FORGOT_PASSWORD' && mode !== 'VERIFY_OTP' && (
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div className="relative text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <span className="relative bg-[#0a0e1c] px-3 text-[10px] uppercase font-mono text-slate-400 tracking-wider">
                  OR CONTINUE WITH
                </span>
              </div>

              {/* Google Campus Account OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google Campus Account</span>
              </button>

              {/* Quick Demo Helper */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={fillQuickDemoCredentials}
                  className="text-[11px] text-indigo-400 hover:text-cyan-300 font-mono transition-colors"
                >
                  ⚡ Quick-Fill Demo Student Credentials
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-800/60 text-center text-xs text-slate-400 relative z-10">
        <div className="flex items-center justify-center gap-4 text-xs">
          <Link href="/landing" className="hover:text-cyan-400 transition-colors">
            Product Overview
          </Link>
          <span>•</span>
          <span className="text-slate-400">Supabase Auth Verified</span>
          <span>•</span>
          <span className="text-slate-400">256-bit Encrypted Session</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">© 2026 CrackwithX — Understand. Prepare. Prove. Crack It.</p>
      </footer>
    </div>
  );
};
