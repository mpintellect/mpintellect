// lib/product-prices.ts - CORRECT VERSION
export const PRODUCT_PRICES = {
  "price_1SFbpBDoB4i1qeaLaPQQ0eW5": {  // 24H
    name: "AI Assistant - 24 Hours",
    duration: "24h",
    type: "ai_assistant"
  },
  "price_1SFXpFDoB4i1qeaLJVQY6Cdb": {  // 5D
    name: "AI Assistant - 5 Days",
    duration: "5d", 
    type: "ai_assistant"
  }
} as const;

export type PriceId = keyof typeof PRODUCT_PRICES;
export type ProductConfig = typeof PRODUCT_PRICES[PriceId];