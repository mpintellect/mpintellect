// functions/api/ads/catalog.ts
import { AD_SYMBOLS, LANDING_HOST, csvEscape } from "../../../backend-lib/ad-config";

export async function onRequestGet(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  
  // 1. Identify which platform is asking for the catalog
  const platform = url.searchParams.get("platform") || "facebook"; 
  const version = Math.floor(Date.now() / 3600000); // Updates every hour

  // 2. CSV Column Definition
  const columns = [
    'id', 'title', 'description', 'availability', 'condition', 
    'price', 'link', 'image_link', 'brand', 'google_product_category',
    'custom_label_0', 'custom_label_1', 'custom_label_2', 'custom_label_3'
  ];

  const rows: string[][] = [];

  // Define available sizes per platform
  const googleSizes = ['standard', 'square', 'portrait'];
  const facebookSizes = ['standard', 'square', 'portrait', 'story'];
  
  // Styles available
  const styles = ['black', 'cyber'];
  
  // For each style, define which types of content to show
  // Cyber style: propfirm and chat
  // Black style: propfirm, chat, update, volatility
  const styleToTypes: Record<string, string[]> = {
    'black': ['propfirm', 'chat', 'update', 'volatility'],
    'cyber': ['propfirm', 'chat']
  };

  for (const sym of AD_SYMBOLS) {
    const isBot = sym.category === 'Robots';
    
    for (const style of styles) {
      // Get the types for this style
      const types = styleToTypes[style];
      
      for (const type of types) {
        // Determine which sizes to use based on platform
        const sizes = platform === 'facebook' ? facebookSizes : googleSizes;
        
        for (const size of sizes) {
          const prodId = `${sym.id}_${style}_${type}_${size}`.toUpperCase();
          
          // Define destination link based on product type and content type
          let link = `${LANDING_HOST}/AIChat`;
          
          if (isBot) {
            link = `${LANDING_HOST}/ai-robot`;
          } else {
            // Map content types to landing pages
            switch(type) {
              case 'propfirm':
                link = `${LANDING_HOST}/prop-firm`;
                break;
              case 'chat':
                link = `${LANDING_HOST}/AIChat?mode=chat`;
                break;
              case 'update':
                link = `${LANDING_HOST}/tools/ai-assistant`;
                break;
              case 'volatility':
                link = `${LANDING_HOST}/tools/ai-assistant?tab=volatility`;
                break;
              default:
                link = `${LANDING_HOST}/AIChat`;
            }
          }

          // Image link to our renderer with all parameters
          const imageLink = `${LANDING_HOST}/api/ads/render?symbol=${sym.id}&style=${style}&type=${type}&size=${size}&v=${version}`;

          // Price logic - bots are one-time, others are subscriptions
          const price = isBot ? '45.00 USD' : '6.00 USD';
          
          // Create descriptive title based on style, type, and size
          const sizeDescriptions: Record<string, string> = {
            standard: 'Landscape',
            square: 'Square',
            portrait: 'Portrait',
            story: 'Story'
          };

          const styleDescriptions: Record<string, string> = {
            black: 'Black Gold',
            cyber: 'Neon Cyber'
          };

          const typeDescriptions: Record<string, string> = {
            propfirm: 'Risk Calculator',
            chat: 'Live Chat',
            update: 'Neural Update',
            volatility: 'Volatility Analysis'
          };

          rows.push([
            prodId,
            `${sym.name} - ${styleDescriptions[style]} ${typeDescriptions[type]} (${sizeDescriptions[size]})`,
            `Professional ${sym.name} ${isBot ? 'Trading Robot' : 'Market Intelligence'} with ${style === 'black' ? 'elegant black & gold' : 'neon cyber'} visualization. ${typeDescriptions[type]} layout with real-time signals.`,
            'in stock',
            'new',
            price,
            link,
            imageLink,
            'MZ Intelligence',
            isBot ? 'Software > Business Software > Trading Software' : 'Finance > Financial Software > Trading Tools',
            sym.category,
            style,
            type,
            size,
            platform === 'facebook' ? 'Facebook Ads' : 'Google Ads'
          ]);
        }
      }
    }
  }

  // 3. Assemble CSV
  const csvBody = [
    columns.map(csvEscape).join(','),
    ...rows.map(row => row.map(csvEscape).join(','))
  ].join('\n');

  return new Response(csvBody, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="mz_intel_${platform}_${version}.csv"`,
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}