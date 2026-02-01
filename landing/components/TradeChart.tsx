"use client";
import React, { useState } from "react";
import { Candle } from "../landing/app/utils/determineTradeSide";

interface TradeChartProps {
  candles: Candle[];
  entry: number;
  sl: number;
  tp: number;
  decision: "BUY" | "SELL";
}

export const TradeChart: React.FC<TradeChartProps> = ({
  candles,
  entry,
  sl,
  tp,
  decision,
}) => {
  const [fullscreen, setFullscreen] = useState(false);

  const width = 320;
  const height = 180;
  const padding = 20;

  const allPrices = candles.flatMap((c) => [c.high, c.low, entry, sl, tp]);
  const maxPrice = Math.max(...allPrices) * 1.002;
  const minPrice = Math.min(...allPrices) * 0.998;
  const priceRange = maxPrice - minPrice;

  const getY = (price: number) =>
    height - ((price - minPrice) / priceRange) * (height - padding * 2) - padding;

  const getX = (i: number) =>
    (i / (candles.length - 1)) * (width - padding * 2) + padding;

  const ChartSVG = () => (
    <svg
      width={fullscreen ? 800 : width}
      height={fullscreen ? 450 : height}
      viewBox={`0 0 ${fullscreen ? 800 : width} ${fullscreen ? 450 : height}`}
      preserveAspectRatio="xMidYMid meet"
      className="bg-[#111] rounded-xl shadow-md cursor-pointer"
      onClick={() => setFullscreen(true)}
    >
      {/* SL Zone (projected forward) */}
      <rect
        x={getX(candles.length - 1)}
        y={getY(Math.max(entry, sl))}
        width={(fullscreen ? 800 : width) - getX(candles.length - 1)}
        height={Math.abs(getY(entry) - getY(sl))}
        fill="rgba(255,0,0,0.1)"
      />
      {/* TP Zone (projected forward) */}
      <rect
        x={getX(candles.length - 1)}
        y={getY(Math.min(entry, tp))}
        width={(fullscreen ? 800 : width) - getX(candles.length - 1)}
        height={Math.abs(getY(entry) - getY(tp))}
        fill="rgba(0,255,0,0.1)"
      />
      {/* Entry Line */}
      <line
        x1={0}
        x2={fullscreen ? 800 : width}
        y1={getY(entry)}
        y2={getY(entry)}
        stroke="white"
        strokeDasharray="4 2"
        strokeWidth={1.5}
      />

      {/* TP and SL lines */}
      <line
        x1={0}
        x2={fullscreen ? 800 : width}
        y1={getY(tp)}
        y2={getY(tp)}
        stroke="yellow"
        strokeDasharray="4 2"
        strokeWidth={1}
      />
      <text
        x={(fullscreen ? 800 : width) - 40}
        y={getY(tp) - 4}
        fill="yellow"
        fontSize="12px"
      >
        +TP
      </text>
      <line
        x1={0}
        x2={fullscreen ? 800 : width}
        y1={getY(sl)}
        y2={getY(sl)}
        stroke="red"
        strokeDasharray="4 2"
        strokeWidth={1}
      />
      <text
        x={(fullscreen ? 800 : width) - 40}
        y={getY(sl) + 12}
        fill="red"
        fontSize="12px"
      >
        -SL
      </text>

      {/* Candlesticks */}
      {candles.map((c, i) => {
        const x = getX(i);
        const wickY1 = getY(c.high);
        const wickY2 = getY(c.low);
        const bodyY = getY(Math.max(c.open, c.close));
        const bodyHeight = Math.abs(getY(c.open) - getY(c.close));
        const isBullish = c.close > c.open;

        return (
          <g key={i}>
            <line
              x1={x}
              y1={wickY1}
              x2={x}
              y2={wickY2}
              stroke="#999"
              strokeWidth={1}
            />
            <rect
              x={x - 2}
              y={bodyY}
              width={4}
              height={bodyHeight || 1}
              fill={isBullish ? "#0f0" : "#f00"}
            />
          </g>
        );
      })}
    </svg>
  );

  return (
    <>
      <div className="w-full max-w-md mx-auto" onClick={() => setFullscreen(true)}>
        <ChartSVG />
      </div>

      {fullscreen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setFullscreen(false)}
        >
          <ChartSVG />
        </div>
      )}
    </>
  );
};