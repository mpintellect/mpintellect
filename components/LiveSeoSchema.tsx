import { SymbolData } from '@/app/lib/fetchData';

interface Props {
  data: SymbolData;
}

// Predefine logo URLs for better caching
const LOGO_URLS = {
  webp: 'https://mpintellect.com/logos/mzlogo.webp',
  png: 'https://mpintellect.com/logos/icon-512.webp',
  og: (symbol: string, decision: string) => 
    `https://mpintellect.com/api/og?sym=${symbol}&sig=${decision}`
} as const;

export default function LiveSeoSchema({ data }: Props) {
  if (!data) return null;

  const symbolClean = data.symbol.replace('/', '').toUpperCase();
  const symbolReadable = data.symbol.replace('USD', '/USD');
  const timeNow = new Date().toISOString();
  const publishTime = data.generated_at || timeNow;
  const decision = data.final_decision;

  // Use const for static values to prevent re-renders
  const AUTHOR_NAME = "MPIntellect Intelligence ";
  const SITE_URL = "https://mpintellect.com";

  // --- 1. DYNAMIC HEADLINE ENGINE ---
  const { headline, storySummary } = (() => {
    const price = data.trend?.current_price;
    
    if (decision === 'BUY') {
      return {
        headline: `${symbolReadable} Breakout Alert: AI Signals BUY at ${price}. Target $${data.zones?.resistance_zone}`,
        storySummary: `Strong Buying momentum detected for ${symbolReadable}. Algorithm confirms bullish trend reversal at ${price} with ${data.risk_score?.confidence_score}% confidence.`
      };
    } else if (decision === 'SELL') {
      return {
        headline: `${symbolReadable} Plunging? AI Signals SELL at ${price}. Key Support: ${data.zones?.support_zone}`,
        storySummary: `Bearish continuation detected on ${symbolReadable}. Smart money is exiting at ${price}. Protection stop-loss recommended.`
      };
    } else {
      return {
        headline: `${symbolReadable} Consolidation Update: Critical Volatility Warning at ${price}`,
        storySummary: `Volatility squeeze detected on ${symbolReadable}. AI suggests holding while price oscillates between ${data.zones?.support_zone} and ${data.zones?.resistance_zone}.`
      };
    }
  })();

  // --- 2. OPTIMIZED SCHEMA ---
  const graphData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "headline": headline,
        "datePublished": publishTime,
        "dateModified": timeNow,
        "author": {
          "@type": "Organization",
          "name": AUTHOR_NAME,
          "url": SITE_URL
        },
        "publisher": {
          "@type": "Organization",
          "name": "MPIntellect Intelligence",
          "logo": {
            "@type": "ImageObject",
            "url": LOGO_URLS.png, // Use PNG for maximum compatibility
            "width": 512,
            "height": 512,
            "caption": "MPIntellect Logo"
          }
        },
        "description": storySummary,
        "image": [
          LOGO_URLS.og(symbolClean, decision),
          LOGO_URLS.webp // Fallback image
        ],
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${SITE_URL}/trade/${data.symbol}`
        },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": [".headline", ".summary"]
        }
      },
      {
        "@type": "FinancialProduct",
        "name": symbolReadable,
        "tickerSymbol": symbolClean,
        "description": `Real-time AI Forecast for ${symbolReadable}`,
        "provider": {
          "@type": "Organization",
          "name": "MPIntellect Intelligence",
          "url": SITE_URL,
          "logo": LOGO_URLS.png
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `Is ${symbolReadable} a Buy or Sell today?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `According to MPIntellect AI analysis on ${new Date().toLocaleDateString()}, ${symbolReadable} is currently a <strong style="color:${decision === 'BUY' ? 'green' : decision === 'SELL' ? 'red' : 'orange'}">${decision}</strong>. The entry zone is monitored around ${data.trend?.current_price}.`
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(graphData, null, 2) // Pretty print for debugging
      }}
      key={`schema-${symbolClean}-${Date.now()}`} // Unique key for caching
    />
  );
}