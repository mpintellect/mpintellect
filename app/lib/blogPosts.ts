// /lib/blogPosts.ts

export interface BlogPost {
  title: string;
  slug: string;
  date?: string;
  image?: string;
  description: string;
  content: string;
  lang?: 'en' | 'ar';
}

export const blogPosts: BlogPost[] = [
  {
  title: 'What is Lot Size in Forex?',
  slug: 'lot-size-guide',
  description: 'Understand how lot size impacts your position size, pip value, and overall risk in forex trading.',
  content: `
<div style="text-align: left;">
  <p>In Forex trading, a <strong>lot</strong> refers to the volume of currency units you're trading in a single order. It's one of the most important factors in managing risk, calculating profit potential, and designing your strategy. Every trade you place is sized in lots — and understanding how to use them wisely separates beginners from pros.</p>

  <h3>📐 Lot Size Types</h3>
  <p>The Forex market offers several standard lot sizes:</p>
  <ul>
    <li><strong>Standard Lot</strong> = 100,000 units</li>
    <li><strong>Mini Lot</strong> = 10,000 units</li>
    <li><strong>Micro Lot</strong> = 1,000 units</li>
    <li><strong>Nano Lot</strong> = 100 units (rare, but offered by some brokers)</li>
  </ul>
  <p>Each size controls how much each pip movement is worth. For example, a 1-pip change in a standard lot usually equals $10 (on most USD pairs), while in a micro lot it equals $0.10.</p>

  <h3>🧮 Lot Size & Pip Value</h3>
  <p>Pip value changes depending on the lot size, currency pair, and whether you're trading a USD-based pair or not.</p>
  <p>To calculate pip value for 1 lot:</p>
  <pre style="background:#1e1e1e; padding: 10px; border-radius: 6px; color: #f1f1f1;">
Pip Value = (1 pip ÷ Exchange Rate) × Lot Size
  </pre>
  <p>Example: If EUR/USD = 1.1000 and you’re trading 1 standard lot (100,000), your pip value is:</p>
  <pre style="background:#1e1e1e; padding: 10px; border-radius: 6px; color: #f1f1f1;">
Pip Value = (0.0001 ÷ 1.1000) × 100,000 = $9.09
  </pre>

  <h3>📊 Lot Size & Account Balance</h3>
  <p>Your lot size should match your account size and risk profile. Most professionals recommend risking only <strong>1–2%</strong> of your capital per trade.</p>
  <p>Example: If your account balance is $1,000 and you want to risk 2%, your max loss per trade is $20. If your stop loss is 50 pips, your position size must be:</p>
  <pre style="background:#1e1e1e; padding: 10px; border-radius: 6px; color: #f1f1f1;">
Lot Size = ($20 ÷ 50 pips) ÷ pip value
  </pre>
  <p>This often leads to using a <strong>micro lot</strong> or smaller — the hallmark of disciplined trading.</p>

  <h3>💡 Margin, Leverage & Lot Size</h3>
  <p>The bigger your lot, the more margin you use. For instance, trading 1 standard lot with 1:100 leverage on EUR/USD (1.1000):</p>
  <ul>
    <li>Required Margin = (100,000 × 1.1000) ÷ 100 = $1,100</li>
  </ul>
  <p>Too much margin use increases the risk of a margin call. Always balance lot size with available equity.</p>

  <h3>🎯 Strategic Uses of Lot Size</h3>
  <p>Advanced traders often adjust lot size dynamically based on:</p>
  <ul>
    <li>Trade confidence level (larger size for higher probability setups)</li>
    <li>Volatility of the pair (smaller size for volatile pairs like GBP/JPY)</li>
    <li>Account drawdown phase (reduce size during recovery)</li>
    <li>Scaling in/out (partial positions to manage exposure)</li>
  </ul>

  <h3>🧠 Psychology: Lot Size and Emotion</h3>
  <p>If your lot size is too large, your emotional risk rises. Most traders overtrade and panic not because of poor entries — but because the position size is too large for them to manage calmly. Always match lot size to your psychological tolerance, not just your account balance.</p>

  <h3>✅ Summary</h3>
  <ul>
    <li>Lot size defines your pip value and risk exposure.</li>
    <li>Always align lot size with your risk management rules.</li>
    <li>Use micro/mini lots if you're just starting or trading small accounts.</li>
  </ul>

  <p><small>📅 Published: June 16, 2025 — by MPIntellect  </small></p>
</div>
`
},
  {
  title: 'توترات إيران وإسرائيل: تأثيرها على أسعار النفط والذهب والعملات',
  slug: 'iran-israel-tensions-ar',
  description: 'تحليل شامل لتأثير التوترات الجيوسياسية بين إيران وإسرائيل على الذهب والنفط وسوق العملات.',
  content: `
<div dir="rtl" style="text-align: right;">
  <p><strong>التاريخ:</strong> 17 يونيو 2025، الساعة 23:33</p>

  <h3>📌 الخلفية الجيوسياسية الحالية</h3>
  <p>في الأيام القليلة الماضية، تصاعدت التوترات بشكل خطير بين إيران وإسرائيل، بعد تنفيذ إسرائيل ضربات جوية دقيقة استهدفت منشآت نووية ومراكز قيادية تابعة للحرس الثوري الإيراني...</p>

  <h3> الذهب: ملاذ آمن يعود بقوة</h3>
  <p>مع تصاعد التوترات، شهدت أسعار الذهب ارتفاعًا ملحوظًا حيث تجاوزت حاجز 3,400 دولار للأونصة...</p>
  <p><strong>من الناحية الفنية:</strong></p>
  <ul>
    <li><strong>الدعم القوي:</strong> 3,380 – 3,390 دولار</li>
    <li><strong>المقاومة المقبلة:</strong> 3,430 – 3,450 دولار</li>
  </ul>

  <h3>🛢️ النفط: بين التصعيد والمخزون الاستراتيجي</h3>
  <p>أسعار النفط ارتفعت بشكل حاد نتيجة الخوف من تعطل الإمدادات، خصوصًا مع احتمالية إغلاق مضيق هرمز...</p>
  <ul>
    <li>الطلب العالمي ما زال قويًا مع دخول موسم الصيف.</li>
    <li>عدم كفاية المخزونات الاستراتيجية للسيطرة على أي أزمة إمداد طويلة الأمد.</li>
    <li>أسعار الشحن والتأمين البحري ارتفعت بشكل ملحوظ.</li>
  </ul>

  <h3>💱 تأثير مباشر على سوق العملات</h3>
  <p>الدولار الأمريكي والين الياباني يستفيدان من تدفق رؤوس الأموال إلى الأصول الآمنة...</p>

  <h3>📊 التوقعات والاستراتيجيات المقترحة</h3>
  <h4>🔹 الذهب:</h4>
  <ul>
    <li>الشراء عند مستويات الدعم 3,390 مع وقف خسارة تحت 3,380.</li>
    <li>أهداف قصيرة المدى: 3,430 ثم 3,450.</li>
  </ul>

  <h4>🔹 النفط:</h4>
  <ul>
    <li>الدخول عند ارتدادات نحو 72–73 دولار مع وقف خسارة تحت 71.</li>
    <li>الأهداف: 76 ثم 80 إذا استمر التوتر.</li>
  </ul>

  <h4>🔹 العملات:</h4>
  <ul>
    <li>الشراء على الدولار/ين في حال اختراق 145.20 نحو أهداف 146.50–147.</li>
    <li>التحفظ على التداول ضد الدولار في ظل استمرار حالة الذعر العالمي.</li>
  </ul>

  <h3>🧠 الخلاصة:</h3>
  <p>السوق لا يتعامل مع مجرد أزمة عابرة، بل مع تهديد استراتيجي طويل المدى قد يعيد تشكيل موازين العرض والطلب في الطاقة والمعادن...</p>

  <p style="margin-top: 20px;"><small>📅 نُشر بتاريخ: 17 يونيو 2025 — إعداد فريق MPIntellect  </small></p>
</div>
`
},
{
  title: 'تحليل استراتيجي: موانئ إيران النفطية وتهديد أسعار النفط العالمية',
  slug: 'iran-ports-analysis-ar',
  description: 'تحليل شامل لأهمية الموانئ الإيرانية مثل جزيرة خارك وتأثيرها على أسعار النفط العالمية والتوترات الجيوسياسية.',
  content: `
<div dir="rtl" style="text-align: right;">
  <p><strong>📅 التاريخ:</strong> 18 يونيو 2025 • <strong> التوقيت:</strong> 00:28</p>

  <hr />

  <h3>⚓ 1. لماذا الموانئ الإيرانية مهمة؟</h3>
  <p>تعتمد صادرات النفط الإيرانية بشكل رئيسي على عدد قليل من الموانئ البحرية الاستراتيجية:</p>
  <ul>
    <li><strong>جزيرة خارك:</strong> تصدر حوالي 90٪ من النفط الإيراني الخام.</li>
    <li><strong>ميناء جاسك:</strong> منفذ جديد على خليج عمان، تم إنشاؤه لتجاوز مضيق هرمز.</li>
    <li><strong>بندر عباس:</strong> ميناء تجاري وداعم للطاقة، ولكن لا يمتلك نفس القدرة التصديرية لخارك.</li>
  </ul>

  <hr />

  <h3>🚨 2. جزيرة خارك: نقطة الضعف الأخطر</h3>
  <p><strong>🇮🇷 الدور الاستراتيجي:</strong></p>
  <ul>
    <li>تحتوي على خزانات ضخمة وأنابيب مرتبطة بحقول النفط البرية.</li>
    <li>تسمح منصاتها البحرية بشحن أكثر من ناقلة في الوقت ذاته.</li>
    <li>طاقتها التصديرية تتجاوز 1.5 مليون برميل يوميًا.</li>
  </ul>

  <p><strong>🎯 نقاط الضعف:</strong></p>
  <ul>
    <li>من السهل استهدافها جغرافيًا سواء من البحر أو الجو.</li>
    <li>صور الأقمار الصناعية تشير إلى تعزيزات عسكرية إيرانية في آخر 72 ساعة.</li>
    <li>أي ضرر سيتطلب أشهرًا من الإصلاح، ولا يوجد بديل يعوضها بالكامل.</li>
  </ul>

  <hr />

  <h3>🌍 3. حساسية السوق العالمي</h3>
  <p>أسواق النفط تتفاعل بسرعة كبيرة مع التهديدات في البنية التحتية بالشرق الأوسط:</p>
  <ul>
    <li>أي تعطيل لخارك قد يحذف أكثر من مليون برميل يوميًا من المعروض.</li>
    <li>قد يدفع ذلك بأسعار برنت نحو 85–90 دولارًا خلال أيام.</li>
    <li>في حال تصعيد أكبر (ضرر + تهديد هرمز)، قد تصل الأسعار إلى 110–120 دولارًا.</li>
  </ul>

  <h4>📈 تقديرات رد فعل الأسعار:</h4>
  <table style="width: 100%; border-collapse: collapse;">
    <thead style="background: #f5f5f5;">
      <tr>
        <th style="border: 1px solid #ccc; padding: 10px;">السيناريو</th>
        <th style="border: 1px solid #ccc; padding: 10px;">نقص الإمداد</th>
        <th style="border: 1px solid #ccc; padding: 10px;">رد الفعل السعري المتوقع</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #ccc; padding: 10px;">ضرر طفيف لجزيرة خارك</td>
        <td style="border: 1px solid #ccc; padding: 10px;">300–500 ألف برميل/يوميًا</td>
        <td style="border: 1px solid #ccc; padding: 10px;">+4–6 دولار للبرميل</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 10px;">توقف كامل</td>
        <td style="border: 1px solid #ccc; padding: 10px;">1–1.3 مليون برميل/يوميًا</td>
        <td style="border: 1px solid #ccc; padding: 10px;">+10–15 دولار للبرميل</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 10px;">مع إغلاق مضيق هرمز</td>
        <td style="border: 1px solid #ccc; padding: 10px;">أكثر من 4 ملايين برميل/يوميًا</td>
        <td style="border: 1px solid #ccc; padding: 10px;">ارتفاع مؤقت 110–130 دولار</td>
      </tr>
    </tbody>
  </table>

  <hr />

  <h3>💡 4. تداعيات استراتيجية وسياسية</h3>
  <ul>
    <li>الصين والهند ستطلبان ضمانات فورية لتأمين الشحنات.</li>
    <li>أسعار التأمين البحري سترتفع حتى على صادرات السعودية والإمارات.</li>
    <li>القوات البحرية الأمريكية قد تعزز وجودها لحماية الممرات.</li>
    <li>إيران قد ترد بزرع ألغام أو تهديد الملاحة في هرمز.</li>
    <li>دول الخليج أو إسرائيل قد تضرب منشآت بديلة مثل جاسك.</li>
  </ul>

  <hr />

  <h3>📊 النظرة قصيرة الأجل للتداول</h3>
  <ul>
    <li><strong>WTI:</strong> راقب دعم 73.50$ — مع تصاعد الأخبار، قد يصل إلى 78$.</li>
    <li><strong>برنت:</strong> تجاوز 76.20$ يعني احتمالية صعود نحو 82$.</li>
    <li><strong>OVX:</strong> قد يرتفع بنسبة 10–15٪.</li>
  </ul>

  <p><strong>الاستراتيجية:</strong></p>
  <ul>
    <li>شراء النفط عند الانخفاضات، مع وقف خسارة قريب من الدعم.</li>
    <li>متابعة صور الأقمار الصناعية وتحركات الناقلات.</li>
    <li>تجنب الروافع العالية بسبب المخاطر السياسية.</li>
  </ul>

  <hr />

  <h3>🧠 الخلاصة</h3>
  <p>ميناء جزيرة خارك ليس مجرد منشأة إيرانية — بل هو ركيزة توازن لوجستي عالمي في سوق الطاقة.</p>
  <p>أي خلل في عملياته قد يفاقم التضخم، ويرفع تكاليف الطاقة، ويغير خريطة التحالفات الجيوسياسية.</p>
  <p>إذا استمر التصعيد، فقد تدخل أسعار النفط مرحلة “التسعير الاستراتيجي”.</p>

  <p><small>📅 نُشر بتاريخ: 18 يونيو 2025 — بواسطة MPIntellect </small></p>
</div>
`
},
{
  title: 'How to Use Stop Loss & Take Profit Like a Pro',
  slug: 'stop-loss-take-profit',
  description: 'Master risk management by learning exactly where and how to place SL and TP levels like professional traders.',
  content: `
<div style="text-align: left;">
  <p>Stop Loss (SL) and Take Profit (TP) are the foundation of any trading risk management plan. Without them, trades are left vulnerable to emotional decisions and excessive losses. Here’s how to master both like a professional trader.</p>

  <h3>🔒 What is a Stop Loss?</h3>
  <p>A <strong>Stop Loss</strong> is a predefined price at which your trade is automatically closed to prevent further loss. It acts as a safety net when the market moves against you.</p>

  <h4>📌 Where to place it:</h4>
  <ul>
    <li>Below support (if buying)</li>
    <li>Above resistance (if selling)</li>
    <li>Outside of the recent swing high/low</li>
  </ul>

  <h3>💰 What is a Take Profit?</h3>
  <p>A <strong>Take Profit</strong> is the price level at which your trade closes in profit. It ensures your gains are secured before the market can reverse.</p>

  <h4>📌 Ideal TP placements:</h4>
  <ul>
    <li>Next resistance/support area</li>
    <li>Fibonacci extensions (1.272, 1.618)</li>
    <li>Fixed Risk/Reward target (e.g. 1:2 or 1:3)</li>
  </ul>

  <h3>📊 Pro Risk/Reward Tip</h3>
  <p>Using a 1:2 ratio (risking $50 to gain $100) allows you to be profitable even if only 50% of your trades win. For example, if your SL is 50 pips, then your TP should be at least 100 pips away.</p>

  <h3>🧠 Common Mistakes</h3>
  <ul>
    <li>Placing SLs too tight (leads to premature exits)</li>
    <li>Using TPs that are too far away (rarely triggered)</li>
    <li>Trading without a SL — this exposes you to unlimited loss</li>
  </ul>

  <h3>📌 How to Calculate SL & TP Levels</h3>
  <p>Use ATR (Average True Range) indicator to adapt to market volatility:</p>
  <pre style="background: #1e1e1e; padding: 1rem; border-radius: 8px; color: #f1f1f1;">
SL = Entry Price - (1.5 × ATR)
TP = Entry Price + (3 × ATR)</pre>
  <p>This keeps your risk/reward structured, and adapts dynamically to current volatility.</p>

  <h3>🛠️ Tools That Help</h3>
  <ul>
    <li>Use <strong>position size calculators</strong> to determine lot size based on SL</li>
    <li>Enable <strong>trailing stop</strong> to protect profits during trend moves</li>
    <li>Backtest different SL/TP strategies to optimize performance</li>
  </ul>

  <h3>🧠 Psychological Tips</h3>
  <ul>
    <li>Set your SL and TP before entering the trade — never change it impulsively</li>
    <li>Accept small losses as part of the game</li>
    <li>Don’t move your SL further away “hoping” the trade will come back</li>
  </ul>

  <h3>✅ Summary</h3>
  <ul>
    <li>SL protects your capital — TP locks in your success</li>
    <li>Combine both with proper position sizing and consistent rules</li>
    <li>Most professional traders prioritize risk control over profit hunting</li>
  </ul>

  <p><small>📅 Published: June 16, 2025 — by MPIntellect </small></p>
</div>
`
},
{
  title: 'Middle East Tensions: How It Impacts Gold, Oil & Forex',
  slug: 'middle-east-tensions',
  description: 'A deep breakdown of how the geopolitical conflict between Iran and Israel is shaking global markets, with a focus on gold, oil, and forex.',
  content: `
<div style="text-align: left;">
  <p><strong>Date:</strong> June 17, 2025</p>

  <h3>⚠️ Geopolitical Context</h3>
  <ul>
    <li>On June 13, Israel struck Iranian nuclear and IRGC military sites, reportedly killing senior commanders, including IRGC chief Salami.</li>
    <li>Between June 14–16, Iran fired over 150 ballistic missiles and drones targeting Israel; most were intercepted, but civilian casualties occurred.</li>
    <li>Iran has renewed its threat to close the Strait of Hormuz, through which ~20% of global oil transits.</li>
  </ul>

  <h3>🪙 Gold: Surging on Safe-Haven Demand</h3>
  <p>Gold prices jumped to a nearly two-month high. Although it briefly eased to ~$3,393, bullion remains elevated above $3,400 as investors react to geopolitical uncertainty and fears of inflation pressure.</p>
  <p><strong>Outlook:</strong></p>
  <ul>
    <li>Support zone: $3,300–$3,400 (50-day EMA)</li>
    <li>Resistance: ~$3,500 — watch for consolidation or breakout based on coming news</li>
  </ul>

  <h3>🛢️ Oil: Flash Volatility Amid Supply Risk</h3>
  <p>Following the June 13 strikes, Brent surged ~11% to ~$74 before stabilizing near $73–74, while WTI rose ~7% to ~$70–72. Analysts warn oil may reach $100–150 if the Strait sees disruption, although current sanctions and supply boosters could ease pressure later this year.</p>
  <p><strong>Outlook:</strong></p>
  <ul>
    <li>Key support: WTI $70–71, Brent $73–74</li>
    <li>Scalpers can target tight trades when markets react to news, with stops just outside support zones</li>
  </ul>

  <h3>💱 Forex: Safe-Haven Flow Strengthens USD and JPY</h3>
  <p>The U.S. Dollar has strengthened with USD/JPY up ~0.4% to ~144.65 and EUR/USD down to ~1.1532 as investors de-risk. The Federal Reserve’s likely pause on rate cuts is reinforcing dollar demand amid elevated oil prices and inflation risk.</p>
  <p><strong>Key Levels:</strong></p>
  <ul>
    <li>USD/JPY support: 143.90–145.00</li>
    <li>EUR/USD resistance: ~1.1575, support: ~1.1530</li>
  </ul>

  <h3>📊 Trading Strategies</h3>
  <p><strong>Short-Term:</strong></p>
  <ul>
    <li><strong>Gold:</strong> Buy near $3,400 with stop just below $3,300; target $3,500–$3,550</li>
    <li><strong>Oil:</strong> Long WTI on dips to $70–71; tight stop under $68</li>
    <li><strong>FX:</strong> Go long USD/JPY with stop under 143.9; avoid leverage spikes</li>
  </ul>

  <p><strong>Mid-Term:</strong></p>
  <ul>
    <li>Watch diplomatic developments around the Strait of Hormuz</li>
    <li>Monitor central bank tone — Fed, ECB — to assess inflation impact</li>
    <li>Look for gold pullbacks if tensions ease; oil vulnerable to overbought retracement</li>
  </ul>

  <h3>🧠 Summary</h3>
  <p>This is not just a temporary reaction — markets are beginning to price in sustained strategic risk. Safe-haven demand is up, inflation hedging is back, and volatility is surging.</p>
  <p>Traders should focus on solid technical zones, avoid emotional entries, and size positions according to risk — not fear.</p>

  <p><small>📅 Published: June 17, 2025 — by MPIntellect </small></p>
</div>
`
}
];