'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export const AuthCallbackClient: React.FC = () => {
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    async function processAuth() {
      if (typeof window === 'undefined') return;

      const fullUrl = window.location.href;
      const urlObj = new URL(fullUrl);
      const searchParams = urlObj.searchParams;

      // 1. Check for errors in search parameters or hash
      const queryError = searchParams.get('error');
      const queryDesc = searchParams.get('error_description');

      // Check hash fragment (Supabase email verify returns #error=...&error_description=...)
      let hashError: string | null = null;
      let hashDesc: string | null = null;
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        hashError = hashParams.get('error');
        hashDesc = hashParams.get('error_description');
      }

      if (queryError || queryDesc || hashError || hashDesc) {
        const rawMsg = queryDesc || hashDesc || queryError || hashError || 'Authentication failed.';
        const cleanMsg = decodeURIComponent(rawMsg.replace(/\+/g, ' '));
        if (isMounted) {
          setErrorStatus(cleanMsg);
        }
        setTimeout(() => {
          window.location.href = `/?error=${encodeURIComponent(cleanMsg)}`;
        }, 1500);
        return;
      }

      // 2. Check for PKCE Authorization Code (?code=...)
      const code = searchParams.get('code');
      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error && data.session) {
            window.location.href = '/app';
            return;
          }

          if (error) {
            console.warn('PKCE exchange note:', error.message);
            // If code was already exchanged or opened from a secondary browser,
            // Supabase cloud has already marked the user verified.
            window.location.href = '/?verified=true';
            return;
          }
        } catch (err: any) {
          console.warn('Code exchange caught:', err);
          window.location.href = '/?verified=true';
          return;
        }
      }

      // 3. Check for Token Hash (?token_hash=... or ?token=...)
      const tokenHash = searchParams.get('token_hash') || searchParams.get('token');
      const type = searchParams.get('type') || 'signup';
      if (tokenHash) {
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as any,
          });

          if (!error && data.session) {
            window.location.href = '/app';
            return;
          }

          if (!error) {
            window.location.href = '/?verified=true';
            return;
          }

          if (error) {
            console.error('Verify OTP error:', error.message);
            window.location.href = `/?error=${encodeURIComponent(error.message)}`;
            return;
          }
        } catch (err: any) {
          console.error('Verify OTP caught:', err);
          window.location.href = '/?verified=true';
          return;
        }
      }

      // 4. Check for active session or implicit grant (#access_token=...)
      // The Supabase browser client automatically parses access_token from the hash
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          window.location.href = '/app';
          return;
        }
      } catch (err) {
        console.error('Get session error:', err);
      }

      // 5. Listen for onAuthStateChange in case hash parsing finishes asynchronously
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          window.location.href = '/app';
        }
      });

      // 6. Fallback timeout: If no session found after 3 seconds, redirect to sign in
      const timeoutId = setTimeout(() => {
        if (isMounted) {
          window.location.href = '/?verified=true';
        }
      }, 3000);

      return () => {
        subscription.unsubscribe();
        clearTimeout(timeoutId);
      };
    }

    processAuth();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  return (
    <div className="min-h-screen bg-[#06080e] flex flex-col items-center justify-center text-slate-100 p-6 selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="ambient-bg" />

      <div className="w-full max-w-sm rounded-3xl bg-[#0a0e1c] border border-slate-800 p-8 text-center space-y-6 shadow-2xl relative z-10">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-xl shadow-cyan-500/20">
          <div className="w-full h-full bg-[#080c16] rounded-[14px] flex items-center justify-center font-black tracking-wider text-2xl text-white">
            <span className="text-white">C</span>
            <span className="text-cyan-400 font-extrabold ml-[1px]">X</span>
          </div>
        </div>

        {errorStatus ? (
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 text-left">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span className="leading-snug">{errorStatus}</span>
            </div>
            <p className="text-xs text-slate-400">Redirecting to sign in...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authenticating Session</span>
            </div>
            <h2 className="text-lg font-black text-white tracking-tight">
              Verifying Student Dossier
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Completing authentication handoff and syncing verified credentials...
            </p>
            <div className="pt-2 flex justify-center">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
