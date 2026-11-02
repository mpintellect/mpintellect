'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import ConditionalStickyLogo from '@/components/ConditionalStickyLogo';
import ConditionalMobileMenu from '@/components/ConditionalMobileMenu'; 
import ConditionalNavbar from '@/components/ConditionalNavbar'; 
import Footer from '@/components/Footer';

interface ClientLayoutWrapperProps {
  children: ReactNode;
  isIntelOnlyBuild?: boolean; // 🔥 NEW: Passed from layout.tsx
  isAdminOnlyBuild?: boolean;
}

export default function ClientLayoutWrapper({
  children,
  isIntelOnlyBuild = false,
  isAdminOnlyBuild = false,
}: ClientLayoutWrapperProps) {
  const pathname = usePathname();

  // For intel-only build (mzprimer.com) and admin-only build
  // (admin.mpintellect.com), NEVER show header/footer - admin.mpintellect.com
  // is internal tooling, not a page a client is meant to see.
  if (isIntelOnlyBuild || isAdminOnlyBuild) {
    return (
      <>
        <main className="flex-grow">
          {children}
        </main>
      </>
    );
  }

  // For main build (mpintellect.com), use existing logic
  const isIntelPage = pathname === '/intel' || pathname?.startsWith('/intel');

  return (
    <>
      {/* Conditional components based on page type */}
      {!isIntelPage && (
        <>
          <ConditionalStickyLogo />
          <ConditionalNavbar />
          <ConditionalMobileMenu />
        </>
      )}

      {/* Main content - always rendered */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Conditional footer */}
      {!isIntelPage && <Footer />}
    </>
  );
}