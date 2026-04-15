'use client';

import { useState } from 'react';
import { Send, Radio, Lock, Bot, Mic, Zap, RefreshCw, Share2, Search, Copy, ExternalLink, TrendingUp, AlertCircle, DollarSign, Target, Shield, Activity, Globe } from 'lucide-react';

// --- DATA TYPES ---
interface TrendInfo {
  trend: string; 
}
interface TradeSignal {
  symbol: string; action: string; entry: number; tp: number; sl: number;
  trend: TrendInfo; confidence: number; timestamp: string;  
}
interface MarketIntelligenceResponse {
  generated_at: string; signals: TradeSignal[];
}

// Update the SymbolData interface to match your actual data structure
interface SymbolData {
  symbol: string;
  trend: {
    trend: string;
    trend_strength: string;
    trend_strength_score: number;
    ema_alignment: string;
    price_position: {
      vs_ema8: string;
      vs_ema21: string;
      vs_ema50: string;
    };
    current_emas: {
      ema_8: number;
      ema_21: number;
      ema_50: number;
    };
    current_price: number;
    analysis_confidence: number;
    data_quality_score: number;
    trend_consistency: number;
    timestamp: string;
    component_quality: number;
  };
  volatility: {
    volatility_level: string;
    avg_atr: number;
    current_atr: number;
    atr_trend: string;
    avg_range: number;
    volatility_score: number;
    volatility_regime: string;
    optimal_sl_multiplier: number;
    component_quality: number;
  };
  momentum: {
    momentum_bias: string;
    rsi_latest: number;
    rsi_trend: string;
    rsi_zone: string;
    rsi_slope: number;
    momentum_strength: string;
    trend_alignment: string;
    divergence_detected: string;
    trend_consistency: number;
    component_quality: number;
  };
  zones: {
    support_zone: number;
    resistance_zone: number;
    zone_strength: string;
    support_quality: number;
    resistance_quality: number;
    zone_width_pips: number;
    current_price_position: string;
    zone_clarity: string;
    trend_alignment: string;
    order_placement_context: string;
    zone_confidence: string;
    component_quality: number;
  };
  pending_orders?: {
    pending_orders: Array<any>;
    primary_order: any;
    order_confidence: number;
    market_context: string;
    rationale: string;
    current_price: number;
    is_valid: boolean;
  };
  tp_sl?: {
    entry_price: number;
    tp_level: number;
    sl_level: number;
    rr_ratio: number;
    sl_distance_pips: number;
    tp_distance_pips: number;
    risk_management: string;
    zone_respected: boolean;
    trend_aligned: boolean;
    order_type: string;
    notes: string;
    is_valid: boolean;
    validation_issues: string[];
    asset_class: string;
    rr_validation: string;
  };
  risk_score: {
    confidence_score: number;
    risk_category: string;
    position_size_multiplier: number;
    analysis_accuracy_used: number;
    base_confidence: number;
  };
  final_decision: string;
  trade_parameters?: {
    trade_validation: any;
    validated_orders: any[];
    primary_validated_order: any;
  };
  summary: string;
  warnings: string[];
  analysis_accuracy: number;
  component_scores: {
    trend: number;
    volatility: number;
    momentum: number;
    zones: number;
  };
  component_weights?: {
    trend: number;
    volatility: number;
    momentum: number;
    zones: number;
  };
  generated_at: string;
  validation: {
    symbol: string;
    is_valid: boolean;
    validation_score: number;
    issues: string[];
    warnings: string[];
    strengths: string[];
    timestamp: string;
    component_quality: {
      trend: number;
      volatility: number;
      momentum: number;
      zones: number;
    };
  };
  quality_indicator: string;
}

// Add this interface for extracted data
interface ExtractedSymbolData {
  currentPrice: number;
  confidence: number;
  trend: string;
  trendDirection: string;
  trendColor: string;
  analysisAccuracy: number;
  finalDecision: string;
  volatilityLevel: string;
  rsi: number;
  rsiZone: string;
  momentumBias: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  rrRatio: number;
  formattedPrice: string;
  formattedEntry: string;
  formattedSL: string;
  formattedTP: string;
}

