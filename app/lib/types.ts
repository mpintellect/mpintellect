export type TrendDirection = 'up' | 'down' | 'sideways';

export interface TrendResult {
  symbol: string;
  direction: TrendDirection;
  changePercent: number;
  latestPrice: number;
}