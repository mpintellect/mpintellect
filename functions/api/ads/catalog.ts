// functions/api/ads/catalog.ts
import { AD_SYMBOLS, LANDING_HOST, csvEscape } from "../../../backend-lib/ad-config";

export async function onRequestGet(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  
  // 1. Identify which platform is asking for the catalog
  const platform = url.searchParams.get("platform") || "facebook"; 
  const version = Math.floor(Date.now() / 3600000); // Updates every hour

  // 2. Define columns based on platform - EXACT MATCH TO GOOGLE'S REQUIREMENTS
  const googleColumns = [
    'ID', 'ID2', 'Final URL', 'Image URL', 'Item title', 'Item subtitle', 
    'Item description', 'Item address', 'Item category', 'Price', 'Formatted Price', 
    'Sale price', 'Formatted sale price', 'Contextual keywords', 'Tracking template', 
    'Final mobile URL', 'Android app link', 'iOS app link', 'iOS app store ID', 'Similar IDs'
  ];

  const facebookColumns = [
    'id', 'title', 'description', 'availability', 'condition',
    'price', 'link', 'image_link', 'brand', 'google_product_category',
    'custom_label_0', 'custom_label_1'
  ];

  const columns = platform === 'facebook' ? facebookColumns : googleColumns;

  const rows: string[][] = [];

  // Define available sizes per platform
  const googleSizes = ['standard', 'square', 'portrait'];
  const facebookSizes = ['standard', 'square', 'portrait', 'story'];
  
  // Styles available
  const styles = ['black', 'cyber'];
  
  // For each style, define which types of content to show
  const styleToTypes: Record<string, string[]> = {
    'black': ['propfirm', 'chat', 'update', 'volatility'],
    'cyber': ['propfirm', 'chat']
  };

  // Map types to display names and URLs
  const typeConfig: Record<string, { name: string, url: string, category: string }> = {
    'chat': {
      name: 'AI Assistant',
      url: '/AIChat',
      category: 'Lead_Gen'
    },
    'propfirm': {
      name: 'Prop Firm Calculator',
      url: '/prop-firm',
      category: 'Tool'
    },
    'update': {
      name: 'Market Update',
      url: '/tools/ai-assistant',
      category: 'Update'
    },
    'volatility': {
      name: 'Volatility Analysis',
      url: '/tools/ai-assistant?tab=volatility',
      category: 'Analysis'
    }
  };

  // Use a Set to track used IDs to prevent duplicates
  const usedIds = new Set();

  for (const sym of AD_SYMBOLS) {
    const isBot = sym.category === 'Robots';
    
    for (const style of styles) {
      // Get the types for this style
      const types = styleToTypes[style];
      
      for (const type of types) {
        // Determine which sizes to use based on platform
        const sizes = platform === 'facebook' ? facebookSizes : googleSizes;
        
        for (const size of sizes) {
          // Create unique ID with size
          let prodId = `${sym.id}-${type}-${size}`.toUpperCase();
          
          // Ensure ID is unique
          let counter = 1;
          while (usedIds.has(prodId)) {
            prodId = `${sym.id}-${type}-${size}-${counter}`.toUpperCase();
            counter++;
          }
          usedIds.add(prodId);
          
          // Define destination link
          let link = `${LANDING_HOST}${typeConfig[type].url}?symbol=${sym.id}&source=${platform}_ad&auto_start=true&variant=${size}`;
          
          if (isBot) {
            link = `${LANDING_HOST}/ai-robot?symbol=${sym.id}&source=${platform}_ad&variant=${size}`;
          }

          // Image link
          const imageLink = `${LANDING_HOST}/api/ads/render?symbol=${sym.id}&type=${type}&size=${size}&v=${version}`;

          // Price logic
          const price = isBot ? '45.00' : '0.00';
          const formattedPrice = isBot ? '45.00 EUR' : 'Free';
          
          // Size description
          const sizeDescriptions: Record<string, string> = {
            standard: 'Landscape 1200x628',
            square: 'Square 1080x1080',
            portrait: 'Portrait 1080x1350',
            story: 'Story 1080x1920'
          };

          const styleDescriptions: Record<string, string> = {
            black: 'Black Gold',
            cyber: 'Neon Cyber'
          };

          // Create title and description
          const title = `${sym.name} ${typeConfig[type].name}`;
          const subtitle = `${styleDescriptions[style]} ${sizeDescriptions[size]}`;
          const description = `Interactive ${typeConfig[type].name} for ${sym.name} trading. Real-time market insights, AI-powered analysis, and professional trading signals. Perfect for ${styleDescriptions[style]} theme.`;

          // Item category
          const itemCategory = isBot ? 'Trading Robot' : 'Trading Tool';

          // Contextual keywords
          const keywords = `${sym.name},${typeConfig[type].name},${styleDescriptions[style]},${sizeDescriptions[size]},trading,forex,AI,signals`.toLowerCase();

          if (platform === 'facebook') {
            // Facebook-specific row
            rows.push([
              prodId,                                           // id
              title,                                            // title
              description,                                      // description
              'in stock',                                       // availability
              'new',                                            // condition
              price + ' EUR',                                   // price
              link,                                             // link
              imageLink,                                        // image_link
              'MZPrimer AI',                                    // brand
              'Software > Business & Productivity',             // google_product_category
              sym.category,                                     // custom_label_0
              typeConfig[type].category                         // custom_label_1
            ]);
          } else {
            // Google-specific row - EXACT MATCH TO THEIR COLUMNS
            rows.push([
              prodId,                                           // ID
              '',                                               // ID2 (leave empty)
              link,                                             // Final URL
              imageLink,                                        // Image URL
              title,                                            // Item title
              subtitle,                                         // Item subtitle
              description,                                      // Item description
              '',                                               // Item address (leave empty)
              itemCategory,                                     // Item category
              price,                                            // Price
              formattedPrice,                                   // Formatted Price
              price,                                            // Sale price
              formattedPrice,                                   // Formatted sale price
              keywords,                                         // Contextual keywords
              '',                                               // Tracking template
              link,                                             // Final mobile URL
              '',                                               // Android app link
              '',                                               // iOS app link
              '',                                               // iOS app store ID
              ''                                                // Similar IDs
            ]);
          }
        }
      }
    }
  }

  // 3. Assemble CSV
  const csvBody = [
    columns.map(csvEscape).join(','),
    ...rows.map(row => row.map(csvEscape).join(','))
  ].join('\n');

  // Set appropriate filename based on platform
  const filename = platform === 'facebook' 
    ? `mz_intel_facebook_${version}.csv`
    : `mz_intel_google_${version}.csv`;

  return new Response(csvBody, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}