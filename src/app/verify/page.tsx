import React, { Suspense } from 'react';
import { AuthScreen } from '@/components/auth/AuthScreen';

export const metadata = {
  title: 'Verify Your Email | CrackwithX',
  description: 'Enter your 6-digit verification code to activate your CrackwithX account.',
};

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <AuthScreen initialMode="VERIFY_OTP" />
    </Suspense>
  );
}
