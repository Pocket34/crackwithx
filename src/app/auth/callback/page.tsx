import React from 'react';
import { AuthCallbackClient } from '@/components/auth/AuthCallbackClient';

export const metadata = {
  title: 'Authenticating... | CrackwithX',
  description: 'Completing student authentication session.',
};

export default function AuthCallbackPage() {
  return <AuthCallbackClient />;
}
