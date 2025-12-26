'use client';
import usePresence from "@/app/hooks/usePresence";

export default function PresenceTracker() {
  usePresence();
  return null; // Invisible component
}