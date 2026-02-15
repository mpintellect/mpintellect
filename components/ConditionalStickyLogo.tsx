// components/ConditionalStickyLogo.tsx
"use client";

import { usePathname } from "next/navigation";
import StickyLogo from "@/components/StickyLogo";

export default function ConditionalStickyLogo() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/client/dashboard");

  // Pass dashboard status as a prop to StickyLogo
  return <StickyLogo isDashboard={isDashboard} />;
}