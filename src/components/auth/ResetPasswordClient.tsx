'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  KeyRound,
  ShieldCheck,
  RotateCw,
  Mail,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export const ResetPasswordClient: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP Fallback mode states
  const [useOtpMode, setUseOtpMode] = useState(false);
  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');

  // Status states
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkRecoveryState() {
      try {
        if (typeof window === 'undefined') return;

        // Check for error parameters in URL or hash
        const queryError = searchParams?.get('error');
        const queryDesc = searchParams?.get('error_description');
        let hashError: string | null = null;
        let hashDesc: string | null = null;

        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          hashError = hashParams.get('error');
          hashDesc = hashParams.get('error_description');
        }

        if (queryError || queryDesc || hashError || hashDesc) {
          const rawErr = queryDesc || hashDesc || queryError || hashError || 'Recovery link is invalid or has expired.';
          const cleanErr = decodeURIComponent(rawErr.replace(/\+/g, ' '));
          if (isMounted) {
            setErrorMessage(cleanErr);
            setIsVerifyingSession(false);
          }
          return;
        }

        // Check for code in searchParams (?code=...)
        const code = searchParams?.get('code');
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.warn('Code exchange in reset-password:', error.message);
            // Don't immediately fail; check existing session below
          } else if (data.session) {
            if (isMounted) {
              setHasValidSession(true);
              setIsVerifyingSession(false);
            }
            return;
          }
        }

        // Check active Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (isMounted) {
            setHasValidSession(true);
            setIsVerifyingSession(false);
          }
          return;
        }

        // Listen for auth state change in case implicit hash parsing is in flight
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
          if (newSession && (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
            if (isMounted) {
              setHasValidSession(true);
              setIsVerifyingSession(false);
            }
          }
        });

        // If no session found after 2 seconds, allow fallback to OTP mode or show notice
        setTimeout(() => {
          if (isMounted && isVerifyingSession) {
            setIsVerifyingSession(false);
          }
        }, 2000);

        return () => {
          subscription.unsubscribe();
        };
      } catch (err: any) {
        if (isMounted) {
          setErrorMessage(err.message || 'Error verifying recovery session.');
          setIsVerifyingSession(false);
        }
      }
    }

    checkRecoveryState();

    return () => {
      isMounted = false;
    };
  }, [supabase, searchParams]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!password) {
      setErrorMessage('Please enter a new password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      // If user is in OTP fallback mode
      if (useOtpMode && !hasValidSession) {
        if (!email.trim() || !otpToken.trim()) {
          setErrorMessage('Please provide your registered email and the 6-digit recovery code.');
          setIsSubmitting(false);
          return;
        }

        const { error: verifyErr } = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: otpToken.trim(),
          type: 'recovery',
        });

        if (verifyErr) {
          setErrorMessage(verifyErr.message || 'Invalid or expired recovery code.');
          setIsSubmitting(false);
          return;
        }
      }

      // Update password via Supabase Auth
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setErrorMessage(error.message || 'Failed to update password. Please try again.');
        return;
      }

      setSuccessMessage('Password updated successfully! Redirecting to your student dashboard...');
      setTimeout(() => {
        window.location.href = '/app';
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while updating your password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06080e] flex flex-col justify-between text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      <div className="ambient-bg" />

      {/* Top Header */}
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
      </header>

      {/* Central Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 my-4">
        <div className="w-full max-w-md rounded-3xl bg-[#0a0e1c] border border-slate-800/90 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500" />

          {/* Heading */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-mono mb-1">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Password Recovery</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Set New Student Password
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter and confirm your new secure password below to regain full access to your CrackwithX account.
            </p>
          </div>

          {/* Loading verification state */}
          {isVerifyingSession && (
            <div className="py-8 text-center space-y-3">
              <div className="w-7 h-7 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Verifying secure recovery authorization...</p>
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

          {/* Main Password Reset Form */}
          {!isVerifyingSession && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {/* Optional OTP Mode if no session established directly */}
              {!hasValidSession && (
                <div className="space-y-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>Recovery Code Verification</span>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Registered Student Email"
                        className="w-full bg-[#0d1428] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={otpToken}
                        onChange={(e) => setOtpToken(e.target.value)}
                        placeholder="6-digit Recovery Code or Token"
                        className="w-full bg-[#0d1428] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
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

              {/* Confirm New Password */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-indigo-700 hover:from-cyan-400 hover:via-indigo-500 hover:to-indigo-600 disabled:opacity-50 text-white font-extrabold text-xs tracking-wider shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>UPDATING PASSWORD...</span>
                  </>
                ) : (
                  <>
                    <span>SAVE NEW PASSWORD & SIGN IN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Navigation Links */}
          <div className="pt-2 border-t border-slate-800/80 text-center space-y-2">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors inline-block"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-800/60 text-center text-xs text-slate-400 relative z-10">
        <p className="text-[11px] text-slate-400">© 2026 CrackwithX — Understand. Prepare. Prove. Crack It.</p>
      </footer>
    </div>
  );
};
