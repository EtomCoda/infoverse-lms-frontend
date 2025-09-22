'use client';

import { useCallback, useMemo, useState } from 'react';
import { AuthenticationWrapper } from '@/components/auth/AuthenticationWrapper';
import { ChangePasswordLayout } from '@/components/auth/ChangePasswordLayout';
import { PasswordForm } from '@/components/auth/PasswordForm';
import type { AuthenticationState, SecuritySettings } from '@/types/security';

const defaultSecuritySettings: SecuritySettings = {
  requireCurrentPassword: true,
  enableTwoFactor: true,
  passwordHistoryLimit: 5,
  sessionTimeoutMinutes: 15,
  allowPasswordReset: true,
  minimumLength: 12,
  requireSymbol: true,
  requireNumber: true,
  requireMixedCase: true,
};

const defaultRecentPasswordHashes = [
  '4D9F40FC9424E95A61AD77DA1215E894F2F7D3B52D6B7E1DCF5F2A9C897A5F0C',
  '7A047F6D20513D3E5E713A9B2C73BF1C4D25265BA0F8EA7342C6A8E715731C4F',
];

const initialAuthentication: AuthenticationState = {
  isAuthenticated: true,
  sessionValid: true,
  userId: 'user-1024',
  lastPasswordChange: new Date('2024-01-10T10:00:00Z'),
  requiresPasswordChange: false,
};

const validateSessionRemotely = async () => {
  try {
    const response = await fetch('/api/security/validate-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) {
      return false;
    }
    const data = (await response.json()) as { sessionValid?: boolean };
    return Boolean(data.sessionValid);
  } catch (error) {
    console.warn('Unable to validate session', error);
    return false;
  }
};

const ChangePasswordPage = () => {
  const [authenticationState, setAuthenticationState] = useState<AuthenticationState>(initialAuthentication);
  const recentPasswordHashes = useMemo(() => defaultRecentPasswordHashes, []);

  const handleLogout = useCallback(() => {
    setAuthenticationState((prev) => ({ ...prev, isAuthenticated: false, sessionValid: false }));
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  const handlePasswordChanged = useCallback(() => {
    setAuthenticationState((prev) => ({
      ...prev,
      lastPasswordChange: new Date(),
      requiresPasswordChange: false,
      sessionValid: true,
    }));
    setTimeout(() => {
      setAuthenticationState((prev) => ({ ...prev, isAuthenticated: false, sessionValid: false }));
    }, 2500);
  }, []);

  const handleSessionInvalid = useCallback(() => {
    setAuthenticationState((prev) => ({ ...prev, sessionValid: false }));
  }, []);

  const refreshSession = useCallback(async () => {
    const sessionValid = await validateSessionRemotely();
    setAuthenticationState((prev) => ({ ...prev, sessionValid }));
    return sessionValid;
  }, []);

  const securitySettings = useMemo(() => defaultSecuritySettings, []);

  return (
    <AuthenticationWrapper
      authenticationState={authenticationState}
      securitySettings={securitySettings}
      onLogout={handleLogout}
      onRefreshSession={refreshSession}
    >
      <ChangePasswordLayout>
        <PasswordForm
          securitySettings={securitySettings}
          authenticationState={authenticationState}
          recentPasswordHashes={recentPasswordHashes}
          onPasswordChanged={handlePasswordChanged}
          onSessionInvalid={handleSessionInvalid}
          onLogout={handleLogout}
        />
      </ChangePasswordLayout>
    </AuthenticationWrapper>
  );
};

export default ChangePasswordPage;
