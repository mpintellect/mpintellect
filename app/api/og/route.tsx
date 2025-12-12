import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Symbol specifications for proper decimal formatting
const SYMBOL_SPECS: Record<string, { pip: number; contract: number; decimals: number; fullName: string }> = {
  // Forex
  "EURUSD": { pip: 0.0001, contract: 100000, decimals: 5, fullName: "EUR/USD" },
  "GBPUSD": { pip: 0.0001, contract: 100000, decimals: 5, fullName: "GBP/USD" },
  "USDJPY": { pip: 0.01, contract: 100000, decimals: 3, fullName: "USD/JPY" },
  "USDCAD": { pip: 0.0001, contract: 100000, decimals: 5, fullName: "USD/CAD" },
  "AUDUSD": { pip: 0.0001, contract: 100000, decimals: 5, fullName: "AUD/USD" },
  "NZDUSD": { pip: 0.0001, contract: 100000, decimals: 5, fullName: "NZD/USD" },
  "USDCHF": { pip: 0.0001, contract: 100000, decimals: 5, fullName: "USD/CHF" },
  "EURJPY": { pip: 0.01, contract: 100000, decimals: 3, fullName: "EUR/JPY" },
  "EURGBP": { pip: 0.0001, contract: 100000, decimals: 5, fullName: "EUR/GBP" },
  "GBPJPY": { pip: 0.01, contract: 100000, decimals: 3, fullName: "GBP/JPY" },
  "GBPCHF": { pip: 0.0001, contract: 100000, decimals: 5, fullName: "GBP/CHF" },

  // Metals
  "XAUUSD": { pip: 0.01, contract: 100, decimals: 2, fullName: "Gold (XAU/USD)" },
  "XAUEUR": { pip: 0.01, contract: 100, decimals: 2, fullName: "Gold/EUR" },
  "XAGUSD": { pip: 0.001, contract: 5000, decimals: 3, fullName: "Silver (XAG/USD)" },
  "PLATINUM": { pip: 0.01, contract: 100, decimals: 2, fullName: "Platinum" },

  // Energy
  "BRENT": { pip: 0.01, contract: 1000, decimals: 2, fullName: "Crude Oil (Brent)" },

  // Crypto
  "BTCUSD": { pip: 1.0, contract: 1, decimals: 1, fullName: "Bitcoin (BTC)" },
  "ETHUSD": { pip: 0.1, contract: 1, decimals: 2, fullName: "Ethereum (ETH)" },
  "XRPUSD": { pip: 0.0001, contract: 1000, decimals: 4, fullName: "Ripple (XRP)" },
  "LTCUSD": { pip: 0.01, contract: 10, decimals: 2, fullName: "Litecoin (LTC)" },
  "DOGEUSD": { pip: 0.0001, contract: 1000, decimals: 4, fullName: "Dogecoin" },

  // Indices
  "US500": { pip: 0.1, contract: 1, decimals: 2, fullName: "S&P 500" },
  "USTEC": { pip: 0.1, contract: 1, decimals: 2, fullName: "NASDAQ 100" },
  "US30": { pip: 1.0, contract: 1, decimals: 1, fullName: "Dow Jones 30" },
  "HK50": { pip: 0.1, contract: 1, decimals: 2, fullName: "Hong Kong 50" },
  "FRANCE40": { pip: 0.1, contract: 1, decimals: 2, fullName: "CAC 40" },
  "CHINA50": { pip: 0.1, contract: 1, decimals: 1, fullName: "FTSE China A50" },
  "UK100": { pip: 0.1, contract: 1, decimals: 1, fullName: "FTSE 100" },
};

// Helper to format price with correct decimals
function formatPrice(price: number | null, symbol: string): string {
  if (price === null || price === undefined) return '----';
  
  const spec = SYMBOL_SPECS[symbol.toUpperCase()] || { decimals: 5, fullName: symbol };
  return price.toFixed(spec.decimals);
}

// Helper to format stop loss/take profit
function formatLevel(level: number | null, symbol: string): string {
  if (level === null || level === undefined) return '----';
  
  const spec = SYMBOL_SPECS[symbol.toUpperCase()] || { decimals: 5, fullName: symbol };
  return level.toFixed(spec.decimals);
}

