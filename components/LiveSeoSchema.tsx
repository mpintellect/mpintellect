import { SymbolData } from '@/app/lib/fetchData';

interface Props {
  data: SymbolData;
}

export default function LiveSeoSchema({ data }: Props) {
  if (!data) return null;

  const symbolClean = data.symbol.replace('/', '').toUpperCase(); // BTCUSD
  const symbolReadable = data.symbol.replace('USD', '/USD'); // BTC/USD
  const timeNow = new Date().toISOString();
  
  // Use generated_at from backend, fallback to now to ensure "Freshness" in Google's eyes
  const publishTime = data.generated_at || timeNow;

  // --- 1. DYNAMIC JOURNALIST HEADLINE ENGINE ---
  let headline = `Technical Analysis for ${symbolReadable}`;
  let storySummary = `AI market analysis for ${symbolReadable}.`;

  const price = data.trend?.current_price;
  const decision = data.final_decision;
  
  // Generate different hooks based on the AI's mood
  if (decision === 'BUY') {
    headline = `${symbolReadable} Breakout Alert: AI Signals BUY at ${price}. Target $${data.zones?.resistance_zone}`;
    storySummary = `Strong Buying momentum detected for ${symbolReadable}. Algorithm confirms bullish trend reversal at ${price} with ${data.risk_score?.confidence_score}% confidence.`;
  } else if (decision === 'SELL') {
    headline = `${symbolReadable} Plunging? AI Signals SELL at ${price}. Key Support: ${data.zones?.support_zone}`;
    storySummary = `Bearish continuation detected on ${symbolReadable}. Smart money is exiting at ${price}. Protection stop-loss recommended.`;
  } else {
    headline = `${symbolReadable} Consolidation Update: Critical Volatility Warning at ${price}`;
    storySummary = `Volatility squeeze detected on ${symbolReadable}. AI suggests holding while price oscillates between ${data.zones?.support_zone} and ${data.zones?.resistance_zone}.`;
  }

  // --- 2. THE MULTI-LAYER SCHEMA (The "Beast") ---
  const graphData = {
    "@context": "https://schema.org",
    "@graph": [
      // LAYER A: The Breaking News Article
      {
        "@type": "NewsArticle",
        "headline": headline,
        "datePublished": publishTime,
        "dateModified": timeNow, // Forces Google to re-crawl constantly
        "author": {
          "@type": "Organization",
          "name": "MZ Primer AI",
          "url": "https://mzprimer.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "MZ Primer",
          "logo": {
            "@type": "ImageObject",
            "url": "https://mzprimer.com/logos/mzlogo.webp"
          }
        },
        "description": storySummary,
        // The visual that shows in Google News
        "image": [
           // Replace this if you have the Dynamic OG Image URL from the previous tips
           `https://mzprimer.com/api/og?sym=${symbolClean}&sig=${decision}`
        ],
        // Tells Google Assistant what to read aloud
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["h1", "p.summary"]
        }
      },

      // LAYER B: The Financial Product (Connects to Google Finance Graph)
      {
        "@type": "FinancialProduct",
        "name": symbolReadable,
        "tickerSymbol": symbolClean,
        "description": `Real-time AI Forecast for ${symbolReadable}`,
        "exchangeOid": "FOREX" // Or NASDAQ, CRYPTO, etc. generic helps here
      },

      // LAYER C: The FAQ (Hijacks "People Also Ask")
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `Is ${symbolReadable} a Buy or Sell today?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `According to MZ Primer AI analysis on ${new Date().toLocaleDateString()}, ${symbolReadable} is currently a <strong style="color:${decision==='BUY'?'green': decision==='SELL'?'red':'orange'}">${decision}</strong>. The entry zone is monitored around ${price}.`
            }
          },
          {
            "@type": "Question",
            "name": `What is the price target for ${symbolReadable}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Current resistance (profit target) is set at ${data.zones?.resistance_zone}. Support is held at ${data.zones?.support_zone}.`
            }
          },
          {
            "@type": "Question",
            "name": `What is the current trend for ${symbolReadable}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The current market trend is ${data.trend?.trend?.replace(/_/g, ' ').toUpperCase()}. Volatility is classified as ${data.volatility?.volatility_level}.`
            }
          }
        ]
      }
    ]
  };

  return (
    <>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphData) }}
      />
    </>
  );
}