// functions/api/ads/catalog.ts
import { AD_SYMBOLS, LANDING_HOST, csvEscape } from "../../../backend-lib/ad-config";

export async function onRequestGet(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  
  // 1. Identify which platform is asking for the catalog
  const platform = url.searchParams.get("platform") || "facebook"; 
  const version = Math.floor(Date.now() / 3600000); // Updates every hour

  // 2. Define columns based on platform - MATCHING WORKING EXAMPLE
  const googleColumns = [
    'id', 'title', 'description', 'availability', 'condition', 
    'price', 'link', 'image_link', 'brand', 'google_product_category',
    'custom_label_0', 'custom_label_1', 'custom_label_2', 'custom_label_3'
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

  for (const sym of AD_SYMBOLS) {
    const isBot = sym.category === 'Robots';
    
    for (const style of styles) {
      // Get the types for this style
      const types = styleToTypes[style];
      
      for (const type of types) {
        // Determine which sizes to use based on platform
        const sizes = platform === 'facebook' ? facebookSizes : googleSizes;
        
        for (const size of sizes) {
          // Create a unique ID
          const prodId = `${sym.id}-${type}`.toUpperCase();
          
          // Define destination link - MATCHING WORKING EXAMPLE
          let link = `${LANDING_HOST}${typeConfig[type].url}?symbol=${sym.id}&source=${platform}_ad&auto_start=true`;
          
          if (isBot) {
            link = `${LANDING_HOST}/ai-robot?symbol=${sym.id}&source=${platform}_ad`;
          }

          // Image link - MATCHING WORKING EXAMPLE FORMAT
          const imageLink = `${LANDING_HOST}/api/ads/render?symbol=${sym.id}&type=${type}&size=${size}&v=${version}`;

          // Price logic - FREE for lead gen, paid for bots
          const price = isBot ? '45.00 EUR' : '0.00 EUR';
          
          // Size description
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

          // Create title - MATCHING WORKING EXAMPLE FORMAT
          const title = `${sym.name} ${typeConfig[type].name}`;
          
          // Create description - MATCHING WORKING EXAMPLE FORMAT
          const description = `Interactive ${typeConfig[type].name} for ${sym.name}. Real-time market insights and trading signals.`;

          // Determine Google product category
          const googleCategory = isBot 
            ? 'Software > Business & Productivity' 
            : 'Software > Business & Productivity';

          // Determine custom label 1 (campaign type)
          const customLabel1 = typeConfig[type].category;

          if (platform === 'facebook') {
            // Facebook-specific row - MATCHING WORKING EXAMPLE
            rows.push([
              prodId,                                           // id
              title,                                            // title
              description,                                      // description
              'in stock',                                       // availability
              'new',                                            // condition
              price,                                            // price
              link,                                             // link
              imageLink,                                        // image_link
              'MZPrimer AI',                                    // brand (MATCHING EXAMPLE)
              googleCategory,                                   // google_product_category
              sym.category,                                     // custom_label_0 (Product Type)
              customLabel1                                      // custom_label_1 (Campaign Type)
            ]);
          } else {
            // Google-specific row - with additional custom labels
            rows.push([
              prodId,                                           // id
              title,                                            // title
              description,                                      // description
              'in stock',                                       // availability
              'new',                                            // condition
              price,                                            // price
              link,                                             // link
              imageLink,                                        // image_link
              'MZPrimer AI',                                    // brand
              googleCategory,                                   // google_product_category
              sym.category,                                     // custom_label_0 (Product Type)
              customLabel1,                                     // custom_label_1 (Campaign Type)
              styleDescriptions[style],                         // custom_label_2 (Design Style)
              sizeDescriptions[size]                            // custom_label_3 (Ad Size)
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