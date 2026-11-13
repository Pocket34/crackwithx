import React, { Suspense } from 'react';
import { ResetPasswordClient } from '@/components/auth/ResetPasswordClient';

export const metadata = {
  title: 'Set New Password | CrackwithX',
  description: 'Update and securely reset your student password.',
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#06080e] flex items-center justify-center text-slate-100">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
