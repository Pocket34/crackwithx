import React, { Suspense } from 'react';
import { AuthScreen } from '@/components/auth/AuthScreen';

export const metadata = {
  title: 'Sign In | CrackwithX — Student Intelligence System',
  description: 'Sign in to CrackwithX, the AI-powered student intelligence and academic survival operating system.',
};

export default function RootPage() {
  return (
    <Suspense fallback={null}>
      <AuthScreen />
    </Suspense>
  );
}
