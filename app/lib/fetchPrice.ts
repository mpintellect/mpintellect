// lib/fetchPrice.ts
export async function fetchCurrentPrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`/api/twelve/price?symbol=${symbol}`);
    const data = await res.json();
    return typeof data.price === 'number' ? data.price : null;
  } catch (error) {
    console.error("Error fetching current price:", error);
    return null;
  }
}