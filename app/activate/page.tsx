// app/activate/page.tsx
'use client';

import { Suspense } from 'react';
import ActivateContent from './ActivateContent';

export default function ActivatePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <p>🔄 Verifying your license key...</p>
      </div>
    }>
      <ActivateContent />
    </Suspense>
  );
}