// Helper: Fetch Real Data from your existing GCS Pipeline
async function fetchSymbolData(symbol: string) {
  const cleanSymbol = symbol.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const url = `https://storage.googleapis.com/mzprimer-data-store/output_${cleanSymbol}.json`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    
    // Get trend from "trend.trend" (bullish/bearish)
    const trendData = data.trend || {};
    const trend = trendData.trend || 'neutral';
    
    // Get current_price from trend section
    const currentPrice = trendData.current_price || data.current_price;
    
    // Get final_decision
    const decision = data.final_decision || 'WAIT';
    
    // Get confidence from risk_score
    const confidence = data.risk_score?.confidence_score || 
                      data.analysis_confidence || 
                      trendData.analysis_confidence || 50;
    
    // Get stop loss and take profit from tp_sl
    const tpSlData = data.tp_sl || {};
    const sl = tpSlData.sl_level;
    const tp = tpSlData.tp_level;
    
    // Get entry price
    const entry = tpSlData.entry_price;
    
    // Get lot size
    const lot = data.risk_management?.lot_size || '0.10';
    
    // Get timestamp for "detected X min ago"
    const timestamp = trendData.timestamp || data.generated_at;
    
    return {
      price: currentPrice,
      trend: trend.replace('_', ' ').toUpperCase(),
      decision: decision.toUpperCase(),
      confidence: confidence,
      sl: sl,
      tp: tp,
      entry: entry,
      lot: lot,
      timestamp: timestamp,
      rawData: data
    };
  } catch (e) {
    console.error(`Failed to fetch data for ${symbol}:`, e);
    return null;
  }
}

// Helper to calculate minutes ago from timestamp
function getMinutesAgo(timestamp: string): number {
  if (!timestamp) return 4; // Default
  
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    // Return at least 1 minute, max 60 minutes
    return Math.max(1, Math.min(diffMinutes, 60));
  } catch (e) {
    return 4; // Default fallback
  }
}

