// Trial management utilities for Cloudflare D1

import { getDB, queryOne } from '../../../backend-lib/db-simple';

export async function checkTrialStatus(userId: string): Promise<{
  available: boolean;
  remaining: number;
  used: number;
  maxTrials: number;
  licenseType: string;
}> {
  const user = await queryOne(
    "SELECT trial_count, license_type FROM users WHERE id = ?",
    [userId]
  );

  if (!user) {
    throw new Error("User not found");
  }

  const trialCount = user.trial_count || 0;
  const maxTrials = 2;
  const remaining = Math.max(0, maxTrials - trialCount);
  const available = remaining > 0;

  return {
    available,
    remaining,
    used: trialCount,
    maxTrials,
    licenseType: user.license_type
  };
}

export async function incrementTrialCount(userId: string): Promise<number> {
  const db = getDB();
  if (!db) {
    throw new Error("Database not available");
  }

  // Get current trial count
  const userQuery = await db.prepare(
    "SELECT trial_count FROM users WHERE id = ?"
  ).bind(userId).first();

  const currentCount = userQuery?.trial_count || 0;
  
  // Increment trial count
  await db.prepare(
    "UPDATE users SET trial_count = ?, updated_at = ? WHERE id = ?"
  ).bind(currentCount + 1, new Date().toISOString(), userId).run();

  return currentCount + 1;
}

export async function resetTrialCount(userId: string, newCount: number = 0): Promise<void> {
  const db = getDB();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.prepare(
    "UPDATE users SET trial_count = ?, updated_at = ? WHERE id = ?"
  ).bind(newCount, new Date().toISOString(), userId).run();
}

export async function canUseTrial(userId: string): Promise<boolean> {
  const status = await checkTrialStatus(userId);
  return status.available;
}