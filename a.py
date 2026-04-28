
# daytrader/generate_all_setups.py
import json
import os
import numpy as np
import pandas as pd
import sqlite3
from datetime import datetime, timezone, timedelta
from gather_trade_setup import gather_trade_setup
from data.symbols_config import get_pip_size, SYMBOL_MAP

# === ⚙️ CONFIGURATION ===
SYMBOLS = [
    "EURUSD", "GBPUSD", "USDJPY", "USDCAD", "AUDUSD",
    "NZDUSD", "USDCHF", "XAUUSD", "XAUEUR", "XAGUSD",
    "PLATINUM", "BRENT", "BTCUSD", "ETHUSD", "XRPUSD",
    "DOGEUSD", "LTCUSD", "US500", "USTEC", "US30",
    "HK50", "FRANCE40", "CHINA50", "UK100", "EURJPY",
    "EURGBP", "GBPJPY", "GBPCHF"
]

SETUP_DIR = "data_D1"
RECORD_FILE = "records/D1_trade_records.jsonl"
VALIDATION_REPORT = "records/D1_validation_report.json"
DATABASE_PATH = "market_dataH1.db"

# Symbol decimal configuration (same as Cloudflare worker)
SYMBOL_DECIMALS: dict = {
    "EURUSD": 5, "GBPUSD": 5, "USDJPY": 3, "USDCAD": 5, "AUDUSD": 5,
    "NZDUSD": 5, "USDCHF": 5, "EURJPY": 3, "EURGBP": 5, "GBPJPY": 3,
    "GBPCHF": 5, "XAUUSD": 2, "XAUEUR": 2, "XAGUSD": 3, "PLATINUM": 2,
    "BRENT": 2, "BTCUSD": 1, "ETHUSD": 2, "XRPUSD": 4, "DOGEUSD": 4,
    "LTCUSD": 2, "US500": 2, "USTEC": 2, "US30": 1, "HK50": 2,
    "FRANCE40": 2, "CHINA50": 1, "UK100": 1
}

os.makedirs(SETUP_DIR, exist_ok=True)
os.makedirs(os.path.dirname(RECORD_FILE), exist_ok=True)

def convert_types(obj):
    """Surgical type conversion for JSON serialization."""
    if isinstance(obj, (np.integer,)): return int(obj)
    elif isinstance(obj, (np.floating,)): return float(obj)
    elif isinstance(obj, (np.bool_)): return bool(obj)
    elif isinstance(obj, (pd.Timestamp, datetime)): return obj.isoformat()
    return str(obj) if hasattr(obj, '__dict__') else obj

def get_symbol_decimals(symbol: str) -> int:
    """Get decimal precision for a symbol."""
    return SYMBOL_DECIMALS.get(symbol, 5)

def format_price(price: float, symbol: str) -> float:
    """Format price with correct decimals for the symbol."""
    if price is None:
        return None
    decimals = get_symbol_decimals(symbol)
    return round(price, decimals)

# ✅ H1 VALIDATION THRESHOLDS
MINIMUM_CONFIDENCE = 45
MINIMUM_ACCURACY = 55
MINIMUM_RR_RATIO = 1.2