export default function AdminPushDashboard() {
  // AUTH
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // UI STATE
  const [activeTab, setActiveTab] = useState<'AI' | 'MANUAL' | 'SYMBOL' | 'SEO'>('AI');
  const [sendMode, setSendMode] = useState<'test' | 'all'>('test');
  
  // DATA STATE
  const [testId, setTestId] = useState('');
  
  // MANUAL INPUTS
  const [manualTitle, setManualTitle] = useState('📰 Market Update');
  const [manualMessage, setManualMessage] = useState('CPI Data released. High volatility expected.');
  const [manualUrl, setManualUrl] = useState('https://mpintellect.com');

  // SYMBOL FETCH INPUTS
  const [symbolInput, setSymbolInput] = useState('XAUUSD');
  const [isFetchingSymbol, setIsFetchingSymbol] = useState(false);
  const [fetchedSymbolData, setFetchedSymbolData] = useState<SymbolData | null>(null);
  const [symbolFetchError, setSymbolFetchError] = useState<string>('');
  const [symbolExtractedData, setSymbolExtractedData] = useState<ExtractedSymbolData | null>(null);

  // AI INPUTS
  const [aiData, setAiData] = useState<TradeSignal | null>(null);
  const [isFetchingAI, setIsFetchingAI] = useState(false);
  const [generatedPayload, setGeneratedPayload] = useState({ title: '', body: '' });

  // SEO STATE
  const [seoLoading, setSeoLoading] = useState(false);
  const [seoLogs, setSeoLogs] = useState<string[]>([]);

  // PROCESS STATE
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password.trim()) {
        alert("Please enter a password");
        return;
    }

    setLoading(true);
    
    try {
        const res = await fetch('/api/admin/validate', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ password })
        });
        
        const data = await res.json();
        
        if (data.valid) {
            setIsAuthenticated(true);
            setStatus('✅ Authentication successful');
        } else {
            alert("Access Denied");
            setStatus('❌ Invalid credentials');
        }
    } catch (error: any) {
        console.error('Login error:', error);
        alert("Authentication failed - Server error");
        setStatus('❌ Server connection failed');
    } finally {
        setLoading(false);
    }
}

  // --- ENHANCED FORMATTING FUNCTIONS ---
  const formatPrice = (price: number, symbol: string = '') => {
    if (price === 0) return 'N/A';
    
    // Special formatting based on symbol type
    if (symbol.includes('XAU') || symbol.includes('XAG')) {
      // Metals: show 2 decimals
      return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (symbol.includes('BTC') || symbol.includes('ETH')) {
      // Crypto: show 0-2 decimals based on value
      if (price >= 1000) return price.toLocaleString(undefined, { maximumFractionDigits: 0 });
      return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (symbol.includes('JPY')) {
      // JPY pairs: show 3 decimals
      return price.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    }
    
    // Default forex: show 5 decimals
    return price.toLocaleString(undefined, { minimumFractionDigits: 5, maximumFractionDigits: 5 });
  };

  const getEmojiForTrend = (trend: string) => {
    if (trend.includes('bullish')) return '📈';
    if (trend.includes('bearish')) return '📉';
    return '➡️';
  };

  const getEmojiForDecision = (decision: string) => {
    if (decision === 'BUY') return '🟢';
    if (decision === 'SELL') return '🔴';
    return '🟡';
  };

  const getEmojiForVolatility = (volatility: string) => {
    if (volatility === 'low') return '😌';
    if (volatility === 'moderate') return '😐';
    if (volatility === 'high') return '😰';
    if (volatility === 'extreme') return '😱';
    return '📊';
  };

  const getEmojiForRSI = (rsi: number) => {
    if (rsi > 70) return '🔥';
    if (rsi < 30) return '🥶';
    return '🌡️';
  };

  // --- SEO LOGIC (Fixed) ---
  const triggerSeoScan = async () => {
    setSeoLoading(true);
    setSeoLogs([`🤖 Authenticating with pSEO Engine...`]);
    
    try {
        // FIX: Change to POST and send the secretKey
        const res = await fetch('/api/indexing/cron', { // Ensure this matches your route path
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secretKey: password, // Uses the password you typed to login
                force: true // Optional flag if your API supports forcing updates
            })
        });

        const data = await res.json();

        if(res.ok) {
            const logs = [];
            logs.push(`✅ Success. Engine: ${data.source || 'Active'}`);
            logs.push(`🔍 Scanned ${data.scanned} assets.`);
            
            if (Array.isArray(data.actions) && data.actions.length > 0) {
                data.actions.forEach((action: any) => {
                    if (action.status === 'indexed') {
                        logs.push(`🚀 INDEXED ${action.symbol}: ${action.reason}`);
                    } else if (action.status === 'error') {
                        logs.push(`⚠️ ERROR ${action.symbol}: ${action.error}`);
                    }
                });
            } else {
                logs.push("ℹ️ Market Stable. No index requests sent (Saving Google Quota).");
            }
            setSeoLogs(logs);
        } else {
            setSeoLogs([`❌ Server Error: ${data.error || 'Unknown error'}`]);
        }
    } catch(e: any) {
        setSeoLogs([`❌ Network Failure: ${e.message}`]);
    } finally {
        setSeoLoading(false);
    }
  };

  // --- SOCIAL HACK: STOCKTWITS OPENER ---
  const triggerStocktwitsHack = (title: string, symbolData: TradeSignal | SymbolData) => {
    
    // Check if it's TradeSignal or SymbolData
    const isTradeSignal = 'action' in symbolData;
    const rawSymbol = symbolData.symbol.replace('/', '').toUpperCase();
    
    // 1. SMART SYMBOL MAPPING
    let ticker = `$${rawSymbol}`; // Default

    const symbolMap: Record<string, string> = {
        'CHINA50': '$DAX',
        'US30': '$DJI',
        'NAS100': '$NDX',
        'US500': '$SPX',
        'XAUUSD': '$GOLD',
        'BTCUSD': '$BTC.X',
        'ETHUSD': '$ETH.X'
    };

    if (symbolMap[rawSymbol]) {
        ticker = symbolMap[rawSymbol];
    } else {
        const isForex = rawSymbol.length === 6 && !rawSymbol.includes('BTC') && !rawSymbol.includes('ETH');
        if (!isForex) ticker = `$${rawSymbol.replace('USD','').replace('T','')}.X`;
    }

    // 2. SENTIMENT & EMOJI
    let sentiment = "neutral";
    let emoji = "🟡";
    
    if (isTradeSignal) {
      const isBuy = (symbolData as TradeSignal).action === 'BUY';
      sentiment = isBuy ? "bullish" : "bearish";
      emoji = isBuy ? "🟢" : "🔴";
    } else {
      const symData = symbolData as SymbolData;
      if (symData.final_decision) {
        const isBuy = symData.final_decision === 'BUY';
        sentiment = isBuy ? "bullish" : "bearish";
        emoji = isBuy ? "🟢" : "🔴";
      }
    }

    // 3. ENHANCED MESSAGE BODY
    const text = `
${ticker} ${sentiment.toUpperCase()} ${emoji}

🎯 AI Analysis Signal
📊 Price: ${isTradeSignal ? (symbolData as TradeSignal).entry : formatPrice((symbolData as SymbolData).trend?.current_price || 0, rawSymbol)}
📈 Trend: ${isTradeSignal ? (symbolData as TradeSignal).trend.trend.replace('_',' ') : (symbolData as SymbolData).trend?.trend?.replace('_',' ') || 'Neutral'}
⚡ Confidence: ${isTradeSignal ? (symbolData as TradeSignal).confidence : (symbolData as SymbolData).risk_score?.confidence_score || 0}%

View full technical analysis 👇
    `.trim();

    // 4. LINK & OPEN
    const targetLink = `https://mpintellect.com/analysis/${rawSymbol}`;
    const shareUrl = `https://stocktwits.com/widgets/share?body=${encodeURIComponent(text)}&sentiment=${sentiment}&url=${encodeURIComponent(targetLink)}`;

    window.open(shareUrl, 'StocktwitsWindow', 'width=550,height=550,left=100,top=100,scrollbars=no,resizable=no');
  };

  // --- UPDATED: MANUAL SYMBOL FETCH FUNCTION ---
  const fetchManualSymbol = async () => {
    if (!symbolInput.trim()) {
      setSymbolFetchError('Please enter a symbol');
      return;
    }

    setIsFetchingSymbol(true);
    setSymbolFetchError('');
    setFetchedSymbolData(null);
    setSymbolExtractedData(null);
    setStatus('');

    try {
      // Call the API route that uses your fetchData.ts
      const res = await fetch(`/api/symbol-data?symbol=${encodeURIComponent(symbolInput)}`);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to fetch ${symbolInput}`);
      }
      
      const data: SymbolData = await res.json();
      setFetchedSymbolData(data);
      
      // ✅ EXTRACT EXACT DATA YOU NEED WITH SAFE ACCESS:
      const currentPrice = data.trend?.current_price || 0;
      const confidence = data.risk_score?.confidence_score || 0;
      const trend = data.trend?.trend || 'neutral';
      const analysisAccuracy = data.analysis_accuracy || 0;
      const finalDecision = data.final_decision || 'NEUTRAL';
      const volatilityLevel = data.volatility?.volatility_level || 'medium';
      const rsi = data.momentum?.rsi_latest || 0;
      const rsiZone = data.momentum?.rsi_zone || 'neutral';
      const momentumBias = data.momentum?.momentum_bias || 'neutral';
      
      // Safely access tp_sl with optional chaining
      const entryPrice = data.tp_sl?.entry_price || 0;
      const stopLoss = data.tp_sl?.sl_level || 0;
      const takeProfit = data.tp_sl?.tp_level || 0;
      const rrRatio = data.tp_sl?.rr_ratio || 0;
      
      // Also check pending_orders as alternative source for entry price
      const pendingEntryPrice = data.pending_orders?.primary_order?.entry_price || 0;
      const pendingSL = data.pending_orders?.primary_order?.sl_price || 0;
      const pendingTP = data.pending_orders?.primary_order?.tp_price || 0;
      const pendingRR = data.pending_orders?.primary_order?.rr_ratio || 0;
      
      // Use tp_sl data first, fallback to pending_orders
      const finalEntryPrice = entryPrice || pendingEntryPrice;
      const finalStopLoss = stopLoss || pendingSL;
      const finalTakeProfit = takeProfit || pendingTP;
      const finalRRRatio = rrRatio || pendingRR;
      
      // Calculate simplified trend direction
      let trendDirection = 'NEUTRAL';
      let trendColor = 'text-yellow-500';
      
      if (trend.includes('bullish')) {
        trendDirection = 'BULLISH';
        trendColor = 'text-emerald-400';
      } else if (trend.includes('bearish')) {
        trendDirection = 'BEARISH';
        trendColor = 'text-red-400';
      }
      
      // Store extracted data for UI display
      setSymbolExtractedData({
        currentPrice,
        confidence,
        trend,
        trendDirection,
        trendColor,
        analysisAccuracy,
        finalDecision,
        volatilityLevel,
        rsi,
        rsiZone,
        momentumBias,
        entryPrice: finalEntryPrice,
        stopLoss: finalStopLoss,
        takeProfit: finalTakeProfit,
        rrRatio: finalRRRatio,
        formattedPrice: formatPrice(currentPrice, data.symbol),
        formattedEntry: formatPrice(finalEntryPrice, data.symbol),
        formattedSL: formatPrice(finalStopLoss, data.symbol),
        formattedTP: formatPrice(finalTakeProfit, data.symbol)
      });
      
      // ENHANCED PAYLOAD GENERATION
      const decisionEmoji = getEmojiForDecision(finalDecision);
      const trendEmoji = getEmojiForTrend(trend);
      const volatilityEmoji = getEmojiForVolatility(volatilityLevel);
      const rsiEmoji = getEmojiForRSI(rsi);
      
      const title = `🚨 ${data.symbol} ALERT: ${finalDecision} ${decisionEmoji}`;
      
      // LINE-BY-LINE FORMATTING
      const body = `
🎯 ${data.symbol} ANALYSIS REPORT
💰 Price: ${formatPrice(currentPrice, data.symbol)}
${finalDecision === 'BUY' ? '🟢 **BUY SIGNAL**' : finalDecision === 'SELL' ? '🔴 **SELL SIGNAL**' : '🟡 **HOLD**'}
📈 Trend: ${trend.replace('_', ' ')} ${trendEmoji}
⚡ Confidence: ${confidence}%
📊 Accuracy: ${analysisAccuracy}%
🌊 Momentum: ${momentumBias}
${volatilityEmoji} Volatility: ${volatilityLevel}
${rsiEmoji} RSI: ${rsi.toFixed(1)} (${rsiZone.replace('_', ' ')})

🎯 TRADE SETUP:
🎯 Entry: ${formatPrice(finalEntryPrice, data.symbol)}
🛡️ Stop Loss: ${formatPrice(finalStopLoss, data.symbol)}
🎯 Take Profit: ${formatPrice(finalTakeProfit, data.symbol)}
📊 Risk/Reward: ${finalRRRatio.toFixed(2)}:1

${data.summary?.split('\n')[0] || 'AI analysis suggests trading opportunity.'}
      `.trim();
      
      if (activeTab === 'SYMBOL') {
        setGeneratedPayload({ 
          title, 
          body 
        });
      }
      
      setStatus(`✅ Fetched ${data.symbol}: ${formatPrice(currentPrice, data.symbol)} | ${trendDirection} ${trendEmoji} | ${confidence}% confidence`);
      
    } catch (error: any) {
      console.error('Symbol fetch error:', error);
      setSymbolFetchError(error.message || 'Failed to fetch symbol data');
      setStatus(`❌ ${error.message || 'Symbol fetch failed'}`);
    } finally {
      setIsFetchingSymbol(false);
    }
  };

  // --- AI LOGIC: FETCH & FORMAT ---
  const fetchAiTrade = async () => {
      setIsFetchingAI(true);
      setAiData(null);
      setStatus('');

      try {
        const res = await fetch(`/api/livemarketfeed?admin=true&t=${Date.now()}`);
        if (!res.ok) throw new Error("API Route Failed");
        
        const data: MarketIntelligenceResponse = await res.json();
        
        if (data.signals && data.signals.length > 0) {
            const bestTrade = data.signals.sort((a, b) => b.confidence - a.confidence)[0];
            setAiData(bestTrade);
            
            const trendIcon = bestTrade.action === 'BUY' ? '🟢' : '🔴';
            const trendText = bestTrade.trend?.trend.replace(/_/g, ' ') || 'Neutral';
            const trendEmoji = getEmojiForTrend(bestTrade.trend?.trend || '');
            
            const title = `🚨 AI Signal: ${bestTrade.action} ${bestTrade.symbol} ${trendIcon}`;
            
            // Enhanced AI message with line-by-line formatting
            const body = `
🎯 ${bestTrade.symbol} AI Trade Parameters
💰 Entry: ${bestTrade.entry}
${bestTrade.action === 'BUY' ? '🟢 **BUY NOW**' : '🔴 **SELL NOW**'}
📈 Trend: ${trendText} ${trendEmoji}
⚡ Confidence: ${bestTrade.confidence}%
🎯 Take Profit: ${bestTrade.tp}
🛡️ Stop Loss: ${bestTrade.sl}
📊 Signal Quality: High

AI detects strong momentum opportunity
            `.trim();
            
            setGeneratedPayload({ title, body });
        } else {
            setStatus('❌ No signals found.');
        }
      } catch (e) {
        console.error(e);
        setStatus('❌ Data connection failed.');
      } finally {
          setIsFetchingAI(false);
      }
  };

  // --- ENHANCED SEND BROADCAST LOGIC ---
  const handleSend = async () => {
    if(!confirm(`⚠️ CONFIRM BROADCAST: Send to ${sendMode === 'all' ? 'ALL CHANNELS' : 'TEST DEVICE'}?`)) return;

    setLoading(true);
    setStatus('Sending...');

    let finalTitle = '';
    let finalMessage = '';
    let finalUrl = 'https://mpintellect.com';

    // Determine which data source to use
    if (activeTab === 'AI') {
      finalTitle = generatedPayload.title;
      finalMessage = generatedPayload.body;
      finalUrl = 'https://mpintellect.com';
    } else if (activeTab === 'MANUAL') {
      finalTitle = manualTitle;
      finalMessage = manualMessage;
      finalUrl = manualUrl;
    } else if (activeTab === 'SYMBOL' && fetchedSymbolData && symbolExtractedData) {
      // Use enhanced formatting for broadcast
      finalTitle = `🚨 ${fetchedSymbolData.symbol} ALERT: ${symbolExtractedData.finalDecision} ${getEmojiForDecision(symbolExtractedData.finalDecision)}`;
      
      // Enhanced line-by-line message
      finalMessage = `
🎯 ${fetchedSymbolData.symbol} ANALYSIS
💰 Price: ${symbolExtractedData.formattedPrice}
${symbolExtractedData.finalDecision === 'BUY' ? '🟢 **BUY SIGNAL**' : symbolExtractedData.finalDecision === 'SELL' ? '🔴 **SELL SIGNAL**' : '🟡 **HOLD**'}
✅ Take Profit: ${symbolExtractedData.takeProfit}

❌  Stop Loss: ${symbolExtractedData.stopLoss}

📈 Trend: ${symbolExtractedData.trend.replace('_', ' ')} ${getEmojiForTrend(symbolExtractedData.trend)}
⚡ Confidence: ${symbolExtractedData.confidence}%
${getEmojiForVolatility(symbolExtractedData.volatilityLevel)} Volatility: ${symbolExtractedData.volatilityLevel}
${getEmojiForRSI(symbolExtractedData.rsi)} RSI: ${symbolExtractedData.rsi.toFixed(1)} (${symbolExtractedData.rsiZone.replace('_', ' ')})

${fetchedSymbolData.summary?.split('\n')[0] || 'AI analysis suggests trading opportunity.'}
      `.trim();
      
      finalUrl = `https://mpintellect.com/analysis/${fetchedSymbolData.symbol}`;
    } else {
      setStatus('❌ No data to send');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: finalTitle,
          message: finalMessage,
          url: finalUrl,
          sendToAll: sendMode === 'all',
          targetUserId: sendMode === 'test' ? testId : undefined
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setStatus(`✅ SUCCESS. Broadcast sent to ${data.count || 1} endpoints.`);
        
        // AUTO-OPEN STOCKTWITS FOR AI OR SYMBOL BROADCASTS
        if (sendMode === 'all') {
          if (activeTab === 'AI' && aiData) {
            triggerStocktwitsHack(finalTitle, aiData);
          } else if (activeTab === 'SYMBOL' && fetchedSymbolData) {
            triggerStocktwitsHack(finalTitle, fetchedSymbolData);
          }
        }

      } else {
        setStatus(`❌ ERROR: ${data.error}`);
      }
    } catch (err) {
      setStatus('❌ Network/Keys Failed.');
    } finally {
        setLoading(false);
    }
  };

  // --- COPY ENHANCED DATA FUNCTION ---
  const copyEnhancedData = () => {
    if (!fetchedSymbolData || !symbolExtractedData) return;
    
    const dataText = `
${fetchedSymbolData.symbol} ANALYSIS
=======================
💰 PRICE: ${symbolExtractedData.formattedPrice}
${symbolExtractedData.finalDecision === 'BUY' ? '🟢 **BUY SIGNAL**' : symbolExtractedData.finalDecision === 'SELL' ? '🔴 **SELL SIGNAL**' : '🟡 **HOLD**'}
✅ Take Profit: ${symbolExtractedData.takeProfit}

❌  Stop Loss: ${symbolExtractedData.stopLoss}

📈 Trend: ${symbolExtractedData.trend.replace('_', ' ')} ${getEmojiForTrend(symbolExtractedData.trend)}
⚡ Confidence: ${symbolExtractedData.confidence}%
${getEmojiForVolatility(symbolExtractedData.volatilityLevel)} Volatility: ${symbolExtractedData.volatilityLevel}
${getEmojiForRSI(symbolExtractedData.rsi)} RSI: ${symbolExtractedData.rsi.toFixed(1)}

🎯 Trade Setup:
Entry: ${symbolExtractedData.formattedEntry}
Stop Loss: ${symbolExtractedData.formattedSL}
Take Profit: ${symbolExtractedData.formattedTP}
Risk/Reward: ${symbolExtractedData.rrRatio.toFixed(2)}:1
    `.trim();
    
    navigator.clipboard.writeText(dataText);
    setStatus('✅ Enhanced data copied to clipboard');
  };

  // --- LOCK SCREEN ---
  if(!isAuthenticated) {
      return (
          <div className="h-screen bg-black flex items-center justify-center flex-col gap-6 text-white admin-bg-pattern">
              <div className="p-8 border border-zinc-800 bg-zinc-900/80 backdrop-blur-md rounded-2xl text-center shadow-2xl w-full max-w-md">
                <Lock size={48} className="mx-auto text-yellow-500 mb-4" />
                <h1 className="admin-title text-2xl mb-6">Secure Command Access</h1>
                <div className="space-y-3">
                    <input 
                        type="password" 
                        className="admin-input text-center font-mono text-lg"
                        placeholder="ENTER PASSKEY"
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    <button 
    onClick={handleLogin} 
    disabled={loading}
    className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
>
    {loading ? (
        <span className="flex items-center justify-center gap-2">
            <RefreshCw className="animate-spin" size={18} />
            VERIFYING...
        </span>
    ) : (
        'UNLOCK TERMINAL'
    )}
</button>
                </div>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen text-white p-4 md:p-10 admin-bg-pattern font-sans flex justify-center">
      <div className="max-w-4xl w-full admin-card-container rounded-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="p-8 border-b border-zinc-800 bg-gradient-to-r from-black/50 to-zinc-900/50 flex justify-between items-center">
            <div>
                <h1 className="admin-title text-3xl text-white flex items-center gap-3">
                    <Radio size={28} className="text-red-500 animate-pulse" /> 
                    <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">MZ BROADCAST</span>
                </h1>
                <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest font-mono">System: Omni-Channel v4.0</p>
            </div>
            <div className="admin-badge-online flex items-center gap-2 px-4 py-2 bg-emerald-900/30 rounded-full border border-emerald-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-emerald-400">ONLINE</span>
            </div>
        </div>

        <div className="p-8 space-y-8">

            {/* TARGET SELECTION */}
            <section>
                <label className="admin-title text-xs text-zinc-500 block mb-3 flex items-center gap-2">
                  <Target size={14} /> 1. SELECT TARGET SPECTRUM
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setSendMode('test')}
                        className={`p-6 rounded-xl flex flex-col items-center justify-center gap-3 btn-broadcast-test ${sendMode === 'test' ? 'selected' : 'hover:bg-blue-900/20'}`}
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-900/30 border border-blue-700 flex items-center justify-center">
                          <Activity size={24} className="text-blue-400" />
                        </div>
                        <span className="font-bold text-lg">TEST MODE</span>
                        <span className="text-xs opacity-50 font-mono">Target UID Only</span>
                    </button>
                    <button 
                        onClick={() => setSendMode('all')}
                        className={`p-6 rounded-xl flex flex-col items-center justify-center gap-3 btn-broadcast-all ${sendMode === 'all' ? 'selected' : 'hover:bg-red-900/20'}`}
                    >
                        <div className="w-12 h-12 rounded-full bg-red-900/30 border border-red-700 flex items-center justify-center">
                          <Send size={24} className="text-red-400" />
                        </div>
                        <span className="font-bold text-lg">GLOBAL BROADCAST</span>
                        <span className="text-xs opacity-50 font-mono">Push + Telegram + Socials</span>
                    </button>
                </div>
            </section>

            {/* TEST INPUT */}
            {sendMode === 'test' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="admin-title text-xs text-blue-500 mb-2 block flex items-center gap-2">
                      <Shield size={14} /> Test UID
                    </label>
                    <input 
                      type="text" 
                      className="admin-input font-mono text-sm bg-blue-900/10 border-blue-700/30" 
                      value={testId} 
                      onChange={e => setTestId(e.target.value)} 
                      placeholder="e.g. Zx9s7d..." 
                    />
                </div>
            )}

            <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent w-full" />

            {/* PAYLOAD MODE */}
            <section>
                <label className="admin-title text-xs text-zinc-500 block mb-3 flex items-center gap-2">
                  <DollarSign size={14} /> 2. PAYLOAD TYPE
                </label>
                <div className="flex border-b border-zinc-700">
                    <button 
                        onClick={() => setActiveTab('AI')}
                        className={`flex-1 py-4 font-bold text-sm flex justify-center items-center gap-3 transition-all ${activeTab === 'AI' ? 'admin-tab-active-ai' : 'text-zinc-600 hover:text-zinc-300 hover:bg-emerald-900/10'}`}
                    >
                        <Bot size={20} /> AI SIGNAL
                    </button>
                    <button 
                        onClick={() => setActiveTab('MANUAL')}
                        className={`flex-1 py-4 font-bold text-sm flex justify-center items-center gap-3 transition-all ${activeTab === 'MANUAL' ? 'admin-tab-active-manual' : 'text-zinc-600 hover:text-zinc-300 hover:bg-blue-900/10'}`}
                    >
                        <Mic size={20} /> MANUAL
                    </button>
                    <button 
                        onClick={() => setActiveTab('SYMBOL')}
                        className={`flex-1 py-4 font-bold text-sm flex justify-center items-center gap-3 transition-all ${activeTab === 'SYMBOL' ? 'admin-tab-active-manual' : 'text-zinc-600 hover:text-zinc-300 hover:bg-purple-900/10'}`}
                    >
                        <Search size={20} /> SYMBOL FETCH
                    </button>
                    <button 
                        onClick={() => setActiveTab('SEO')}
                        className={`flex-1 py-4 font-bold text-sm flex justify-center items-center gap-3 transition-all ${activeTab === 'SEO' ? 'admin-tab-active-manual' : 'text-zinc-600 hover:text-zinc-300 hover:bg-green-900/10'}`}
                    >
                        <Globe size={20} /> SEO INDEXING
                    </button>
                </div>

                <div className="mt-8">
                    {/* AI PANEL */}
                    {activeTab === 'AI' && (
                        <div className="space-y-6 animate-in fade-in">
                            <button 
                              onClick={fetchAiTrade} 
                              disabled={isFetchingAI} 
                              className="w-full bg-gradient-to-r from-emerald-900/30 to-emerald-800/20 hover:from-emerald-900/40 hover:to-emerald-800/30 border border-emerald-700/30 text-white py-4 px-6 rounded-xl flex items-center justify-center gap-3 text-base font-bold transition-all hover:scale-[1.02]"
                            >
                                {isFetchingAI ? <RefreshCw className="animate-spin" size={20}/> : <Zap size={20} fill="currentColor" className="text-yellow-400"/>}
                                {isFetchingAI ? "CONNECTING TO AI..." : "FETCH MARKET INTELLIGENCE"}
                            </button>

                            {aiData && (
                                <div className="admin-preview-box mt-4 group border border-emerald-500/20 bg-gradient-to-br from-emerald-900/10 to-black">
                                    <div className="admin-preview-line bg-emerald-500"></div>
                                    <div className="pl-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[10px] uppercase font-mono text-emerald-500 flex items-center gap-2">
                                              <TrendingUp size={12} /> AI READY
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <Share2 size={14} className="text-blue-400" />
                                                <span className="text-zinc-500 text-[10px]">Stocktwits Active</span>
                                            </div>
                                        </div>
                                        <h3 className="text-white font-bold text-xl mb-3">{generatedPayload.title}</h3>
                                        <div className="space-y-2 text-zinc-300 text-sm font-mono bg-black/30 p-4 rounded-lg border border-zinc-800">
                                          {generatedPayload.body.split('\n').map((line, index) => (
                                            <div key={index} className="py-1 border-b border-zinc-800/30 last:border-b-0">
                                              {line}
                                            </div>
                                          ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MANUAL PANEL */}
                    {activeTab === 'MANUAL' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div>
                                <label className="text-xs text-blue-400 font-bold uppercase mb-2 block flex items-center gap-2">
                                  <Mic size={14} /> Title
                                </label>
                                <input className="admin-input border-blue-700/30 bg-blue-900/10" value={manualTitle} onChange={e => setManualTitle(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs text-blue-400 font-bold uppercase mb-2 block flex items-center gap-2">
                                  <Mic size={14} /> Message
                                </label>
                                <textarea className="admin-input font-mono text-sm border-blue-700/30 bg-blue-900/10" rows={4} value={manualMessage} onChange={e => setManualMessage(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs text-blue-400 font-bold uppercase mb-2 block flex items-center gap-2">
                                  <ExternalLink size={14} /> Link
                                </label>
                                <input className="admin-input text-blue-300 border-blue-700/30 bg-blue-900/10" value={manualUrl} onChange={e => setManualUrl(e.target.value)} />
                            </div>
                        </div>
                    )}

                    {/* ENHANCED SYMBOL FETCH PANEL */}
                    {activeTab === 'SYMBOL' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="flex gap-3">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        className="admin-input font-mono text-lg uppercase pl-12 border-purple-700/30 bg-purple-900/10"
                                        value={symbolInput}
                                        onChange={e => setSymbolInput(e.target.value.toUpperCase())}
                                        placeholder="XAUUSD, BTCUSD, EURUSD"
                                        onKeyDown={(e) => e.key === 'Enter' && fetchManualSymbol()}
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400">
                                        <Search size={20} />
                                    </div>
                                </div>
                                <button
                                    onClick={fetchManualSymbol}
                                    disabled={isFetchingSymbol}
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8 rounded-xl flex items-center gap-3 font-bold text-lg transition-all hover:scale-[1.02]"
                                >
                                    {isFetchingSymbol ? <RefreshCw className="animate-spin" size={20}/> : <TrendingUp size={20} />}
                                    {isFetchingSymbol ? 'FETCHING...' : 'FETCH'}
                                </button>
                            </div>

                            {symbolFetchError && (
                                <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-700/30 text-red-300 p-4 rounded-xl text-sm flex items-center gap-3">
                                    <AlertCircle size={20} />
                                    {symbolFetchError}
                                </div>
                            )}

                            {fetchedSymbolData && symbolExtractedData && (
                                <div className="admin-preview-box mt-6 group border border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-black rounded-2xl overflow-hidden">
                                    <div className="admin-preview-line bg-gradient-to-b from-purple-500 to-indigo-500"></div>
                                    <div className="pl-4">
                                        {/* HEADER */}
                                        <div className="flex justify-between items-center mb-6 pt-4">
                                            <div>
                                                <span className="text-[10px] uppercase font-mono text-purple-400 block mb-1">
                                                    SYMBOL DATA
                                                </span>
                                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                                    {fetchedSymbolData.symbol}
                                                    <span className={`text-sm px-3 py-1 rounded-full ${symbolExtractedData.trendColor.replace('text-', 'bg-')}/20 ${symbolExtractedData.trendColor} border ${symbolExtractedData.trendColor.replace('text-', 'border-')}/30`}>
                                                        {symbolExtractedData.trendDirection} {getEmojiForTrend(symbolExtractedData.trend)}
                                                    </span>
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-base font-bold px-4 py-2 rounded-full ${fetchedSymbolData.final_decision === 'BUY' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/30' : fetchedSymbolData.final_decision === 'SELL' ? 'bg-red-900/30 text-red-400 border border-red-700/30' : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/30'}`}>
                                                    {fetchedSymbolData.final_decision || 'NEUTRAL'} {getEmojiForDecision(fetchedSymbolData.final_decision)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* MAIN DATA GRID - LINE BY LINE */}
                                        <div className="space-y-4 mb-6">
                                            {/* PRICE LINE */}
                                            <div className="flex items-center justify-between py-3 px-4 bg-black/30 rounded-xl border border-zinc-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-900/20 border border-emerald-700/30 flex items-center justify-center">
                                                        <DollarSign size={20} className="text-emerald-400" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-zinc-500 uppercase">Current Price</div>
                                                        <div className="text-2xl font-bold text-white font-mono">
                                                            {symbolExtractedData.formattedPrice}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-zinc-500">Live</div>
                                                    <div className="text-sm text-emerald-400 font-mono">●</div>
                                                </div>
                                            </div>
                                            
                                            {/* CONFIDENCE & ACCURACY LINES */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-black/30 p-4 rounded-xl border border-zinc-800">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-8 h-8 rounded-full bg-blue-900/20 border border-blue-700/30 flex items-center justify-center">
                                                            <Activity size={16} className="text-blue-400" />
                                                        </div>
                                                        <div className="text-xs text-zinc-500 uppercase">Confidence</div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                                                            <div 
                                                                className={`h-full ${symbolExtractedData.confidence > 70 ? 'bg-emerald-500' : symbolExtractedData.confidence > 50 ? 'bg-yellow-500' : 'bg-red-500'} rounded-full`}
                                                                style={{ width: `${symbolExtractedData.confidence}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xl font-bold text-white">{symbolExtractedData.confidence}%</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-black/30 p-4 rounded-xl border border-zinc-800">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-8 h-8 rounded-full bg-amber-900/20 border border-amber-700/30 flex items-center justify-center">
                                                            <Target size={16} className="text-amber-400" />
                                                        </div>
                                                        <div className="text-xs text-zinc-500 uppercase">Accuracy</div>
                                                    </div>
                                                    <div className="text-2xl font-bold text-white text-right">
                                                        {symbolExtractedData.analysisAccuracy}%
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* TREND DETAILS */}
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="bg-black/30 p-3 rounded-lg border border-zinc-800">
                                                    <div className="text-xs text-zinc-500 mb-1">Trend</div>
                                                    <div className={`font-bold ${symbolExtractedData.trendColor} flex items-center gap-2`}>
                                                        {getEmojiForTrend(symbolExtractedData.trend)} {symbolExtractedData.trend.replace('_', ' ')}
                                                    </div>
                                                </div>
                                                <div className="bg-black/30 p-3 rounded-lg border border-zinc-800">
                                                    <div className="text-xs text-zinc-500 mb-1">Volatility</div>
                                                    <div className={`font-bold ${symbolExtractedData.volatilityLevel === 'low' ? 'text-emerald-400' : symbolExtractedData.volatilityLevel === 'moderate' ? 'text-amber-400' : 'text-red-400'} flex items-center gap-2`}>
                                                        {getEmojiForVolatility(symbolExtractedData.volatilityLevel)} {symbolExtractedData.volatilityLevel}
                                                    </div>
                                                </div>
                                                <div className="bg-black/30 p-3 rounded-lg border border-zinc-800">
                                                    <div className="text-xs text-zinc-500 mb-1">RSI</div>
                                                    <div className={`font-bold ${symbolExtractedData.rsi > 70 ? 'text-red-400' : symbolExtractedData.rsi < 30 ? 'text-emerald-400' : 'text-amber-400'} flex items-center gap-2`}>
                                                        {getEmojiForRSI(symbolExtractedData.rsi)} {symbolExtractedData.rsi.toFixed(1)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* TRADE SETUP SECTION */}
                                        {(symbolExtractedData.entryPrice > 0) && (
                                            <div className="mt-6 pt-6 border-t border-zinc-800">
                                                <h4 className="text-xs text-amber-500 uppercase mb-4 flex items-center gap-2">
                                                    <Target size={14} /> Trade Setup
                                                </h4>
                                                <div className="grid grid-cols-3 gap-4 mb-4">
                                                    <div className="bg-gradient-to-b from-emerald-900/20 to-emerald-900/5 p-4 rounded-xl border border-emerald-700/30 text-center">
                                                        <div className="text-[10px] text-emerald-400 uppercase mb-2 flex items-center justify-center gap-1">
                                                            <TrendingUp size={12} /> Entry
                                                        </div>
                                                        <div className="text-lg font-mono font-bold text-white">{symbolExtractedData.formattedEntry}</div>
                                                    </div>
                                                    <div className="bg-gradient-to-b from-red-900/20 to-red-900/5 p-4 rounded-xl border border-red-700/30 text-center">
                                                        <div className="text-[10px] text-red-400 uppercase mb-2 flex items-center justify-center gap-1">
                                                            <Shield size={12} /> Stop Loss
                                                        </div>
                                                        <div className="text-lg font-mono font-bold text-white">{symbolExtractedData.formattedSL}</div>
                                                    </div>
                                                    <div className="bg-gradient-to-b from-cyan-900/20 to-cyan-900/5 p-4 rounded-xl border border-cyan-700/30 text-center">
                                                        <div className="text-[10px] text-cyan-400 uppercase mb-2 flex items-center justify-center gap-1">
                                                            <Target size={12} /> Take Profit
                                                        </div>
                                                        <div className="text-lg font-mono font-bold text-white">{symbolExtractedData.formattedTP}</div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div className="text-xs text-zinc-500">Risk/Reward Ratio:</div>
                                                    <span className={`text-lg font-bold ${
                                                        symbolExtractedData.rrRatio > 2 ? 'text-emerald-400' :
                                                        symbolExtractedData.rrRatio > 1 ? 'text-amber-400' :
                                                        'text-red-400'
                                                    }`}>
                                                        {symbolExtractedData.rrRatio.toFixed(2)}:1
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* QUICK ACTIONS */}
                                        <div className="mt-8 flex gap-3">
                                            <button
                                                onClick={copyEnhancedData}
                                                className="flex-1 bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all hover:scale-[1.02]"
                                            >
                                                <Copy size={16} /> Copy Enhanced Data
                                            </button>
                                            <a 
                                                href={`/analysis/${fetchedSymbolData.symbol}`}
                                                target="_blank"
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all hover:scale-[1.02]"
                                            >
                                                <ExternalLink size={16} /> Full Analysis
                                            </a>
                                            <a 
                                                href={`/trade/${fetchedSymbolData.symbol}`}
                                                target="_blank"
                                                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all hover:scale-[1.02]"
                                            >
                                                <Target size={16} /> Trade Setup
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SEO PANEL */}
                    {activeTab === 'SEO' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 text-center">
                                <Globe size={48} className="text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-3">Programmatic Indexing Engine</h3>
                                <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
                                    Force Google Bot to crawl updated asset pages. 
                                    The system scans prices and only indexes pages with significant changes (&gt;0.20% move or Trend Flip).
                                </p>
                                
                                <button 
                                    onClick={triggerSeoScan}
                                    disabled={seoLoading}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 mx-auto transition-all hover:scale-[1.02] text-lg"
                                >
                                    {seoLoading ? <RefreshCw className="animate-spin" size={24}/> : <Search size={24} />}
                                    {seoLoading ? "SCANNING MARKETS..." : "RUN GOOGLE INDEXER"}
                                </button>
                            </div>

                            {/* SEO LOGS CONSOLE */}
                            <div className="bg-black border border-zinc-800 p-6 rounded-xl font-mono text-sm h-64 overflow-y-auto custom-scrollbar">
                                <div className="text-zinc-500 mb-3 border-b border-zinc-800 pb-3">// SYSTEM LOGS</div>
                                {seoLogs.length === 0 && <span className="text-zinc-600 italic">Waiting for command...</span>}
                                {seoLogs.map((log, i) => (
                                    <div key={i} className={`mb-2 ${log.includes('INDEXED') ? 'text-green-400' : log.includes('ERROR') ? 'text-red-400' : 'text-zinc-300'}`}>
                                        {`> ${log}`}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>

        {/* FOOTER */}
        <div className="p-8 bg-gradient-to-r from-zinc-900/80 to-black/80 border-t border-zinc-800">
            {activeTab !== 'SEO' && (
                <button 
                    onClick={handleSend}
                    disabled={loading || 
                        (activeTab === 'AI' && !aiData) ||
                        (activeTab === 'SYMBOL' && !fetchedSymbolData)
                    } 
                    className={`w-full py-5 rounded-xl font-black tracking-wide flex items-center justify-center gap-4 transition-all text-xl
                        ${(activeTab === 'AI' && !aiData) || (activeTab === 'SYMBOL' && !fetchedSymbolData)
                            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-white to-zinc-200 text-black hover:from-zinc-200 hover:to-white shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]'
                        }`}
                >
                    {loading ? (
                        <span className="animate-pulse flex items-center gap-3">
                            <RefreshCw className="animate-spin" size={24} />
                            TRANSMITTING...
                        </span>
                    ) : (
                        <>
                            <Send size={24} /> EXECUTE BROADCAST
                        </>
                    )}
                </button>
            )}
            
            {status && (
                <div className={`mt-6 p-4 rounded-xl font-mono text-sm ${status.includes('SUCCESS') ? 'bg-gradient-to-r from-emerald-900/30 to-emerald-800/20 border border-emerald-700/30 text-emerald-300' : status.includes('ERROR') ? 'bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-700/30 text-red-300' : 'bg-gradient-to-r from-blue-900/30 to-blue-800/20 border border-blue-700/30 text-blue-300'}`}>
                    {status}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}