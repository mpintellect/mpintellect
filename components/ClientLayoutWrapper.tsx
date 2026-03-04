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
      {!isIntelPage && (
        <>
          <ConditionalStickyLogo />
          <ConditionalNavbar />
          <ConditionalMobileMenu />
        </>
      )}

      <main className="flex-grow">
        {children}
      </main>

      {!isIntelPage && <Footer />}
    </>
  );
}