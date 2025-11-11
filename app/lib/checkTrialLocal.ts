// app/lib/checkTrialLocal.ts
// ✅ Temporary trial tracking using localStorage (no Firebase)

export const MAX_TRIALS = 2;

export function getTrialCount(): number {
  if (typeof window === "undefined") return 0;
  const count = localStorage.getItem("MZP_TRIAL_COUNT");
  return count ? parseInt(count, 10) : 0;
}

export function incrementTrialCount(): number {
  if (typeof window === "undefined") return 0;
  const current = getTrialCount();
  const next = Math.min(MAX_TRIALS, current + 1);
  localStorage.setItem("MZP_TRIAL_COUNT", next.toString());
  return next;
}

export function hasTrialRemaining(): boolean {
  return getTrialCount() < MAX_TRIALS;
}

export function resetTrial(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("MZP_TRIAL_COUNT");
}