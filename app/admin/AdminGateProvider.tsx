'use client';

import { useEffect } from 'react';
import { useAdminKey } from './useAdminKey';
import { AdminGate } from './AdminGate';

const HEARTBEAT_MS = 30_000;

// Single gate for the whole /admin section - wraps app/admin/layout.tsx.
// Every /admin/* page renders behind this; individual pages no longer
// prompt for or validate the password themselves.
//
// Also polls functions/api/admin/sessions/check.ts every 30s so a session
// "Disconnected" from the device list (app/admin/security/page.tsx) gets
// logged out of this tab automatically, instead of staying in until the
// next manual reload.
export function AdminGateProvider({ children }: { children: React.ReactNode }) {
  const { adminKey, sessionToken, login, logout } = useAdminKey();

  useEffect(() => {
    if (!adminKey || !sessionToken) return;

    let cancelled = false;
    const check = async () => {
      try {
        const res = await fetch('/api/admin/sessions/check', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken }),
        });
        const data = await res.json();
        if (!cancelled && !data.valid) logout();
      } catch {
        // Network hiccup - don't log the admin out over a transient failure.
      }
    };

    const interval = setInterval(check, HEARTBEAT_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [adminKey, sessionToken, logout]);

  if (!adminKey) {
    return <AdminGate onUnlock={login} />;
  }

  return <>{children}</>;
}
