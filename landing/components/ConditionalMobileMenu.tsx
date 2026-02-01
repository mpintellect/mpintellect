"use client";

import { usePathname } from "next/navigation";
import MobileMenu from "@/components/MobileMenu";
import StickyLogo from "@/components/StickyLogo";

export default function ConditionalNavigation() {
  const pathname = usePathname();

  // Check if the path starts with /client/dashboard
  if (pathname?.startsWith("/client/dashboard")) {
    return null;
  }

  return (
    <>
      <StickyLogo />
      <MobileMenu />
    </>
  );
}