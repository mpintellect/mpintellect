import MetaTrader5 as mt5
import pandas as pd
import sqlite3
import os
from datetime import datetime, timezone
from ta.volatility import AverageTrueRange
from ta.trend import EMAIndicator
from ta.momentum import RSIIndicator

# === CONFIG ===
SYMBOLS = [
    "EURUSD", "GBPUSD", "USDJPY", "USDCAD", "AUDUSD", "NZDUSD", "USDCHF",
    "XAUUSD", "XAUEUR", "XAGUSD", "PLATINUM", "BRENT",
    "BTCUSD", "ETHUSD", "XRPUSD", "DOGEUSD", "LTCUSD",
    "US500", "USTEC", "US30", "HK50", "FRANCE40", "CHINA50", "UK100",
    "EURJPY", "EURGBP", "GBPJPY", "GBPCHF"
]

TIMEFRAME = mt5.TIMEFRAME_M5
KEEP_ROWS = 1440  # 5 days of M5 candles for Volume POC/Macro Analysis

DATABASE_PATH = "market_data.db"

# === LOGGING ===
LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)
def get_log_path():
    today = datetime.now().strftime("%Y-%m-%d")
    return os.path.join(LOG_DIR, f"fetch_{today}.txt")

# === INSTITUTIONAL MTF BIAS HELPER ===
def get_timeframe_bias(symbol, timeframe):
    """Calculates directional bias (bullish/bearish) for higher timeframes."""
    rates = mt5.copy_rates_from_pos(symbol, timeframe, 0, 60)
    if rates is None or len(rates) < 50:
        return "neutral"
    
    df_tf = pd.DataFrame(rates)
    ema50 = EMAIndicator(df_tf['close'], window=50).ema_indicator().iloc[-1]
    current_close = df_tf['close'].iloc[-1]
    
    return "bullish" if current_close > ema50 else "bearish"

# === MT5 Init ===
if not mt5.initialize():
    print("❌ MT5 initialization failed:", mt5.last_error())
    exit()

# === DB Init with Full Institutional Schema ===
conn = sqlite3.connect(DATABASE_PATH)
cursor = conn.cursor()

# ✅ FIX: Add all missing columns if they don't exist
cursor.execute("""
CREATE TABLE IF NOT EXISTS candles (
    symbol TEXT,
    time TEXT,
    open REAL, high REAL, low REAL, close REAL,
    tick_volume REAL,
    spread REAL,
    ema_8 REAL, ema_21 REAL, ema_50 REAL, ema_200 REAL,
    atr REAL, rsi REAL,
    h4_bias TEXT, d1_bias TEXT,
    PRIMARY KEY (symbol, time)
)
""")

# Add any missing columns (safe for existing databases)
columns_to_add = [
    "ema_8", "ema_21", "ema_50", "ema_200",
    "atr", "rsi", "h4_bias", "d1_bias"
]

for col in columns_to_add:
    try:
        cursor.execute(f"ALTER TABLE candles ADD COLUMN {col} {'REAL' if 'bias' not in col else 'TEXT'}")
        print(f"✅ Added missing column: {col}")
    except sqlite3.OperationalError:
        pass  # Column already exists

conn.commit()

# === MAIN LOOP ===
print(f"📥 Syncing Institutional Market Data (Buffer: {KEEP_ROWS} rows)...\n")

for symbol in SYMBOLS:
    print(f"🔄 Updating {symbol}...")

    try:
        # 1. Fetch enough history for the Institutional EMA 200
        rates = mt5.copy_rates_from_pos(symbol, TIMEFRAME, 0, 210)
        if rates is None or len(rates) < 200:
            print(f"⚠️ Not enough history for {symbol}")
            continue

        df = pd.DataFrame(rates)
        df['time'] = pd.to_datetime(df['time'], unit='s', utc=True)

        # 2. Calculate Institutional Indicator Stack
        df['ema_8'] = EMAIndicator(df['close'], window=8).ema_indicator()
        df['ema_21'] = EMAIndicator(df['close'], window=21).ema_indicator()
        df['ema_50'] = EMAIndicator(df['close'], window=50).ema_indicator()
        df['ema_200'] = EMAIndicator(df['close'], window=200).ema_indicator()
        df['atr'] = AverageTrueRange(df['high'], df['low'], df['close'], window=14).average_true_range()
        df['rsi'] = RSIIndicator(df['close'], window=14).rsi()

        # 3. Fetch Macro Authorization (MTF Bias)
        h4_bias = get_timeframe_bias(symbol, mt5.TIMEFRAME_H4)
        d1_bias = get_timeframe_bias(symbol, mt5.TIMEFRAME_D1)

        # 4. Prepare Latest Candle
        row = df.iloc[-1]
        tick = mt5.symbol_info_tick(symbol)
        spread = tick.ask - tick.bid if tick else 0.0

        # 5. Commit to Database
        cursor.execute("""
            INSERT OR REPLACE INTO candles (
                symbol, time, open, high, low, close,
                tick_volume, spread, ema_8, ema_21, ema_50, ema_200,
                atr, rsi, h4_bias, d1_bias
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            symbol, row['time'].isoformat(),
            row['open'], row['high'], row['low'], row['close'],
            row['tick_volume'], spread,
            row['ema_8'], row['ema_21'], row['ema_50'], row['ema_200'],
            row['atr'], row['rsi'],
            h4_bias, d1_bias
        ))

        # 6. Maintenance: Keep 5 Days of Data
        cursor.execute(f"""
            DELETE FROM candles WHERE symbol = ? AND time NOT IN (
                SELECT time FROM candles WHERE symbol = ? ORDER BY time DESC LIMIT {KEEP_ROWS}
            )
        """, (symbol, symbol))

        conn.commit()

        log_msg = f"{datetime.now(timezone.utc).isoformat()} ✅ {symbol}: MTF Synchronized (H4:{h4_bias}, D1:{d1_bias})"
        print(log_msg)
        with open(get_log_path(), "a", encoding="utf-8") as f:
            f.write(log_msg + "\n")

    except Exception as e:
        error_msg = f"{datetime.now(timezone.utc).isoformat()} ❌ Error {symbol}: {str(e)}"
        print(error_msg)
        with open(get_log_path(), "a", encoding="utf-8") as f:
            f.write(error_msg + "\n")

conn.close()
mt5.shutdown()
print(f"\n🏛️ MZ Intelligence Engine: Data Sync Complete.")