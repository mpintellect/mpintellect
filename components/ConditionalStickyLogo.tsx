// components/ConditionalStickyLogo.tsx
"use client";

import { usePathname } from "next/navigation";
import StickyLogo from "@/components/StickyLogo";

export default function ConditionalStickyLogo() {
  const pathname = usePathname();

  // Hide StickyLogo if the path starts with /client/dashboard
  if (pathname?.startsWith("/client/dashboard")) {
    return <StickyLogo />;
  }

  return <StickyLogo />;
}