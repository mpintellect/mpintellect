// backend-lib/telegram-post.ts
// Shared caption/button-building logic for the Telegram signal post, used by
// BOTH the real publish endpoint (functions/api/telegram/publish.ts) and the
// preview-only endpoint (functions/api/telegram/preview.ts). Extracted
// verbatim from publish.ts so the preview can never drift from what
// actually gets posted - there is exactly one implementation of this logic.

/**
 * Pulls the individual values generateCaptionFromData formats into the real
 * caption string. Extracted separately (additive - not used by publish.ts)
 * so app/test's preview page can build alternative caption-style mockups
 * from the same real values instead of re-parsing formatted text.
 */
export function extractSignalFields(data: any, symbol: string) {
  const price = data.trend?.current_price || 0;
  const entry = data.tp_sl?.entry_price || data.pending_orders?.primary_order?.entry_price || 0;
  const tp = data.tp_sl?.tp_level || data.pending_orders?.primary_order?.tp_price || 0;
  const confidence = data.risk_score?.confidence_score || 0;
  const trend = data.trend?.trend || 'neutral';
  const rsi = data.momentum?.rsi_latest || 50;

  const timestamp = data.generated_at || data.trend?.timestamp || new Date().toISOString();
  const date = new Date(timestamp);
  const formattedTime = `${date.getUTCDate().toString().padStart(2, '0')}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCFullYear()} ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')} UTC`;

  const session = data.sessions?.session_name || 'Market Hours';
  const trendIcon = trend.includes('bullish') ? '🟢' : trend.includes('bearish') ? '🔴' : '⚪';
  const trendText = trend.replace(/_/g, ' ').toUpperCase();

  let rsiZone = 'Neutral';
  if (rsi > 70) rsiZone = 'Overbought';
  else if (rsi < 30) rsiZone = 'Oversold';

  // Used by generateCaptionFromData below (the "Enhanced" format, live as of
  // 2026-09-24). All computed by the pipeline already; none of this is
  // inferred/fabricated here. rrRatio deliberately excludes the SL price
  // itself (never shown anywhere in this app, by design).
  const rrRatio = data.tp_sl?.rr_ratio ?? null;
  const recommendation = data.risk_score?.recommendation || null;
  const riskCategory = data.risk_score?.risk_category || null;
  const mtfConfluence = data.mtf?.confluence_score ?? null;
  const mtfAligned = data.mtf?.h4_alignment === 'aligned' && data.mtf?.d1_alignment === 'aligned';

  return {
    symbol, price, entry, tp, confidence, trend, trendIcon, trendText, rsi, rsiZone, formattedTime, session,
    rrRatio, recommendation, riskCategory, mtfConfluence, mtfAligned,
  };
}

function confidenceBar(pct: number): string {
  const filled = Math.max(0, Math.min(10, Math.round((pct / 100) * 10)));
  return '▰'.repeat(filled) + '▱'.repeat(10 - filled);
}

/** "LOW_RISK_HIGH_CONFIDENCE" -> "🟢 Low Risk / High Confidence" */
function formatRiskCategory(cat: string): string {
  const icon = cat.startsWith('LOW_RISK') ? '🟢' : cat.startsWith('MEDIUM') ? '🟡' : cat.startsWith('HIGH_RISK') ? '🔴' : '⚪';
  const text = cat.split('_').map((w) => w[0] + w.slice(1).toLowerCase()).join(' ').replace(/Risk (\w)/, 'Risk / $1');
  return `${icon} ${text}`;
}

/**
 * The old (pre-2026-09-24) caption format - kept only as a reference/rollback
 * point for app/test's "Legacy" comparison tab. Not used by publish.ts.
 */
export function legacyCaptionFromData(data: any, symbol: string): string {
  const { price, entry, tp, confidence, trendIcon, trendText, rsi, rsiZone, formattedTime, session } =
    extractSignalFields(data, symbol);

  return `
🤖 *MPIntellect - AI Analysis*

📅 ${formattedTime}
⏰ Session: ${session}

📊 *${symbol}*
💰 Price: ${price.toLocaleString()}
🎯 Target Zone: *${entry.toLocaleString()}* → *${tp.toLocaleString()}*
📈 Trend: ${trendIcon} *${trendText}*
📉 RSI: ${rsi.toFixed(1)} (${rsiZone})
⚡ Confidence: *${confidence}%*
  `.trim();
}

/**
 * The "Enhanced" format - live as of 2026-09-24. Adds R:R ratio, risk
 * category, multi-timeframe sync and the pipeline's own recommendation on
 * top of the base confidence-bar format, each only when the underlying data
 * has it (older data files / other symbols may not carry every field).
 */
export function generateCaptionFromData(data: any, symbol: string): string {
  const f = extractSignalFields(data, symbol);

  const zoneLine = f.rrRatio
    ? `🎯 Zone  ${f.entry.toLocaleString()} → ${f.tp.toLocaleString()}  (R:R ${f.rrRatio}:1)`
    : `🎯 Zone  ${f.entry.toLocaleString()} → ${f.tp.toLocaleString()}`;

  const lines = [
    `🤖 *MPIntellect AI Signal*`,
    ``,
    `📊 *${f.symbol}*  ${f.trendIcon} *${f.trendText}*`,
    `💰 Price  ${f.price.toLocaleString()}`,
    zoneLine,
    ``,
    `Confidence  ${confidenceBar(f.confidence)} *${f.confidence}%*`,
  ];
  if (f.riskCategory) lines.push(formatRiskCategory(f.riskCategory));
  if (f.mtfConfluence !== null) {
    lines.push(`🔗 Multi-timeframe: ${f.mtfAligned ? 'Aligned' : 'Mixed'} (${f.mtfConfluence}% sync)`);
  }
  lines.push(`RSI ${f.rsi.toFixed(1)} (${f.rsiZone})`);
  if (f.recommendation) {
    lines.push(``, `💡 _${f.recommendation}_`);
  }
  lines.push(``, `📅 ${f.formattedTime} · ${f.session}`, `⚠️ _Educational content, not financial advice._`);

  return lines.join('\n');
}

export function buildSignalButtons(symbol: string) {
  return {
    inline_keyboard: [
      [
        { text: "🔓 Open Account | افتح حسابك", url: `https://my.litefinance.org/registration/?uid=967798214&utm_source=telegram&utm_medium=signal&utm_campaign=${symbol.toLowerCase()}` }
      ],
      [
        { text: "📊 Full Analysis | التحليل الكامل", url: `https://mpintellect.com/start` }
      ]
    ]
  };
}
