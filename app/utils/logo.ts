// utils/logo.ts - Simplified version
export const LOGO_URLS = {
  // Main logo
  MAIN: '/logos/mzlogo.webp',
  MAIN_PNG: '/logos/icon-512.png',
  
  // PWA icons
  PWA_192: '/logos/icon-192.png',
  PWA_512: '/logos/icon-512.png',
  PWA_180: '/logos/icon-180.png',
  
  // Payment badges
  STRIPE: '/logos/stripe.svg',
  VISA: '/logos/visa.svg',
  MASTERCARD: '/logos/mastercard.svg',
  APPLE_PAY: '/logos/Applepay.svg',
  GOOGLE_PAY: '/logos/google.svg',
  PCI: '/logos/pci.svg'
} as const;

export const LOGO_DIMENSIONS = {
  HERO: { mobile: [140, 140], desktop: [224, 224] },
  FOOTER: [120, 120],
  STICKY: [60, 60],
  PAYMENT: [40, 25]
} as const;

// Simple getter function
export function getLogo(type: keyof typeof LOGO_URLS = 'MAIN'): string {
  return LOGO_URLS[type];
}