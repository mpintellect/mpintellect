// functions/utils/telegram-scheduler.ts

import { TELEGRAM_CONFIG } from '../config/telegram-config';

export function shouldPostNow(currentTime: Date): boolean {
  // Get Morocco time
  const moroccoTime = new Date(currentTime.toLocaleString('en-US', { timeZone: TELEGRAM_CONFIG.timezone }));
  
  const hour = moroccoTime.getHours();
  const minute = moroccoTime.getMinutes();
  const dayOfWeek = moroccoTime.getDay(); // 0 = Monday, 6 = Sunday (in this config)
  
  // Convert to Monday-based index (0 = Monday)
  const mondayBasedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  // Check if day is active
  if (!TELEGRAM_CONFIG.activeDays.includes(mondayBasedDay)) {
    return false;
  }
  
  // Check if within active hours
  if (hour < TELEGRAM_CONFIG.activeHours.start || hour >= TELEGRAM_CONFIG.activeHours.end) {
    return false;
  }
  
  // Check if current time matches any scheduled time
  const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  
  return TELEGRAM_CONFIG.scheduledTimes.includes(timeStr);
}

export function getCurrentScheduleTime(currentTime: Date): string | null {
  const moroccoTime = new Date(currentTime.toLocaleString('en-US', { timeZone: TELEGRAM_CONFIG.timezone }));
  const hour = moroccoTime.getHours();
  const minute = moroccoTime.getMinutes();
  const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  
  if (TELEGRAM_CONFIG.scheduledTimes.includes(timeStr)) {
    return timeStr;
  }
  
  return null;
}

export function isFirstPostOfDay(currentTime: Date): boolean {
  const moroccoTime = new Date(currentTime.toLocaleString('en-US', { timeZone: TELEGRAM_CONFIG.timezone }));
  const timeStr = `${moroccoTime.getHours().toString().padStart(2, '0')}:${moroccoTime.getMinutes().toString().padStart(2, '0')}`;
  
  // First scheduled time of the day
  const firstTime = TELEGRAM_CONFIG.scheduledTimes[0];
  return timeStr === firstTime;
}