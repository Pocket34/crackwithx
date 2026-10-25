import React from 'react';
import { AuthCallbackClient } from '@/components/auth/AuthCallbackClient';

export const metadata = {
  title: 'Confirming Email... | CrackwithX',
  description: 'Validating student registration and confirmation link.',
};

export default function AuthConfirmPage() {
  return <AuthCallbackClient />;
}