// Generate random viewer count (for demo purposes)
function getRandomViewerCount(): number {
  return Math.floor(Math.random() * (350 - 150 + 1)) + 150;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = (searchParams.get('symbol') || 'EURUSD').toUpperCase();
    const type = (searchParams.get('type') || 'CHAT').toUpperCase();

    // FETCH LIVE DATA
    const liveData = await fetchSymbolData(symbol);
    
    // Format values with correct decimals
    const formattedPrice = formatPrice(liveData?.price || null, symbol);
    const formattedSL = formatLevel(liveData?.sl || null, symbol);
    const formattedTP = formatLevel(liveData?.tp || null, symbol);
    const formattedEntry = formatLevel(liveData?.entry || null, symbol);
    
    // Other values
    const decision = liveData?.decision || 'ANALYZING';
    const trend = liveData?.trend || 'NEUTRAL';
    const confidence = liveData?.confidence || 50;
    const lotSize = liveData?.lot || '0.10';
    
    // Calculate minutes ago
    const minutesAgo = getMinutesAgo(liveData?.timestamp || '');
    
    // Get viewer count
    const viewerCount = getRandomViewerCount();
    
    // Get full symbol name
    const symbolSpec = SYMBOL_SPECS[symbol] || { fullName: symbol, decimals: 5 };
    const fullSymbolName = symbolSpec.fullName;

    // COLORS
    const isBuy = decision.includes('BUY');
    const isSell = decision.includes('SELL');
    const signalColor = isBuy ? '#10B981' : isSell ? '#EF4444' : '#F59E0B';
    
    const isTarget = type === 'TARGETS';
    const isRisk = type === 'RISK';
    const accentColor = isTarget ? '#F59E0B' : isRisk ? '#3B82F6' : signalColor; 
    const title = isTarget ? 'TRADE SETUP' : isRisk ? 'RISK ENGINE' : 'AI ASSISTANT';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#0F172A',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
            opacity: 0.5,
          }} />

          {/* HEADER - Reduced padding */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '30px 40px', // REDUCED from 50px 60px
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            width: '100%',
            position: 'relative',
            zIndex: 1,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                display: 'flex',
                width: '28px', // Slightly smaller
                height: '28px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${accentColor}, ${signalColor})`,
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px', // Smaller font
                fontWeight: 'bold',
              }}>
                MZ
              </div>
              <div style={{ 
                display: 'flex', 
                fontSize: '32px', // Smaller
                fontWeight: '900', 
                letterSpacing: '-0.5px',
                background: 'linear-gradient(90deg, #FFFFFF, #94A3B8)',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitBackgroundClip: 'text',
              }}>
                MZPRIMER
              </div>
              <div style={{
                display: 'flex',
                fontSize: '20px', // Smaller
                color: accentColor,
                fontWeight: '700',
                marginLeft: '12px',
                opacity: 0.9,
              }}>
                // {title}
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-end',
              gap: '6px', // Reduced gap
            }}>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px',
              }}>
                <div style={{ 
                  display: 'flex',
                  width: '8px', // Smaller
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: '#10B981' 
                }} />
                <div style={{ 
                  display: 'flex',
                  fontSize: '16px', // Smaller
                  color: '#94A3B8',
                  fontWeight: '600',
                }}>
                  Detected {minutesAgo}m ago
                </div>
              </div>
              
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '2px',
              }}>
                <div style={{ 
                  display: 'flex',
                  fontSize: '28px', // Smaller
                  color: '#E2E8F0', 
                  fontWeight: '800',
                  letterSpacing: '0.5px',
                }}>
                  {symbol}
                </div>
                <div style={{ 
                  display: 'flex',
                  fontSize: '16px', // Smaller
                  color: '#94A3B8',
                  fontWeight: '600',
                  fontStyle: 'italic',
                }}>
                  {fullSymbolName}
                </div>
              </div>
              
              <div style={{ 
                display: 'flex',
                fontSize: '24px', // Smaller
                color: signalColor,
                fontWeight: '700',
                fontFamily: 'monospace',
                marginTop: '4px',
              }}>
                {formattedPrice}
              </div>
            </div>
          </div>

          {/* MAIN CONTENT - Increased height */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '40px', // REDUCED from 60px
            gap: '30px', // Reduced gap
            width: '100%',
            position: 'relative',
            zIndex: 1,
          }}>

            {/* CHAT VIEW */}
            {type === 'CHAT' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
                {/* User Message */}
                <div style={{
                  display: 'flex',
                  alignSelf: 'flex-end',
                  background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                  color: 'white',
                  padding: '20px 40px', // Smaller
                  borderRadius: '20px 20px 0 20px',
                  fontSize: '28px', // Smaller
                  fontWeight: '700',
                  boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)',
                  maxWidth: '80%',
                }}>
                  "Analyze {symbol} Now"
                </div>
                
                {/* AI Response */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '30px', // Smaller
                  borderRadius: '20px',
                  gap: '20px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                }}>
                  {/* Header */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        display: 'flex',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: signalColor,
                        boxShadow: `0 0 15px ${signalColor}`,
                      }} />
                      <div style={{ 
                        display: 'flex', 
                        fontSize: '24px', // Smaller
                        color: signalColor, 
                        fontWeight: '800',
                        letterSpacing: '0.3px',
                      }}>
                        ⚡ LIVE MARKET SCAN
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      padding: '8px 16px',
                      borderRadius: '16px',
                      background: `linear-gradient(135deg, ${signalColor}20, ${accentColor}20)`,
                      border: `1px solid ${signalColor}40`,
                      fontSize: '18px', // Smaller
                      color: signalColor,
                      fontWeight: '700',
                    }}>
                      {confidence}% CONFIDENCE
                    </div>
                  </div>
                  
                  {/* Data Points */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { label: 'Decision', value: decision, color: signalColor, icon: '🎯' },
                      { label: 'Trend', value: trend, color: '#60A5FA', icon: '📈' },
                      { label: 'Lot Size', value: lotSize, color: '#F59E0B', icon: '⚖️' },
                      { label: 'Current Price', value: formattedPrice, color: '#8B5CF6', icon: '💰' },
                    ].map((item, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ display: 'flex', fontSize: '24px' }}>{item.icon}</div>
                          <div style={{ 
                            display: 'flex', 
                            fontSize: '24px', 
                            color: '#CBD5E1',
                            fontWeight: '600',
                          }}>
                            {item.label}:
                          </div>
                        </div>
                        <div style={{ 
                          display: 'flex',
                          fontSize: '28px', // Smaller
                          color: item.color,
                          fontWeight: '800',
                          textTransform: index === 3 ? 'none' : 'uppercase',
                          fontFamily: index === 3 ? 'monospace' : 'inherit',
                        }}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA */}
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '20px',
                    marginTop: '16px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                  }}>
                    <div style={{
                      display: 'flex',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: accentColor,
                      boxShadow: `0 0 12px ${accentColor}`,
                    }} />
                    <div style={{ 
                      display: 'flex',
                      fontSize: '22px', // Smaller
                      color: '#CBD5E1',
                      fontWeight: '600',
                      textAlign: 'center',
                    }}>
                      Tap to see Entry & Targets • 2 Free Trials
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TARGETS VIEW */}
            {type === 'TARGETS' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%' }}>
                {/* Symbol Display */}
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <div style={{ 
                    display: 'flex',
                    fontSize: '80px', // Smaller
                    fontWeight: '900', 
                    lineHeight: 1,
                    background: `linear-gradient(135deg, ${signalColor}, ${accentColor})`,
                    backgroundClip: 'text',
                    color: 'transparent',
                    WebkitBackgroundClip: 'text',
                    letterSpacing: '-1px',
                    textTransform: 'uppercase',
                  }}>
                    {symbol}
                  </div>
                  <div style={{ 
                    display: 'flex',
                    fontSize: '22px', // Smaller
                    color: '#94A3B8',
                    fontWeight: '600',
                    fontStyle: 'italic',
                  }}>
                    {fullSymbolName}
                  </div>
                </div>
                
                {/* Cards Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
                  
                  {/* Trend Card */}
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '30px', // Smaller
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: `2px solid ${signalColor}30`,
                    borderRadius: '20px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 15px 35px ${signalColor}15`,
                  }}>
                    <div style={{ 
                      display: 'flex',
                      color: signalColor, 
                      fontSize: '24px', // Smaller
                      fontWeight: '800',
                      marginBottom: '12px',
                      letterSpacing: '0.3px',
                    }}>
                      📊 AI TREND ANALYSIS
                    </div>
                    <div style={{ 
                      display: 'flex',
                      fontSize: '60px', // Smaller
                      fontWeight: '900', 
                      color: signalColor,
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                      letterSpacing: '0.5px',
                    }}>
                      {trend}
                    </div>
                    <div style={{ 
                      display: 'flex',
                      color: '#94A3B8', 
                      fontSize: '20px', // Smaller
                      fontWeight: '600',
                      padding: '10px 20px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '10px',
                    }}>
                      Confidence: <span style={{ display: 'flex', color: '#FFFFFF', marginLeft: '6px' }}>{confidence}%</span>
                    </div>
                  </div>

                  {/* Targets Card */}
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '30px', // Smaller
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))',
                    border: '2px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '20px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 15px 35px rgba(245, 158, 11, 0.15)',
                  }}>
                    <div style={{ 
                      display: 'flex',
                      color: '#F59E0B', 
                      fontSize: '24px', // Smaller
                      fontWeight: '800',
                      marginBottom: '20px',
                      letterSpacing: '0.3px',
                      textAlign: 'center',
                    }}>
                      🔒 INSTITUTIONAL TARGETS LOCKED
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '24px',
                      width: '100%',
                      marginBottom: '24px',
                    }}>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        padding: '0 16px',
                      }}>
                        <div style={{ 
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          flex: 1,
                        }}>
                          <div style={{ 
                            display: 'flex',
                            fontSize: '18px', // Smaller
                            color: '#94A3B8',
                            fontWeight: '600',
                          }}>
                            Current Price
                          </div>
                          <div style={{ 
                            display: 'flex',
                            fontSize: '40px', // Smaller
                            fontWeight: '900', 
                            color: signalColor, 
                            fontFamily: 'monospace',
                          }}>
                            {formattedPrice}
                          </div>
                        </div>
                        
                        <div style={{ 
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          flex: 1,
                        }}>
                          <div style={{ 
                            display: 'flex',
                            fontSize: '18px', // Smaller
                            color: '#94A3B8',
                            fontWeight: '600',
                          }}>
                            Take Profit
                          </div>
                          <div style={{ 
                            display: 'flex',
                            fontSize: '40px', // Smaller
                            fontWeight: '900', 
                            color: '#10B981', 
                            fontFamily: 'monospace',
                          }}>
                            {formattedTP}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex',
                      padding: '16px 32px', // Smaller
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      borderRadius: '12px', 
                      color: '#FFFFFF', 
                      fontSize: '22px', // Smaller
                      fontWeight: '800',
                      boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
                    }}>
                      VIEW FULL ANALYSIS →
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RISK VIEW */}
            {type === 'RISK' && (
               <div style={{ 
                 display: 'flex', 
                 flexDirection: 'column', 
                 alignItems: 'center', 
                 width: '100%', 
                 gap: '30px' 
               }}>
                  {/* Title & Symbol */}
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <div style={{ 
                      display: 'flex',
                      fontSize: '36px', // Smaller
                      color: '#3B82F6', 
                      fontWeight: '900',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      alignItems: 'center',
                      gap: '16px',
                    }}>
                      <div style={{
                        display: 'flex',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: '#3B82F6',
                        boxShadow: '0 0 20px #3B82F6',
                      }} />
                      <div style={{ display: 'flex' }}>OPTIMIZED RISK MANAGEMENT</div>
                    </div>
                    <div style={{ 
                      display: 'flex',
                      fontSize: '20px', // Smaller
                      color: '#94A3B8',
                      fontWeight: '600',
                      fontStyle: 'italic',
                    }}>
                      {fullSymbolName}
                    </div>
                  </div>
                  
                  {/* Stop Loss Display */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                  }}>
                    <div style={{ 
                      display: 'flex',
                      fontSize: '80px', // Smaller
                      fontWeight: '900', 
                      color: '#3B82F6', 
                      fontFamily: 'monospace',
                      textShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
                      lineHeight: 1,
                    }}>
                      {formattedSL}
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px 30px',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '16px',
                    }}>
                      <div style={{
                        display: 'flex',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: '#3B82F6',
                        boxShadow: '0 0 15px #3B82F6',
                      }} />
                      <div style={{
                        display: 'flex',
                        fontSize: '24px', // Smaller
                        color: '#94A3B8',
                        fontWeight: '600',
                      }}>
                        AI-Calculated Stop Loss
                      </div>
                    </div>
                  </div>
                  
                  {/* Current Price and Confidence */}
                  <div style={{ 
                    display: 'flex',
                    gap: '30px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '80%',
                  }}>
                    <div style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '24px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      flex: 1,
                    }}>
                      <div style={{ 
                        display: 'flex',
                        color: '#94A3B8', 
                        fontSize: '22px', // Smaller
                        fontWeight: '600',
                      }}>
                        Current Price
                      </div>
                      <div style={{ 
                        display: 'flex',
                        color: signalColor, 
                        fontSize: '40px', // Smaller
                        fontWeight: '800',
                        fontFamily: 'monospace',
                      }}>
                        {formattedPrice}
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '24px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      flex: 1,
                    }}>
                      <div style={{ 
                        display: 'flex',
                        color: '#94A3B8', 
                        fontSize: '22px', // Smaller
                        fontWeight: '600',
                      }}>
                        AI Confidence
                      </div>
                      <div style={{ 
                        display: 'flex',
                        color: signalColor, 
                        fontSize: '40px', // Smaller
                        fontWeight: '800',
                        fontFamily: 'monospace',
                      }}>
                        {confidence}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Risk Metrics */}
                  <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginTop: '16px',
                  }}>
                    {[
                      { label: 'Risk/Trade', value: '2.0%', color: '#EF4444' },
                      { label: 'Lot Size', value: lotSize, color: '#10B981' },
                      { label: 'Entry Price', value: formattedEntry, color: '#8B5CF6' },
                    ].map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '20px 28px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        minWidth: '160px',
                        gap: '8px',
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          color: '#94A3B8', 
                          fontSize: '18px', // Smaller
                          fontWeight: '600',
                        }}>
                          {item.label}
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          color: item.color, 
                          fontSize: '28px', // Smaller
                          fontWeight: '800',
                          textShadow: `0 0 15px ${item.color}40`,
                          fontFamily: index === 2 ? 'monospace' : 'inherit',
                        }}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            )}

          </div>

          {/* FOOTER - Smaller and compact */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 40px', // MUCH SMALLER - was 40px 60px
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            width: '100%',
            position: 'relative',
            zIndex: 1,
            backdropFilter: 'blur(10px)',
            minHeight: '80px', // Fixed height
          }}>
            <div style={{ 
              display: 'flex',
              fontSize: '18px', // Smaller
              color: '#64748B',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
            }}>
              <div style={{
                display: 'flex',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: accentColor,
                boxShadow: `0 0 10px ${accentColor}`,
              }} />
              <div style={{ display: 'flex' }}>MZPrimer Data Systems</div>
            </div>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '2px', // Very small gap
            }}>
              <div style={{ 
                display: 'flex',
                fontSize: '18px', // Smaller
                color: accentColor, 
                fontWeight: '800',
                letterSpacing: '0.3px',
                textTransform: 'uppercase',
                opacity: 0.9,
              }}>
                PROFESSIONAL TRADING ACCESS
              </div>
              <div style={{ 
                display: 'flex',
                fontSize: '14px', // Smaller
                color: '#94A3B8',
                fontWeight: '600',
                alignItems: 'center',
                gap: '6px',
              }}>
                <div style={{
                  display: 'flex',
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                }} />
                {viewerCount} traders online
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1080,
      }
    );
  } catch (e: any) {
    console.log(e.message);
    return new Response(`Failed to generate: ${e.message}`, { status: 500 });
  }
}