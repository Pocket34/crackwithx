'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Topbar } from '@/components/navigation/Topbar';
import { MobileNav } from '@/components/navigation/MobileNav';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { useStudent } from '@/context/StudentContext';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoadingAuth } = useStudent();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!isLoadingAuth) {
      if (!user) {
        router.replace('/');
      } else if (!user.email_confirmed_at) {
        const verifyUrl = `/verify?email=${encodeURIComponent(user.email || '')}`;
        router.replace(verifyUrl);
      }
    }
  }, [isLoadingAuth, user, router]);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#06080e] flex flex-col items-center justify-center text-slate-200">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-xl shadow-cyan-500/20">
            <div className="w-full h-full bg-[#080c16] rounded-[14px] flex items-center justify-center font-black tracking-wider text-xl text-white">
              <span className="text-white">C</span>
              <span className="text-cyan-400 font-extrabold ml-[1px]">X</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono text-slate-400 tracking-wider">
              AUTHENTICATING STUDENT SESSION...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !user.email_confirmed_at) {
    return null; // Will redirect to / or /verify
  }

  return (
    <div className="min-h-screen bg-[#06080e] flex text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        <Topbar onOpenSearch={() => setSearchOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-12">
          {children}
        </main>

        <MobileNav />
      </div>

      {/* Global Command Palette */}
      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
