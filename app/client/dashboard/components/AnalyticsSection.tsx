"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { useEffect, useState } from "react";
import { CONTRACT_SIZES } from "@/data/symbols";

interface Setup {
  id: string;
  symbol: string;
  entryPrice: number;
  takeProfit: number;
  stopLoss: number;
  generatedAt: string;
  createdAt: string;
  status: "pending" | "hit_tp" | "hit_sl" | "expired";
  capital: number;
  lotSize: number;
  riskReward: number;
  userId: string;
}

interface TradingStyle {
  type: "SCALPER" | "DAY_TRADER" | "SWING_TRADER" | "AGGRESSIVE" | "CONSERVATIVE";
  confidence: number;
  description: string;
  characteristics: string[];
}

interface ProfitLossData {
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  profitPerTrade: number;
  roi: number;
  largestWin: number;
  largestLoss: number;
  profitFactor: number;
}

export default function UserAnalytics() {
  const [userId, setUserId] = useState<string | null>(null);
  const [setups, setSetups] = useState<Setup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("ALL");
  const [timeFilter, setTimeFilter] = useState<"ALL" | "WEEK" | "MONTH">("ALL");
  const [error, setError] = useState<string>("");

  // Get user from localStorage (Cloudflare auth)
  useEffect(() => {
    const token = localStorage.getItem('cf_token');
    const userData = localStorage.getItem('cf_user');
    
    if (!token || !userData) {
      console.log("❌ No user authenticated");
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(userData);
      setUserId(user.id);
      
      fetchSetups(user.id);
    } catch (error) {
      console.error("❌ Error parsing user data:", error);
      setLoading(false);
    }
  }, []);

  // Fetch setups from Cloudflare API
  const fetchSetups = async (userId: string) => {
    try {
      console.log("🔍 Fetching setups for user:", userId);
      
      const response = await fetch(`/api/setups?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.setups) {
        console.log("🔍 Fetched setups:", data.setups.length);
        
        // Transform the data to match our interface
        const transformedSetups: Setup[] = data.setups.map((setup: any) => ({
          id: setup.id,
          symbol: setup.symbol,
          entryPrice: parseFloat(setup.entry_price),
          takeProfit: parseFloat(setup.take_profit),
          stopLoss: parseFloat(setup.stop_loss),
          generatedAt: setup.generated_at || setup.created_at,
          createdAt: setup.created_at,
          status: setup.status,
          capital: parseFloat(setup.capital) || 1000,
          lotSize: parseFloat(setup.lot_size) || 0.01,
          riskReward: parseFloat(setup.risk_reward) || 1.5,
          userId: setup.user_id
        }));
        
        setSetups(transformedSetups);
        setError("");
      } else {
        throw new Error(data.error || "Failed to fetch setups");
      }
    } catch (error: any) {
      console.error("❌ Error fetching setups:", error);
      setError(`Failed to load data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get timestamp from setup
  const getSetupTimestamp = (setup: Setup): number => {
    try {
      return new Date(setup.generatedAt || setup.createdAt).getTime();
    } catch {
      return Date.now();
    }
  };

  // Filter setups based on selected symbol and time
  const filteredSetups = setups.filter(setup => {
    const symbolMatch = selectedSymbol === "ALL" || setup.symbol === selectedSymbol;
    
    if (timeFilter === "ALL") return symbolMatch;
    
    const setupDate = new Date(getSetupTimestamp(setup));
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - setupDate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (timeFilter === "WEEK") return symbolMatch && diffDays <= 7;
    if (timeFilter === "MONTH") return symbolMatch && diffDays <= 30;
    
    return symbolMatch;
  });

  // ==================== PROFIT/LOSS CALCULATIONS ====================

  const calculateProfitLoss = (): ProfitLossData => {
    let totalProfit = 0;
    let totalLoss = 0;
    let largestWin = 0;
    let largestLoss = 0;
    const completedTrades = filteredSetups.filter(s => s.status === "hit_tp" || s.status === "hit_sl");

    completedTrades.forEach(setup => {
      const contractSize = CONTRACT_SIZES[setup.symbol as keyof typeof CONTRACT_SIZES]?.contract || 100000;
      
      if (setup.status === "hit_tp") {
        const priceDifference = Math.abs(setup.takeProfit - setup.entryPrice);
        const tradeProfit = priceDifference * setup.lotSize * contractSize;
        totalProfit += tradeProfit;
        largestWin = Math.max(largestWin, tradeProfit);
      } else if (setup.status === "hit_sl") {
        const priceDifference = Math.abs(setup.entryPrice - setup.stopLoss);
        const tradeLoss = priceDifference * setup.lotSize * contractSize;
        totalLoss += tradeLoss;
        largestLoss = Math.max(largestLoss, tradeLoss);
      }
    });

    const netProfit = totalProfit - totalLoss;
    const profitPerTrade = completedTrades.length > 0 ? netProfit / completedTrades.length : 0;
    const totalCapital = filteredSetups.reduce((sum, setup) => sum + (setup.capital || 0), 0);
    const roi = totalCapital > 0 ? (netProfit / totalCapital) * 100 : 0;
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;

    return {
      totalProfit,
      totalLoss,
      netProfit,
      profitPerTrade,
      roi,
      largestWin,
      largestLoss,
      profitFactor
    };
  };

  const profitLossData = calculateProfitLoss();

  // ==================== ANALYTICS CALCULATIONS ====================

  // Basic Stats
  const totalSetups = filteredSetups.length;
  const pendingSetups = filteredSetups.filter(s => s.status === "pending").length;
  const tpHitSetups = filteredSetups.filter(s => s.status === "hit_tp").length;
  const slHitSetups = filteredSetups.filter(s => s.status === "hit_sl").length;
  const expiredSetups = filteredSetups.filter(s => s.status === "expired").length;
  const completedTrades = tpHitSetups + slHitSetups;
  
  const winRate = completedTrades > 0 ? (tpHitSetups / completedTrades) * 100 : 0;

  // Trading Volume Analysis
  const totalLots = filteredSetups.reduce((sum, setup) => sum + (setup.lotSize || 0), 0);
  const avgLotSize = totalSetups > 0 ? totalLots / totalSetups : 0;
  const totalCapital = filteredSetups.reduce((sum, setup) => sum + (setup.capital || 0), 0);
  const avgCapital = totalSetups > 0 ? totalCapital / totalSetups : 0;

  // Symbol Analysis
  const symbolUsage = Object.entries(
    filteredSetups.reduce((acc, cur) => {
      acc[cur.symbol] = (acc[cur.symbol] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([symbol, count]) => ({ symbol, count }));

  const topSymbol = symbolUsage.sort((a, b) => b.count - a.count)[0]?.symbol || "N/A";

  // Risk Analysis
  const avgRiskReward = totalSetups > 0 
    ? filteredSetups.reduce((sum, setup) => sum + (setup.riskReward || 1), 0) / totalSetups 
    : 1;
  const highRiskSetups = filteredSetups.filter(s => (s.riskReward || 1) > 2).length;
  const lowRiskSetups = filteredSetups.filter(s => (s.riskReward || 1) < 1.5).length;

  // Time-based Analysis
  const setupsByHour = Array.from({ length: 24 }, (_, hour) => {
    const hourSetups = filteredSetups.filter(setup => {
      try {
        const setupDate = new Date(getSetupTimestamp(setup));
        return setupDate.getHours() === hour;
      } catch {
        return false;
      }
    });
    return { hour: `${hour}:00`, count: hourSetups.length };
  });

  // Profit/Loss by Symbol
  const profitBySymbol = symbolUsage.map(symbolData => {
    const symbolSetups = filteredSetups.filter(s => s.symbol === symbolData.symbol);
    const symbolProfit = symbolSetups.reduce((sum, setup) => {
      const contractSize = CONTRACT_SIZES[setup.symbol as keyof typeof CONTRACT_SIZES]?.contract || 100000;
      
      if (setup.status === "hit_tp") {
        const priceDifference = Math.abs(setup.takeProfit - setup.entryPrice);
        return sum + (priceDifference * setup.lotSize * contractSize);
      } else if (setup.status === "hit_sl") {
        const priceDifference = Math.abs(setup.entryPrice - setup.stopLoss);
        return sum - (priceDifference * setup.lotSize * contractSize);
      }
      return sum;
    }, 0);
    
    return { 
      symbol: symbolData.symbol, 
      profit: symbolProfit, 
      trades: symbolData.count 
    };
  });

  // Monthly Profit/Loss Trend
  const monthlyProfit = filteredSetups.reduce((acc, setup) => {
    try {
      const date = new Date(getSetupTimestamp(setup));
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = 0;
      }
      
      const contractSize = CONTRACT_SIZES[setup.symbol as keyof typeof CONTRACT_SIZES]?.contract || 100000;
      
      if (setup.status === "hit_tp") {
        const priceDifference = Math.abs(setup.takeProfit - setup.entryPrice);
        acc[monthKey] += priceDifference * setup.lotSize * contractSize;
      } else if (setup.status === "hit_sl") {
        const priceDifference = Math.abs(setup.entryPrice - setup.stopLoss);
        acc[monthKey] -= priceDifference * setup.lotSize * contractSize;
      }
    } catch (error) {
      console.error("Error processing setup for monthly profit:", error);
    }
    
    return acc;
  }, {} as Record<string, number>);

  const monthlyProfitData = Object.entries(monthlyProfit)
    .map(([month, profit]) => ({ month, profit }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // ==================== TRADING STYLE ANALYSIS ====================

  const analyzeTradingStyle = (): TradingStyle => {
    if (totalSetups === 0) {
      return {
        type: "CONSERVATIVE",
        confidence: 0,
        description: "No trading data available",
        characteristics: ["Start trading to discover your style"]
      };
    }

    const characteristics: string[] = [];
    let score = {
      scalper: 0,
      dayTrader: 0,
      swingTrader: 0,
      aggressive: 0,
      conservative: 0
    };

    // Trading Frequency Analysis
    const setupsPerDay = totalSetups / 30;
    if (setupsPerDay > 3) {
      score.scalper += 3;
      characteristics.push("High frequency trading");
    } else if (setupsPerDay > 1) {
      score.dayTrader += 2;
      characteristics.push("Daily trading activity");
    } else {
      score.swingTrader += 2;
      characteristics.push("Swing trading pattern");
    }

    // Risk Analysis
    if (avgRiskReward > 2) {
      score.aggressive += 3;
      characteristics.push("High risk-reward preference");
    } else if (avgRiskReward < 1.5) {
      score.conservative += 2;
      characteristics.push("Conservative risk management");
    }

    // Profitability Analysis
    if (profitLossData.netProfit > 0) {
      score.conservative += 2;
      characteristics.push("Profitable trading strategy");
    } else if (profitLossData.netProfit < -totalCapital * 0.1) {
      score.aggressive += 1;
      characteristics.push("High risk tolerance");
    }

    // Lot Size Analysis
    if (avgLotSize > 2) {
      score.aggressive += 2;
      characteristics.push("Large position sizes");
    } else if (avgLotSize < 0.5) {
      score.conservative += 2;
      characteristics.push("Small position sizes");
    }

    // Win Rate Analysis
    if (winRate > 60) {
      score.conservative += 2;
      characteristics.push("High win rate strategy");
    } else if (winRate < 40) {
      score.aggressive += 1;
      characteristics.push("Lower win rate, high risk");
    }

    // Symbol Concentration
    if (symbolUsage.length <= 3 && totalSetups > 5) {
      score.scalper += 1;
      characteristics.push("Focused on few symbols");
    }

    // Determine primary style
    const maxScore = Math.max(...Object.values(score));
    const primaryStyle = Object.keys(score).find(key => score[key as keyof typeof score] === maxScore);

    const styleMap: { [key: string]: Omit<TradingStyle, 'confidence' | 'description' | 'characteristics'> } = {
      scalper: { type: "SCALPER" },
      dayTrader: { type: "DAY_TRADER" },
      swingTrader: { type: "SWING_TRADER" },
      aggressive: { type: "AGGRESSIVE" },
      conservative: { type: "CONSERVATIVE" }
    };

    const confidence = Math.min(100, Math.max(30, (maxScore / 8) * 100));

    const descriptions = {
      SCALPER: "Quick, frequent trades with small profits",
      DAY_TRADER: "Daily trading with medium-term positions",
      SWING_TRADER: "Holding positions for several days",
      AGGRESSIVE: "High risk, high reward approach",
      CONSERVATIVE: "Careful risk management, steady gains"
    };

    const selectedType = styleMap[primaryStyle || "conservative"]?.type || "CONSERVATIVE";

    return {
      type: selectedType,
      confidence,
      description: descriptions[selectedType],
      characteristics
    };
  };

  const tradingStyle = analyzeTradingStyle();

  // ==================== CHART DATA ====================

  const statusData = [
    { name: "TP Hit", value: tpHitSetups, color: "#10B981" },
    { name: "SL Hit", value: slHitSetups, color: "#EF4444" },
    { name: "Pending", value: pendingSetups, color: "#FBBF24" },
    { name: "Expired", value: expiredSetups, color: "#6B7280" },
  ];

  const performanceData = [
    { metric: "Win Rate", value: winRate },
    { metric: "Avg Risk/Reward", value: avgRiskReward },
    { metric: "ROI", value: profitLossData.roi },
  ];

  // ==================== RENDER ====================

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="analytics-loading">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container">
        <h3 className="analytics-header">📊 Trading Analytics</h3>
        <div className="error-message">
          {error}
          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
            Please check if you have setup data.
          </div>
        </div>
      </div>
    );
  }

  if (setups.length === 0) {
    return (
      <div className="analytics-container">
        <h3 className="analytics-header">📊 Trading Analytics</h3>
        <div className="no-data">
          No trading data available yet. Start using setups to see your analytics.
          <br />
          <small style={{ color: '#6b7280', marginTop: '0.5rem', display: 'block' }}>
            User ID: {userId || 'No user'}
          </small>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <h3 className="analytics-header">📊 Advanced Trading Analytics</h3>

      {/* Debug Info */}
      <div style={{ 
        background: '#1a1a1a', 
        padding: '0.5rem', 
        marginBottom: '1rem', 
        borderRadius: '4px',
        fontSize: '0.8rem',
        color: '#6b7280',
        textAlign: 'center'
      }}>
        📊 Showing {filteredSetups.length} of {setups.length} total setups
        {selectedSymbol !== "ALL" && ` • Filtered by: ${selectedSymbol}`}
        {timeFilter !== "ALL" && ` • Time: ${timeFilter.toLowerCase()}`}
      </div>

      {/* Filters */}
      <div className="analytics-filters">
        <select 
          value={selectedSymbol} 
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="filter-select"
        >
          <option value="ALL">All Symbols</option>
          {symbolUsage.map(symbol => (
            <option key={symbol.symbol} value={symbol.symbol}>
              {symbol.symbol} ({symbol.count})
            </option>
          ))}
        </select>

        <select 
          value={timeFilter} 
          onChange={(e) => setTimeFilter(e.target.value as any)}
          className="filter-select"
        >
          <option value="ALL">All Time</option>
          <option value="MONTH">Last 30 Days</option>
          <option value="WEEK">Last 7 Days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{totalSetups}</div>
          <div className="metric-label">Total Setups</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{winRate.toFixed(1)}%</div>
          <div className="metric-label">Win Rate</div>
        </div>
        <div className="metric-card">
          <div className="metric-value" style={{ color: profitLossData.netProfit >= 0 ? '#10B981' : '#EF4444' }}>
            ${profitLossData.netProfit > 0 ? '+' : ''}{profitLossData.netProfit.toFixed(2)}
          </div>
          <div className="metric-label">Net P&L</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{profitLossData.roi.toFixed(1)}%</div>
          <div className="metric-label">ROI</div>
        </div>
      </div>

      {/* Profit/Loss Breakdown */}
      <div className="profit-loss-grid">
        <div className="profit-loss-card positive">
          <div className="pl-value">+${profitLossData.totalProfit.toFixed(2)}</div>
          <div className="pl-label">Total Profit</div>
        </div>
        <div className="profit-loss-card negative">
          <div className="pl-value">-${profitLossData.totalLoss.toFixed(2)}</div>
          <div className="pl-label">Total Loss</div>
        </div>
        <div className="profit-loss-card neutral">
          <div className="pl-value">{profitLossData.profitFactor === Infinity ? "∞" : profitLossData.profitFactor.toFixed(2)}</div>
          <div className="pl-label">Profit Factor</div>
        </div>
        <div className="profit-loss-card neutral">
          <div className="pl-value">${profitLossData.profitPerTrade.toFixed(2)}</div>
          <div className="pl-label">Avg P&L/Trade</div>
        </div>
      </div>

      {/* Trading Style Analysis */}
      <div className="trading-style-card">
        <h4>🎯 Your Trading Style</h4>
        <div className="style-header">
          <span className="style-type">{tradingStyle.type}</span>
          <span className="style-confidence">{tradingStyle.confidence.toFixed(0)}% Match</span>
        </div>
        <p className="style-description">{tradingStyle.description}</p>
        <div className="style-characteristics">
          {tradingStyle.characteristics.map((char, index) => (
            <span key={index} className="characteristic-tag">{char}</span>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="analytics-grid">
        {/* Status Pie Chart */}
        <div className="analytics-card">
          <h4>Trade Outcomes</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => 
                  `${name}: ${value} (${percent ? (percent * 100).toFixed(1) : '0.0'}%)`
                }
                outerRadius={80}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Profit by Symbol */}
        <div className="analytics-card">
          <h4>Profit by Symbol</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={profitBySymbol}>
              <XAxis dataKey="symbol" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Profit"]}
                labelFormatter={(label) => `Symbol: ${label}`}
              />
              <Bar 
                dataKey="profit" 
                fill="#8884d8"
                name="Profit"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Profit Trend */}
        <div className="analytics-card">
          <h4>Monthly Profit Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyProfitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Profit"]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3} 
                name="Monthly Profit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="analytics-card">
          <h4>Performance Metrics</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceData}>
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`${value.toFixed(1)}`, "Value"]} />
              <Bar dataKey="value" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="stats-grid">
        <div className="stats-card">
          <h5>Risk Analysis</h5>
          <div className="stats-list">
            <div className="stat-item">
              <span>Avg Risk/Reward:</span>
              <span>{avgRiskReward.toFixed(2)}:1</span>
            </div>
            <div className="stat-item">
              <span>High Risk Trades:</span>
              <span>{highRiskSetups}</span>
            </div>
            <div className="stat-item">
              <span>Low Risk Trades:</span>
              <span>{lowRiskSetups}</span>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <h5>Symbol Analysis</h5>
          <div className="stats-list">
            <div className="stat-item">
              <span>Most Traded:</span>
              <span>{topSymbol}</span>
            </div>
            <div className="stat-item">
              <span>Unique Symbols:</span>
              <span>{symbolUsage.length}</span>
            </div>
            <div className="stat-item">
              <span>Symbol Concentration:</span>
              <span>{((symbolUsage[0]?.count || 0) / totalSetups * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <h5>Volume Analysis</h5>
          <div className="stats-list">
            <div className="stat-item">
              <span>Total Lots:</span>
              <span>{totalLots.toFixed(2)}</span>
            </div>
            <div className="stat-item">
              <span>Total Capital:</span>
              <span>${totalCapital.toFixed(0)}</span>
            </div>
            <div className="stat-item">
              <span>Active Trades:</span>
              <span>{pendingSetups}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Highlights */}
      <div className="performance-highlights">
        <div className="highlight-card">
          <h5>🎯 Performance Highlights</h5>
          <div className="highlight-list">
            <div className="highlight-item">
              <span>Best Performing Symbol:</span>
              <span>
                {profitBySymbol.length > 0 
                  ? profitBySymbol.reduce((max, current) => current.profit > max.profit ? current : max).symbol
                  : "N/A"
                }
              </span>
            </div>
            <div className="highlight-item">
              <span>Largest Win:</span>
              <span style={{ color: '#10B981' }}>${profitLossData.largestWin.toFixed(2)}</span>
            </div>
            <div className="highlight-item">
              <span>Largest Loss:</span>
              <span style={{ color: '#EF4444' }}>${profitLossData.largestLoss.toFixed(2)}</span>
            </div>
            <div className="highlight-item">
              <span>Total Completed Trades:</span>
              <span>{completedTrades}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button 
          onClick={() => userId && fetchSetups(userId)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Refresh Analytics
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}