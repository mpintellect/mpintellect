// functions/config/telegram-config.ts

export const TELEGRAM_CONFIG = {
  // Timezone
  timezone: "Africa/Casablanca",
  
  // Active hours (Morocco time - UTC+1)
  activeHours: {
    start: 9,      // 09:00
    end: 17,       // 17:00
  },
  
  // Active days (0 = Monday, 6 = Sunday)
  activeDays: [0, 1, 2, 3, 4], // Monday to Friday
  
  // Fixed schedule times (Morocco time)
  scheduledTimes: [
    "09:00",
    "09:15",
    "11:00",
    "11:15",
    "13:00",
    "13:15",
    "14:00",
    "15:30",
    "17:00",
  ],
  
  // Smart rotation weights
  smartWeights: {
    confidence: 0.4,      // 40%
    volatility: 0.3,      // 30%
    timeSinceLast: 0.2,   // 20%
    trendStrength: 0.1,   // 10%
  },
  
  // Max posts per day per symbol
  maxPostsPerSymbol: {
    XAUUSD: 4,
    BTCUSD: 2,
    EURUSD: 1,
    GBPUSD: 1,
    US500: 1,
  },
  
  // Symbols to track
  symbols: ["XAUUSD", "BTCUSD", "EURUSD", "GBPUSD", "US500"],
  
  // Default fallback symbol
  defaultSymbol: "XAUUSD",
  
  // Channel ID (from environment variable)
  channelId: "", // Set in wrangler.toml
};