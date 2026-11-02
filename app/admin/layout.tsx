import type { ReactNode } from 'react';
import { AdminGateProvider } from './AdminGateProvider';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminGateProvider>{children}</AdminGateProvider>;
}
