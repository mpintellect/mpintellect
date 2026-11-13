import type { ReactNode } from 'react';
import { AdminGateProvider } from '../admin/AdminGateProvider';

// Reuses the exact same password + TOTP gate as /admin (same person logs
// into both, just a separate domain/session) - see AdminGateProvider's own
// comment for what it does (heartbeat-polled session check, auto-logout).
export default function AccountantLayout({ children }: { children: ReactNode }) {
  return <AdminGateProvider>{children}</AdminGateProvider>;
}
