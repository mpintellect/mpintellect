"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Hide Navbar if the path starts with /client/dashboard
  if (pathname?.startsWith("/client/dashboard")) {
    return null;
  }

  return <Navbar />;
}