// components/DayTraderChart.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { 
  createChart, 
  ColorType, 
  IChartApi, 
  ISeriesApi, 
  CandlestickData, 
  LineStyle,
  LineData,
  CandlestickSeries,
  LineSeries
} from "lightweight-charts";

interface DayTraderChartProps {
  symbol: string;
  data: any;
  height?: number;
}

export default function DayTraderChart({ symbol, data, height = 500 }: DayTraderChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Colors
  const colors = {
    background: "#0a0a15",
    grid: "#1f3a4a",
    text: "#94a3b8",
    gold: "#D4AF37",
    red: "#EF4444",
    green: "#10B981",
    up: "#10B981",
    down: "#EF4444",
  };

  useEffect(() => {
    if (!chartContainerRef.current || !data) return;

    setIsLoading(true);

    // Prepare candle data from JSON
    const candles = data.candles?.data || [];
    const chartData: CandlestickData[] = candles.map((candle: any) => ({
      time: Math.floor(new Date(candle.time).getTime() / 1000),
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: colors.background },
        textColor: colors.text,
        fontSize: 12,
        fontFamily: "'JetBrains Mono', monospace",
      },
      grid: {
        vertLines: { color: colors.grid, style: LineStyle.Dotted, visible: false },
        horzLines: { color: colors.grid, style: LineStyle.Dotted },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: colors.gold, width: 1, style: LineStyle.Dashed },
        horzLine: { color: colors.gold, width: 1, style: LineStyle.Dashed },
      },
      rightPriceScale: {
        borderColor: colors.grid,
        textColor: colors.text,
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: colors.grid,
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Add candlestick series (FIXED: use addSeries with CandlestickSeries)
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: colors.up,
      downColor: colors.down,
      borderVisible: false,
      wickUpColor: colors.up,
      wickDownColor: colors.down,
    });
    candleSeries.setData(chartData);

    // Store references
    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    // Add lines after chart is ready
    const currentTime = getCurrentTime();
    addPivotLines(chart, data, currentTime);
    addCurrentPriceLine(chart, data, currentTime);
    addTPSLLines(chart, data, currentTime);
    addForecastBox(chart, data, currentTime);

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    setIsLoading(false);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [data, height]);

  // Helper to add lines to chart (FIXED: use addSeries with LineSeries)
  const addPivotLines = (chart: IChartApi, data: any, currentTime: number) => {
    const pivot = data.pivot || {};

    // Pivot Line (Yellow dashed)
    if (pivot.level) {
      const pivotLine = chart.addSeries(LineSeries, {
        color: colors.gold,
        lineWidth: 2,
        lineStyle: LineStyle.Dashed,
        priceLineVisible: false,
        lastValueVisible: false,
        priceFormat: { type: "price", precision: 2 },
      });
      const lineData: LineData[] = [
        { time: currentTime - 86400, value: pivot.level },
        { time: currentTime, value: pivot.level },
      ];
      pivotLine.setData(lineData);
    }

    // Resistance 1 Line (Red dashed)
    if (pivot.resistance_1) {
      const r1Line = chart.addSeries(LineSeries, {
        color: colors.red,
        lineWidth: 2,
        lineStyle: LineStyle.Dashed,
        priceLineVisible: false,
        lastValueVisible: false,
        priceFormat: { type: "price", precision: 2 },
      });
      const lineData: LineData[] = [
        { time: currentTime - 86400, value: pivot.resistance_1 },
        { time: currentTime, value: pivot.resistance_1 },
      ];
      r1Line.setData(lineData);
    }

    // Support 1 Line (Green dashed)
    if (pivot.support_1) {
      const s1Line = chart.addSeries(LineSeries, {
        color: colors.green,
        lineWidth: 2,
        lineStyle: LineStyle.Dashed,
        priceLineVisible: false,
        lastValueVisible: false,
        priceFormat: { type: "price", precision: 2 },
      });
      const lineData: LineData[] = [
        { time: currentTime - 86400, value: pivot.support_1 },
        { time: currentTime, value: pivot.support_1 },
      ];
      s1Line.setData(lineData);
    }
  };

  const addCurrentPriceLine = (chart: IChartApi, data: any, currentTime: number) => {
    const currentPrice = data.chart?.current_price || data.pending_orders?.current_price || 0;

    if (currentPrice) {
      const priceLine = chart.addSeries(LineSeries, {
        color: colors.gold,
        lineWidth: 2,
        lineStyle: LineStyle.Dashed,
        priceLineVisible: false,
        lastValueVisible: true,
        priceFormat: { type: "price", precision: 2 },
      });
      const lineData: LineData[] = [
        { time: currentTime - 86400, value: currentPrice },
        { time: currentTime, value: currentPrice },
      ];
      priceLine.setData(lineData);
    }
  };

  const addTPSLLines = (chart: IChartApi, data: any, currentTime: number) => {
    const pendingOrder = data.pending_orders?.primary_order || data.trade_parameters?.primary_validated_order?.original_order || {};
    const takeProfit = pendingOrder.take_profit;
    const stopLoss = pendingOrder.stop_loss;

    if (takeProfit) {
      const tpLine = chart.addSeries(LineSeries, {
        color: colors.green,
        lineWidth: 1.5,
        lineStyle: LineStyle.Dashed,
        priceLineVisible: false,
        lastValueVisible: false,
        priceFormat: { type: "price", precision: 2 },
      });
      const lineData: LineData[] = [
        { time: currentTime - 86400, value: takeProfit },
        { time: currentTime, value: takeProfit },
      ];
      tpLine.setData(lineData);
    }

    if (stopLoss) {
      const slLine = chart.addSeries(LineSeries, {
        color: colors.red,
        lineWidth: 1.5,
        lineStyle: LineStyle.Dashed,
        priceLineVisible: false,
        lastValueVisible: false,
        priceFormat: { type: "price", precision: 2 },
      });
      const lineData: LineData[] = [
        { time: currentTime - 86400, value: stopLoss },
        { time: currentTime, value: stopLoss },
      ];
      slLine.setData(lineData);
    }
  };

  const addForecastBox = (chart: IChartApi, data: any, currentTime: number) => {
    const pivot = data.pivot || {};
    const pendingOrder = data.pending_orders?.primary_order || {};
    const takeProfit = pendingOrder.take_profit;
    const pivotLevel = pivot.level;
    const isShort = data.prediction?.direction === "DOWN";

    if (takeProfit && pivotLevel) {
      const futureTime = currentTime + 86400; // 24 hours ahead

      if (isShort) {
        const topLine = chart.addSeries(LineSeries, {
          color: colors.green,
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          priceLineVisible: false,
          lastValueVisible: false,
          priceFormat: { type: "price", precision: 2 },
          crosshairMarkerVisible: false,
        });
        topLine.setData([
          { time: currentTime, value: pivotLevel },
          { time: futureTime, value: pivotLevel },
        ]);

        const bottomLine = chart.addSeries(LineSeries, {
          color: colors.green,
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          priceLineVisible: false,
          lastValueVisible: false,
          priceFormat: { type: "price", precision: 2 },
          crosshairMarkerVisible: false,
        });
        bottomLine.setData([
          { time: currentTime, value: takeProfit },
          { time: futureTime, value: takeProfit },
        ]);
      } else {
        const topLine = chart.addSeries(LineSeries, {
          color: colors.green,
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          priceLineVisible: false,
          lastValueVisible: false,
          priceFormat: { type: "price", precision: 2 },
          crosshairMarkerVisible: false,
        });
        topLine.setData([
          { time: currentTime, value: takeProfit },
          { time: futureTime, value: takeProfit },
        ]);

        const bottomLine = chart.addSeries(LineSeries, {
          color: colors.green,
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          priceLineVisible: false,
          lastValueVisible: false,
          priceFormat: { type: "price", precision: 2 },
          crosshairMarkerVisible: false,
        });
        bottomLine.setData([
          { time: currentTime, value: pivotLevel },
          { time: futureTime, value: pivotLevel },
        ]);
      }
    }
  };

  const getCurrentTime = (): number => {
    return Math.floor(Date.now() / 1000);
  };

  const formatNumber = (num: number) => {
    if (num === undefined || num === null) return "N/A";
    const decimals = num > 100 ? 2 : 5;
    return num.toFixed(decimals);
  };

  if (isLoading) {
    return (
      <div className="chart-loading" style={{ height: `${height}px`, background: "#0a0a15", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#D4AF37" }}>📊 Loading chart...</span>
      </div>
    );
  }

  const prediction = data.prediction || {};
  const pivot = data.pivot || {};
  const pendingOrder = data.pending_orders?.primary_order || {};
  const takeProfit = pendingOrder.take_profit;
  const stopLoss = pendingOrder.stop_loss;
  const pivotLevel = pivot.level;
  const isShort = prediction.direction === "DOWN";
  const confidence = prediction.confidence || 50;

  return (
    <div className="day-trader-chart" style={{ position: "relative" }}>
      <div ref={chartContainerRef} style={{ width: "100%", height: `${height}px`, borderRadius: "16px", overflow: "hidden" }} />
      
      {/* Scenario Cards (English) */}
      <div className="scenario-cards" style={{ display: "flex", gap: "16px", marginTop: "20px", padding: "0 10px" }}>
        {/* Scenario 1 - Preferred (TP) */}
        <div style={{
          flex: 1,
          background: isShort ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
          borderRadius: "20px",
          padding: "16px 20px",
          border: `1.5px solid ${isShort ? "rgba(239,68,68,0.4)" : "rgba(16,185,129,0.4)"}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ background: isShort ? "#EF4444" : "#10B981", width: "12px", height: "12px", borderRadius: "50%", display: "inline-block" }}></span>
              <span style={{ color: isShort ? "#EF4444" : "#10B981", fontSize: "14px", fontWeight: 800 }}>PREFERRED SCENARIO</span>
            </div>
            <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "6px" }}>
              Price moves {isShort ? "BELOW" : "ABOVE"} pivot {formatNumber(pivotLevel)} toward TP
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "8px" }}>
              <span style={{ color: "white", fontSize: "22px", fontWeight: 800 }}>{formatNumber(takeProfit)}</span>
              <span style={{ color: isShort ? "#EF4444" : "#10B981", fontSize: "16px" }}>{isShort ? "▼ DOWN" : "▲ UP"}</span>
            </div>
          </div>
          <div style={{ minWidth: "85px", textAlign: "center" }}>
            <span style={{
              background: isShort ? "rgba(239,68,68,0.25)" : "rgba(16,185,129,0.25)",
              borderRadius: "40px",
              padding: "10px 16px",
              fontSize: "26px",
              fontWeight: 800,
              color: isShort ? "#EF4444" : "#10B981",
              display: "inline-block",
            }}>{confidence}%</span>
          </div>
        </div>

        {/* Scenario 2 - Alternative (SL) */}
        <div style={{
          flex: 1,
          background: isShort ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
          borderRadius: "20px",
          padding: "16px 20px",
          border: `1.5px solid ${isShort ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ background: isShort ? "#10B981" : "#EF4444", width: "12px", height: "12px", borderRadius: "50%", display: "inline-block" }}></span>
              <span style={{ color: isShort ? "#10B981" : "#EF4444", fontSize: "14px", fontWeight: 800 }}>ALTERNATIVE SCENARIO</span>
            </div>
            <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "6px" }}>
              Price rebounds {isShort ? "ABOVE" : "BELOW"} pivot {formatNumber(pivotLevel)} toward SL
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "8px" }}>
              <span style={{ color: "white", fontSize: "22px", fontWeight: 800 }}>{formatNumber(stopLoss)}</span>
              <span style={{ color: isShort ? "#10B981" : "#EF4444", fontSize: "16px" }}>{isShort ? "▲ UP" : "▼ DOWN"}</span>
            </div>
          </div>
          <div style={{ minWidth: "85px", textAlign: "center" }}>
            <span style={{
              background: isShort ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)",
              borderRadius: "40px",
              padding: "10px 16px",
              fontSize: "26px",
              fontWeight: 800,
              color: isShort ? "#10B981" : "#EF4444",
              display: "inline-block",
            }}>{100 - confidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}