def validate_trade_setup(setup: dict, symbol: str) -> dict:
    """Institutional validation for H1 Interday Cycles."""
    res = {
        "symbol": symbol, "is_valid": False, "validation_score": 0,
        "issues": [], "warnings": [], "strengths": [],
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    if not setup or "error" in setup:
        res["issues"].append("Analysis engine failure")
        return res
    
    # 1. Accuracy/Confidence Audit
    acc = setup.get("analysis_accuracy", 0)
    conf = setup.get("risk_score", {}).get("confidence_score", 0)
    
    if acc < MINIMUM_ACCURACY: res["warnings"].append(f"Low H1 Accuracy: {acc:.1f}%")
    if conf < MINIMUM_CONFIDENCE: res["warnings"].append(f"Low H1 Confidence: {conf}%")
    
    # 2. Execution Audit
    pending = setup.get("pending_orders", {})
    if pending.get("is_valid"):
        primary = pending.get("primary_order", {})
        rr = primary.get("rr_ratio", 0)
        
        if rr < MINIMUM_RR_RATIO: res["warnings"].append(f"Inefficient RR: {rr:.1f}")
        else: res["strengths"].append(f"Institutional RR: {rr:.1f}")
            
        pip_size = get_pip_size(symbol)
        dist = abs(primary.get("entry_price", 0) - pending.get("current_price", 0)) / pip_size
        
        limit = 10000 if pip_size >= 1.0 else 1000 if pip_size >= 0.01 else 500
        if dist > limit: res["warnings"].append(f"Extreme Entry Distance: {dist:.0f} pips")
    else:
        res["issues"].append("No valid H1 structural orders")
    
    # 3. Final Scoring
    score = (min(acc / 100, 1.0) * 35) + (min(conf / 100, 1.0) * 30) + (35 if pending.get("is_valid") else 0)
    
    res["validation_score"] = round(score)
    res["is_valid"] = score >= 65
    res["component_quality"] = setup.get("component_scores", {})
    return res

def create_h1_trade_record(setup: dict, symbol: str, validation: dict) -> dict:
    """Standardized record for H1 audit trail."""
    primary = setup.get("pending_orders", {}).get("primary_order")
    
    if primary is None:
        primary = {}
    
    return {
        "symbol": symbol,
        "style": "H1_DAY_TRADE",
        "order_type": primary.get("type", "NO_ORDER"),
        "entry": primary.get("entry_price", 0.0),
        "tp": primary.get("tp_price", 0.0),
        "sl": primary.get("sl_price", 0.0),
        "confidence": setup.get("risk_score", {}).get("confidence_score", 0),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "valid": validation["is_valid"],
        "score": validation["validation_score"]
    }

def fetch_historical_candles(symbol: str, lookback_hours: int = 120) -> list:
    """Fetch historical H1 candles for chart rendering (increased for weekly pivot)."""
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cutoff = (datetime.now(timezone.utc) - timedelta(hours=lookback_hours)).isoformat()
        
        query = """
            SELECT time, open, high, low, close, tick_volume 
            FROM candles_h1 
            WHERE symbol = ? AND time >= ? 
            ORDER BY time ASC
        """
        
        df = pd.read_sql(query, conn, params=(symbol, cutoff), parse_dates=["time"])
        conn.close()
        
        if df.empty:
            return []
        
        decimals = get_symbol_decimals(symbol)
        candles = []
        for _, row in df.iterrows():
            candles.append({
                "time": row['time'].isoformat(),
                "timestamp": int(row['time'].timestamp()),
                "open": round(float(row['open']), decimals),
                "high": round(float(row['high']), decimals),
                "low": round(float(row['low']), decimals),
                "close": round(float(row['close']), decimals),
                "volume": float(row['tick_volume']) if 'tick_volume' in row else 0
            })
        
        return candles
    except Exception as e:
        print(f"⚠️ Could not fetch candles for {symbol}: {e}")
        return []

def predict_h1_trend(setup: dict, symbol: str) -> dict:
    """Predict future trend direction for next 1-4 hours."""
    trend_data = setup.get("trend", {})
    momentum_data = setup.get("momentum", {})
    risk_score = setup.get("risk_score", {})
    final_decision = setup.get("final_decision", "NEUTRAL")
    
    trend_strength = trend_data.get("trend_strength_score", 50)
    rsi_value = momentum_data.get("rsi_latest", 50)
    confidence = risk_score.get("confidence_score", 50)
    decimals = get_symbol_decimals(symbol)
    
    if final_decision == "BUY":
        base_direction = "UP"
        probability = confidence
    elif final_decision == "SELL":
        base_direction = "DOWN"
        probability = confidence
    else:
        base_direction = "SIDEWAYS"
        probability = 50
    
    if base_direction == "UP":
        if rsi_value < 30:
            probability += 10
        elif rsi_value > 70:
            probability -= 15
    elif base_direction == "DOWN":
        if rsi_value > 70:
            probability += 10
        elif rsi_value < 30:
            probability -= 15
    
    if trend_strength > 70:
        probability += 10
    elif trend_strength < 30:
        probability -= 10
    
    probability = max(10, min(95, probability))
    
    current_price = setup.get("pending_orders", {}).get("current_price", 0)
    atr = setup.get("volatility", {}).get("current_atr", current_price * 0.002)
    
    if base_direction == "UP":
        target_1h = current_price + (atr * 0.5)
        target_2h = current_price + (atr * 0.8)
        target_4h = current_price + (atr * 1.2)
        stop_level = current_price - (atr * 0.8)
    elif base_direction == "DOWN":
        target_1h = current_price - (atr * 0.5)
        target_2h = current_price - (atr * 0.8)
        target_4h = current_price - (atr * 1.2)
        stop_level = current_price + (atr * 0.8)
    else:
        target_1h = current_price
        target_2h = current_price
        target_4h = current_price
        stop_level = current_price
    
    return {
        "direction": base_direction,
        "confidence": round(probability),
        "probability": f"{probability}%",
        "timeframe_hours": 4,
        "targets": {
            "1h": round(target_1h, decimals),
            "2h": round(target_2h, decimals),
            "4h": round(target_4h, decimals)
        },
        "stop_loss": round(stop_level, decimals),
        "risk_reward": setup.get("tp_sl", {}).get("rr_ratio", 1.5),
        "key_levels": {
            "support": setup.get("zones", {}).get("support_zone"),
            "resistance": setup.get("zones", {}).get("resistance_zone")
        }
    }

def generate_chart_annotations(setup: dict, symbol: str) -> dict:
    """Generate visual annotations for chart rendering."""
    final_decision = setup.get("final_decision", "NEUTRAL")
    confidence = setup.get("risk_score", {}).get("confidence_score", 50)
    rr_ratio = setup.get("tp_sl", {}).get("rr_ratio", 1.5)
    
    if confidence >= 80:
        style = "STRONG_SIGNAL"
        color = "#00FF00"
    elif confidence >= 60:
        style = "CONFIRMED_SIGNAL"
        color = "#FFFF00"
    else:
        style = "WEAK_SIGNAL"
        color = "#FFA500"
    
    if final_decision == "BUY":
        arrow = "↑"
        arrow_color = "#00FF00"
        action_text = "LONG"
    elif final_decision == "SELL":
        arrow = "↓"
        arrow_color = "#FF0000"
        action_text = "SHORT"
    else:
        arrow = "→"
        arrow_color = "#FFFFFF"
        action_text = "WAIT"
    
    return {
        "title": f"{symbol} - H1 Day Trade Setup",
        "action": action_text,
        "arrow": arrow,
        "arrow_color": arrow_color,
        "signal_style": style,
        "signal_color": color,
        "confidence": f"{confidence}%",
        "rr_ratio": f"{rr_ratio}:1",
        "notes": [
            f"Trend: {setup.get('trend', {}).get('trend', 'NEUTRAL')}",
            f"Momentum: {setup.get('momentum', {}).get('momentum_bias', 'NEUTRAL')}",
            f"Volume POC: {setup.get('volume', {}).get('position_vs_poc', 'unknown')}",
            f"Session: {setup.get('sessions', {}).get('session_name', 'Unknown')}"
        ]
    }

def generate_chart_data(setup: dict, symbol: str) -> dict:
    """Generate chart-ready data for Cloudflare image rendering."""
    current_price = setup.get("pending_orders", {}).get("current_price", 0)
    primary_order = setup.get("pending_orders", {}).get("primary_order")
    
    if primary_order is None:
        primary_order = {}
    
    trend_data = setup.get("trend", {})
    momentum_data = setup.get("momentum", {})
    zones_data = setup.get("zones", {})
    
    return {
        "current_price": current_price,
        "timestamp": setup.get("generated_at"),
        "timeframe": "H1",
        "indicators": {
            "ema_20": trend_data.get("current_emas", {}).get("ema_20"),
            "ema_50": trend_data.get("current_emas", {}).get("ema_50"),
            "ema_200": trend_data.get("current_emas", {}).get("ema_200"),
            "rsi": momentum_data.get("rsi_latest"),
            "atr": setup.get("volatility", {}).get("current_atr")
        },
        "zones": {
            "support": zones_data.get("support_zone"),
            "resistance": zones_data.get("resistance_zone"),
            "poc": setup.get("volume", {}).get("poc_price"),
            "value_area_high": setup.get("volume", {}).get("value_area_high"),
            "value_area_low": setup.get("volume", {}).get("value_area_low")
        },
        "pending_order": {
            "type": primary_order.get("type") if primary_order else None,
            "entry": primary_order.get("entry_price") if primary_order else None,
            "stop_loss": primary_order.get("sl_price") if primary_order else None,
            "take_profit": primary_order.get("tp_price") if primary_order else None,
            "rr_ratio": primary_order.get("rr_ratio") if primary_order else None
        }
    }

def calculate_pivot_levels(candles: list, symbol: str, current_price: float = None) -> dict:
    """
    Calculate pivot point and support/resistance levels from H1 candles.
    - Monday (early session): Uses WEEKLY pivot (last 5 days)
    - Tuesday-Friday: Uses DAILY pivot (previous 24 hours)
    
    Args:
        candles: List of candle dictionaries with 'time', 'high', 'low', 'close'
        symbol: Trading symbol (for decimal precision)
        current_price: Current price (for fallback)
    
    Returns:
        dict with pivot levels and metadata
    """
    decimals = get_symbol_decimals(symbol)
    
    if not candles or len(candles) < 6:
        return {
            "level": None,
            "support_1": None,
            "support_2": None,
            "resistance_1": None,
            "resistance_2": None,
            "previous_high": None,
            "previous_low": None,
            "previous_close": None,
            "pivot_type": "none",
            "is_weekly": False
        }
    
    # Get current UTC time
    now = datetime.now(timezone.utc)
    current_day = now.weekday()  # 0 = Monday, 4 = Friday, 5 = Saturday, 6 = Sunday
    
    # Count today's candles
    today_start = datetime(now.year, now.month, now.day, 0, 0, 0, tzinfo=timezone.utc)
    today_candles = []
    for c in candles:
        try:
            candle_time = datetime.fromisoformat(c['time'].replace('Z', '+00:00'))
            if candle_time >= today_start:
                today_candles.append(c)
        except:
            pass
    today_count = len(today_candles)
    
    # Determine if we should use WEEKLY pivot (Monday with less than 6 hours of data)
    is_early_monday = (current_day == 0 and today_count < 6)
    
    if is_early_monday and len(candles) >= 48:
        # ============================================================
        # WEEKLY PIVOT for Monday opening
        # ============================================================
        # Get last week's candles (approximately 5 days = 120 candles)
        week_candles = candles[-120:] if len(candles) > 120 else candles
        
        weekly_high = max(c['high'] for c in week_candles)
        weekly_low = min(c['low'] for c in week_candles)
        weekly_close = week_candles[-1]['close'] if week_candles else (current_price or 0)
        
        pivot = (weekly_high + weekly_low + weekly_close) / 3
        support_1 = (2 * pivot) - weekly_high
        support_2 = pivot - (weekly_high - weekly_low)
        resistance_1 = (2 * pivot) - weekly_low
        resistance_2 = pivot + (weekly_high - weekly_low)
        
        return {
            "level": round(pivot, decimals),
            "support_1": round(support_1, decimals),
            "support_2": round(support_2, decimals),
            "resistance_1": round(resistance_1, decimals),
            "resistance_2": round(resistance_2, decimals),
            "previous_high": round(weekly_high, decimals),
            "previous_low": round(weekly_low, decimals),
            "previous_close": round(weekly_close, decimals),
            "pivot_type": "weekly",
            "is_weekly": True
        }
    else:
        # ============================================================
        # DAILY PIVOT for normal days (Tuesday-Friday)
        # ============================================================
        if len(candles) < 24:
            prev_day_candles = candles
        else:
            prev_day_candles = candles[-24:]
        
        prev_high = max(c['high'] for c in prev_day_candles)
        prev_low = min(c['low'] for c in prev_day_candles)
        prev_close = prev_day_candles[-1]['close']
        
        pivot = (prev_high + prev_low + prev_close) / 3
        support_1 = (2 * pivot) - prev_high
        support_2 = pivot - (prev_high - prev_low)
        resistance_1 = (2 * pivot) - prev_low
        resistance_2 = pivot + (prev_high - prev_low)
        
        return {
            "level": round(pivot, decimals),
            "support_1": round(support_1, decimals),
            "support_2": round(support_2, decimals),
            "resistance_1": round(resistance_1, decimals),
            "resistance_2": round(resistance_2, decimals),
            "previous_high": round(prev_high, decimals),
            "previous_low": round(prev_low, decimals),
            "previous_close": round(prev_close, decimals),
            "pivot_type": "daily",
            "is_weekly": False
        }

def add_candle_data_to_json(setup: dict, symbol: str) -> dict:
    """Add complete candle data structure to JSON for Cloudflare chart rendering."""
    candles = fetch_historical_candles(symbol, lookback_hours=120)  # Increased for weekly pivot
    
    if not candles:
        setup["candles"] = {"data": [], "count": 0, "timeframe": "H1", "interval_minutes": 60}
        setup["pivot"] = {"level": None, "support_1": None, "support_2": None, "resistance_1": None, "resistance_2": None}
        return setup
    
    decimals = get_symbol_decimals(symbol)
    current_price = setup.get("pending_orders", {}).get("current_price", 0)
    
    # Calculate pivot levels - PASS current_price for Monday fallback
    pivot_data = calculate_pivot_levels(candles, symbol, current_price)
    setup["pivot"] = pivot_data
    
    # Calculate chart bounds with dynamic padding
    all_prices = []
    for c in candles:
        all_prices.extend([c['high'], c['low']])
    
    all_prices.append(current_price)
    
    # Add key levels
    zones = setup.get("zones", {})
    if zones.get("support_zone"):
        all_prices.append(zones["support_zone"])
    if zones.get("resistance_zone"):
        all_prices.append(zones["resistance_zone"])
    
    pending = setup.get("pending_orders", {}).get("primary_order", {})
    if pending and pending.get("entry_price"):
        all_prices.append(pending["entry_price"])
    if pending and pending.get("sl_price"):
        all_prices.append(pending["sl_price"])
    if pending and pending.get("tp_price"):
        all_prices.append(pending["tp_price"])
    
    # Add prediction targets
    prediction = setup.get("prediction", {})
    for target in prediction.get("targets", {}).values():
        all_prices.append(target)
    if prediction.get("stop_loss"):
        all_prices.append(prediction["stop_loss"])
    
    # Add pivot levels to price range for chart scaling
    if pivot_data.get("level"):
        all_prices.append(pivot_data["level"])
    if pivot_data.get("resistance_1"):
        all_prices.append(pivot_data["resistance_1"])
    if pivot_data.get("support_1"):
        all_prices.append(pivot_data["support_1"])
    
    # Dynamic padding based on price range
    min_raw = min(all_prices)
    max_raw = max(all_prices)
    price_range_raw = max_raw - min_raw
    
    if price_range_raw > 0:
        padding = price_range_raw * 0.05
        min_price = min_raw - padding
        max_price = max_raw + padding
    else:
        padding = min_raw * 0.005
        min_price = min_raw - padding
        max_price = max_raw + padding
    
    # Safety cap: Prevent extreme zoom out (> 4x original range)
    new_range = max_price - min_price
    if new_range > price_range_raw * 4 and price_range_raw > 0:
        padding = price_range_raw * 0.02
        min_price = min_raw - padding
        max_price = max_raw + padding
    
    setup["candles"] = {
        "data": candles,
        "count": len(candles),
        "timeframe": "H1",
        "interval_minutes": 60,
        "range": {
            "min": round(min_price, decimals),
            "max": round(max_price, decimals),
            "high_24h": setup.get("trend", {}).get("high_24h"),
            "low_24h": setup.get("trend", {}).get("low_24h")
        },
        "latest": candles[-1] if candles else None,
        "current_price": current_price
    }
    
    return setup

def main():
    print("🚀 GENERATING INSTITUTIONAL H1 DAY-TRADE SETUPS...")
    print(f"📊 H1 Thresholds: Acc≥{MINIMUM_ACCURACY}%, Conf≥{MINIMUM_CONFIDENCE}%, RR≥{MINIMUM_RR_RATIO}")
    print("=" * 60)
    
    stats = {"high": 0, "medium": 0, "low": 0, "failed": 0, "total": 0}
    start_time = datetime.now()

    for symbol in SYMBOLS:
        print(f"🔍 Analyzing H1 {symbol}...")
        try:
            setup = gather_trade_setup(symbol)
            if "error" in setup:
                print(f"   ❌ Error: {setup.get('error')}")
                stats["failed"] += 1
                stats["total"] += 1
                continue

            validation = validate_trade_setup(setup, symbol)
            score = validation["validation_score"]
            
            if score >= 80: 
                q_label = "🏆 INSTITUTIONAL QUALITY"
                stats["high"] += 1
            elif score >= 65: 
                q_label = "✅ HIGH PROBABILITY"
                stats["medium"] += 1
            else: 
                q_label = "⚠️ SPECULATIVE"
                stats["low"] += 1
            
            stats["total"] += 1
            setup["validation"] = validation
            setup["quality_indicator"] = q_label
            
            # Add prediction and chart data
            setup["prediction"] = predict_h1_trend(setup, symbol)
            setup["annotations"] = generate_chart_annotations(setup, symbol)
            setup["chart"] = generate_chart_data(setup, symbol)
            setup = add_candle_data_to_json(setup, symbol)
            
            # Save Local JSON only
            filename = f"D1_output_{symbol}.json"
            json_path = f"{SETUP_DIR}/{filename}"
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump(setup, f, indent=2, default=convert_types)

            # Update Audit Trail
            with open(RECORD_FILE, "a", encoding="utf-8") as f:
                json.dump(create_h1_trade_record(setup, symbol, validation), f, default=convert_types)
                f.write("\n")

            print(f"   🎯 {q_label} (Score: {score}) | Prediction: {setup['prediction']['direction']} {setup['prediction']['confidence']}% | Candles: {setup['candles']['count']}")
            
        except Exception as e:
            print(f"💥 H1 Processor Crash for {symbol}: {e}")
            import traceback
            traceback.print_exc()
            stats["failed"] += 1
            stats["total"] += 1

    duration = (datetime.now() - start_time).total_seconds()
    print("\n" + "="*60)
    print("📊 H1 GENERATION SUMMARY")
    print("="*60)
    print(f"🏆 Institutional: {stats['high']} | ✅ High Prob: {stats['medium']} | ⚠️ Speculative: {stats['low']}")
    print(f"❌ Failed: {stats['failed']} | Total: {stats['total']} | Time: {duration:.1f}s")
    print("="*60)
    
    # Save validation report
    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "stats": stats,
        "thresholds": {
            "min_confidence": MINIMUM_CONFIDENCE,
            "min_accuracy": MINIMUM_ACCURACY,
            "min_rr": MINIMUM_RR_RATIO
        }
    }
    with open(VALIDATION_REPORT, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, default=convert_types)
    
    print(f"\n✅ JSON files saved to: {SETUP_DIR}/")
    print(f"✅ Validation report saved: {VALIDATION_REPORT}")

if __name__ == "__main__":
    main()