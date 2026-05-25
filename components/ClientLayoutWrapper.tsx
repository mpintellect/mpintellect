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
}

export default function ClientLayoutWrapper({ children, isIntelOnlyBuild = false }: ClientLayoutWrapperProps) {
  const pathname = usePathname();
  
  // For intel-only build (mzprimer.com), NEVER show header/footer
  if (isIntelOnlyBuild) {
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