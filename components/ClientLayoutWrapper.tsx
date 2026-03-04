'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import ConditionalStickyLogo from '@/components/ConditionalStickyLogo';
import ConditionalMobileMenu from '@/components/ConditionalMobileMenu'; 
import ConditionalNavbar from '@/components/ConditionalNavbar'; 
import Footer from '@/components/Footer';

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // ✅ THE LOGIC: Hide trading UI if we are on the /intel page
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