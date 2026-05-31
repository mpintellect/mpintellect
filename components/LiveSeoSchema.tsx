// components/LiveSeoSchema.tsx

import { SymbolData } from '@/app/lib/fetchData';
import { commonTranslations, toolMapping } from '@/app/lib/translations';

interface Props {
  data: SymbolData;
  locale?: 'en' | 'ar';
  tool?: string;
}

// Predefine logo URLs for better caching
const LOGO_URLS = {
  webp: 'https://mpintellect.com/logos/mzlogo.webp',
  png: 'https://mpintellect.com/logos/icon-512.webp',
  og: (symbol: string, decision: string) => 
    `https://mpintellect.com/api/og?sym=${symbol}&sig=${decision}`
} as const;

export default function LiveSeoSchema({ data, locale = 'en', tool = 'analysis' }: Props) {
  if (!data) return null;

  const t = commonTranslations[locale];
  const symbolClean = data.symbol.replace('/', '').toUpperCase();
  const symbolReadable = data.symbol.replace('USD', '/USD');
  const timeNow = new Date().toISOString();
  const publishTime = data.generated_at || timeNow;
  const decision = data.final_decision;

  const AUTHOR_NAME = "MPIntellect";
  const SITE_URL = "https://mpintellect.com";
  const toolUrl = toolMapping[locale][tool as keyof typeof toolMapping.en] || tool;

  // Dynamic headline based on decision
  const price = data.trend?.current_price;
  let headline = `${symbolReadable} Technical Analysis | AI-Powered Insights`;
  let storySummary = `Real-time AI analysis for ${symbolReadable}. Get market structure, trend direction, and key levels.`;

  if (decision === 'BUY') {
    headline = `${symbolReadable} Breakout Alert: AI Signals BUY at ${price}. Target ${data.zones?.resistance_zone}`;
    storySummary = `Strong Buying momentum detected for ${symbolReadable}. Algorithm confirms bullish trend reversal at ${price} with ${data.risk_score?.confidence_score}% confidence.`;
  } else if (decision === 'SELL') {
    headline = `${symbolReadable} Plunging? AI Signals SELL at ${price}. Key Support: ${data.zones?.support_zone}`;
    storySummary = `Bearish continuation detected on ${symbolReadable}. Smart money is exiting at ${price}. Protection stop-loss recommended.`;
  }

  // Arabic version
  if (locale === 'ar') {
    if (decision === 'BUY') {
      headline = `${symbolReadable} تنبيه اختراق: الذكاء الاصطناعي يشير إلى شراء عند ${price}. الهدف ${data.zones?.resistance_zone}`;
      storySummary = `زخم شرائي قوي تم اكتشافه لـ ${symbolReadable}. تؤكد الخوارزمية انعكاس الاتجاه الصاعد عند ${price} بثقة ${data.risk_score?.confidence_score}%.`;
    } else if (decision === 'SELL') {
      headline = `${symbolReadable} هبوط؟ الذكاء الاصطناعي يشير إلى بيع عند ${price}. الدعم الرئيسي: ${data.zones?.support_zone}`;
      storySummary = `استمرار هبوطي تم اكتشافه على ${symbolReadable}. الأموال الذكية تخرج عند ${price}. يوصى بوقف الخسارة الوقائي.`;
    } else {
      headline = `${symbolReadable} تحديث التماسك: تحذير تقلب حاد عند ${price}`;
      storySummary = `تم اكتشاف ضغط تقلب على ${symbolReadable}. يقترح الذكاء الاصطناعي الانتظار بين ${data.zones?.support_zone} و ${data.zones?.resistance_zone}.`;
    }
  }

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
          "name": "MPIntellect",
          "logo": {
            "@type": "ImageObject",
            "url": LOGO_URLS.png,
            "width": 512,
            "height": 512,
            "caption": "MPIntellect Logo"
          }
        },
        "description": storySummary,
        "image": [LOGO_URLS.og(symbolClean, decision), LOGO_URLS.webp],
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${SITE_URL}/${locale}/${toolUrl}/${data.symbol}`
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
          "name": "MPIntellect",
          "url": SITE_URL,
          "logo": LOGO_URLS.png
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": locale === 'ar' ? `هل ${symbolReadable} شراء أم بيع اليوم؟` : `Is ${symbolReadable} a Buy or Sell today?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": locale === 'ar' 
                ? `وفقاً لتحليل الذكاء الاصطناعي من MPIntellect بتاريخ ${new Date().toLocaleDateString('ar-EG')}، فإن ${symbolReadable} حالياً <strong style="color:${decision === 'BUY' ? 'green' : decision === 'SELL' ? 'red' : 'orange'}">${decision === 'BUY' ? 'شراء' : decision === 'SELL' ? 'بيع' : 'انتظار'}</strong>. منطقة الدخول monitored حول ${data.trend?.current_price}.`
                : `According to MPIntellect AI analysis on ${new Date().toLocaleDateString()}, ${symbolReadable} is currently a <strong style="color:${decision === 'BUY' ? 'green' : decision === 'SELL' ? 'red' : 'orange'}">${decision}</strong>. The entry zone is monitored around ${data.trend?.current_price}.`
            }
          },
          {
            "@type": "Question",
            "name": locale === 'ar' ? `ما هو هدف السعر لـ ${symbolReadable}؟` : `What is the price target for ${symbolReadable}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": locale === 'ar'
                ? `المقاومة الحالية (هدف الربح) محددة عند ${data.zones?.resistance_zone}. الدعم عند ${data.zones?.support_zone}.`
                : `Current resistance (profit target) is set at ${data.zones?.resistance_zone}. Support is held at ${data.zones?.support_zone}.`
            }
          },
          {
            "@type": "Question",
            "name": locale === 'ar' ? `ما هو الاتجاه الحالي لـ ${symbolReadable}؟` : `What is the current trend for ${symbolReadable}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": locale === 'ar'
                ? `الاتجاه الحالي للسوق هو ${data.trend?.trend?.replace(/_/g, ' ').toUpperCase()}. التقلب مصنف على أنه ${data.volatility?.volatility_level}.`
                : `The current market trend is ${data.trend?.trend?.replace(/_/g, ' ').toUpperCase()}. Volatility is classified as ${data.volatility?.volatility_level}.`
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
        __html: JSON.stringify(graphData, null, 2)
      }}
      key={`schema-${symbolClean}-${locale}-${Date.now()}`}
    />
  );
}