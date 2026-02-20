// functions/api/ads/catalog.ts
import { AD_SYMBOLS, LANDING_HOST, csvEscape } from "../../../backend-lib/ad-config";

export async function onRequestGet(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  
  // 1. Identify which platform is asking for the catalog
  const platform = url.searchParams.get("platform") || "facebook"; 
  const version = Math.floor(Date.now() / 3600000); // Updates every hour

  // 2. Define columns based on platform - GOOGLE NEEDS MORE FIELDS
  const googleColumns = [
    'id', 'title', 'description', 'availability', 'condition', 
    'price', 'link', 'image_link', 'brand', 'google_product_category',
    'custom_label_0', 'custom_label_1', 'custom_label_2', 'custom_label_3',
    'mpn', 'gtin', 'identifier_exists', 'item_group_id', 'sale_price',
    'shipping', 'tax', 'color', 'size', 'gender', 'age_group'
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
          
          // Item group ID for variants (without size)
          const itemGroupId = `${sym.id}-${type}`.toUpperCase();
          
          // Define destination link
          let link = `${LANDING_HOST}${typeConfig[type].url}?symbol=${sym.id}&source=${platform}_ad&auto_start=true&variant=${size}`;
          
          if (isBot) {
            link = `${LANDING_HOST}/ai-robot?symbol=${sym.id}&source=${platform}_ad&variant=${size}`;
          }

          // Image link
          const imageLink = `${LANDING_HOST}/api/ads/render?symbol=${sym.id}&type=${type}&size=${size}&v=${version}`;

          // Price logic - FREE for lead gen, paid for bots
          const price = isBot ? '45.00 EUR' : '0.00 EUR';
          
          // Size mapping for display
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

          // Create title
          const title = `${sym.name} ${typeConfig[type].name} - ${sizeDescriptions[size]}`;
          
          // Create description
          const description = `Interactive ${typeConfig[type].name} for ${sym.name} trading. Real-time market insights, AI-powered analysis, and professional trading signals. Perfect for ${styleDescriptions[style]} theme.`;

          // Google product category - MUST HAVE VALUE
          const googleCategory = 'Software > Business & Productivity Software';

          // Custom labels
          const customLabel0 = sym.category; // Product Type
          const customLabel1 = typeConfig[type].category; // Campaign Type
          const customLabel2 = styleDescriptions[style]; // Design Style
          const customLabel3 = sizeDescriptions[size]; // Ad Size

          // MPN (Manufacturer Part Number) - REQUIRED for Google
          const mpn = `MZP-${prodId.substring(0, 10)}`;
          
          // GTIN - empty but identifier_exists must be FALSE
          const gtin = '';
          const identifierExists = 'FALSE';
          
          // Sale price (same as price if no sale)
          const salePrice = price;
          
          // Shipping - REQUIRED for Google
          const shipping = 'EUR:Standard:0.00';
          
          // Tax - REQUIRED for Google
          const tax = 'DE:0.00';

          // Color
          const color = style === 'black' ? 'Black/Gold' : 'Neon/Cyber';
          
          // Size
          const googleSize = sizeDescriptions[size];
          
          // Gender
          const gender = 'unisex';
          
          // Age group
          const ageGroup = 'adult';

          if (platform === 'facebook') {
            // Facebook-specific row
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
              customLabel0,                                     // custom_label_0
              customLabel1                                      // custom_label_1
            ]);
          } else {
            // Google-specific row with ALL required fields
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
              customLabel0,                                     // custom_label_0
              customLabel1,                                     // custom_label_1
              customLabel2,                                     // custom_label_2
              customLabel3,                                     // custom_label_3
              mpn,                                              // mpn (REQUIRED)
              gtin,                                             // gtin (can be empty)
              identifierExists,                                 // identifier_exists (MUST be FALSE if no GTIN)
              itemGroupId,                                      // item_group_id (for variants)
              salePrice,                                        // sale_price
              shipping,                                         // shipping (REQUIRED)
              tax,                                              // tax (REQUIRED)
              color,                                            // color
              googleSize,                                       // size
              gender,                                           // gender
              ageGroup                                          // age_group
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