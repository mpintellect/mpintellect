"use client";

import { usePathname } from "next/navigation";
import MobileMenu from "@/components/MobileMenu";

export default function ConditionalNavigation() {
  const pathname = usePathname();

  // Check if the path starts with /client/dashboard
  if (pathname?.startsWith("/client/dashboard")) {
    return null;
  }

  // The logo is rendered once by ConditionalStickyLogo (see
  // ClientLayoutWrapper) - this used to also render StickyLogo here,
  // mounting a second identical fixed-position logo stacked exactly on
  // top of the first one.
  return <MobileMenu />;
}