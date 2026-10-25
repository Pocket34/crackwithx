import React, { Suspense } from 'react';
import { AuthScreen } from '@/components/auth/AuthScreen';

export const metadata = {
  title: 'Sign In | CrackwithX',
  description: 'Sign in to CrackwithX.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthScreen />
    </Suspense>
  );
}
