'use client';

import { useCallback, useEffect, useState } from 'react';

// ----------------------------------------------------------------------------
// Shared admin session key. One password, checked once at /admin/layout.tsx,
// reused by every /admin/* page for its own API calls (Authorization: Bearer
// or x-admin-key, whichever the endpoint already uses - see CLAUDE.md on the
// two header conventions). Validated server-side against ADMIN_PASSWORD /
// ADMIN_KEY in functions/api/admin/validate.ts.
//
// Also tracks a sessionToken (functions/api/admin/validate.ts mints one on
// every successful password+TOTP login, logged to admin_sessions) - used by
// AdminGateProvider's heartbeat to detect this device being "Disconnected"
// from app/admin/security/page.tsx's device list and log out automatically.
// ----------------------------------------------------------------------------
export const ADMIN_SESSION_KEY = 'mz_admin_key';
export const ADMIN_SESSION_TOKEN_KEY = 'mz_admin_session_token';

export function useAdminKey() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (stored) setAdminKey(stored);
    const storedToken = sessionStorage.getItem(ADMIN_SESSION_TOKEN_KEY);
    if (storedToken) setSessionToken(storedToken);
  }, []);

  const login = useCallback((key: string, token?: string) => {
    sessionStorage.setItem(ADMIN_SESSION_KEY, key);
    setAdminKey(key);
    if (token) {
      sessionStorage.setItem(ADMIN_SESSION_TOKEN_KEY, token);
      setSessionToken(token);
    }
  }, []);

  // Clears the session and reloads so the layout-level gate re-checks
  // storage and re-prompts immediately, instead of leaving a page half-authed.
  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
    window.location.reload();
  }, []);

  return { adminKey, sessionToken, login, logout };
}
