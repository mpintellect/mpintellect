// functions/api/ads/catalog.ts
import { AD_SYMBOLS, LANDING_HOST, csvEscape } from "../../../backend-lib/ad-config";

export async function onRequestGet(context: any) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  // 1. Identify which platform is asking for the catalog
  const platform = url.searchParams.get("platform") || "facebook"; 
  
  // 2. Ask the Database which version is 100% ready
  const versionRecord = await env.DB.prepare(
    "SELECT value FROM app_settings WHERE key = 'current_ad_version'"
  ).first();
  
  // Use DB value, or fallback to time-based version if DB is empty
  const version = versionRecord?.value || Math.floor(Date.now() / (12 * 3600000));

  // 3. Define columns based on platform
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
  const facebookSizes = ['square'];
  
  // Styles available
  const styles = ['black', 'cyber'];
  
  // For each style, define which types of content to show
  const styleToTypes: Record<string, string[]> = {
    'black': ['test', 'update'],
    'cyber': ['chat']
  };

  // Map types to display names and URLs
  const typeConfig: Record<string, { name: string, url: string, category: string, fbDescription: string, googleDescription: string }> = {
    'chat': {
      name: 'AI Assistant',
      url: '/AIChat',
      category: 'Lead_Gen',
      fbDescription: 'Interactive market analysis tool for {symbol}. Ask questions about market structures and learn trading concepts through AI-guided exploration. For educational purposes only.',
      googleDescription: 'Professional AI-powered market analysis tool for {symbol}. Analyze market structures, identify patterns, and enhance your trading research with real-time data.'
    },
    'test': {
      name: 'Prop Firm Calculator',
      url: '/prop-firm',
      category: 'Tool',
      fbDescription: 'Educational position sizing calculator for {symbol}. Learn how prop firm challenges work and practice risk management concepts in a safe environment.',
      googleDescription: 'Advanced prop firm challenge calculator for {symbol}. Track drawdown limits, calculate position sizes, and manage risk parameters for FTMO and similar programs.'
    },
    'update': {
      name: 'Market Update',
      url: '/tools/ai-assistant',
      category: 'Update',
      fbDescription: 'Daily market overview for {symbol}. Review price action, key levels, and market structure for your personal research and education.',
      googleDescription: 'Professional market analysis for {symbol} with technical levels, trend structure, and institutional data points for informed decision-making.'
    }
  };

  // Safe descriptions for robots
  const botFbDescription = 'Educational trading software for {symbol}. Learn about automated trading concepts and risk management through interactive tutorials.';
  const botGoogleDescription = 'Professional automated trading software for {symbol} with customizable parameters, risk controls, and backtesting capabilities.';

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
          
         

          // Use database-controlled version for all image URLs
           const imageLink = platform === 'google' 
  ? `https://ads.mpintellect.com/ad_${sym.id.toLowerCase()}_${style}_${type}_${size}.png`
  : `https://ads.mpintellect.com/ad_${sym.id.toLowerCase()}_${style}_${type}_${size}.png?v=${version}`;

          // Price logic - Facebook always free, Google can have paid
          let price, formattedPrice;
          if (platform === 'facebook') {
            price = '0.00';
            formattedPrice = 'Free';
          } else {
            // Google can have paid products
            price = isBot ? '50.00' : '5.00';
            formattedPrice = isBot ? '50.00 USD' : '5.00 USD';
          }
          
          // Size description
          const sizeDescriptions: Record<string, string> = {
            standard: 'Landscape 1200x628',
            square: 'Square 1080x1080',
            portrait: 'Portrait 1080x1350',
          };

          const styleDescriptions: Record<string, string> = {
            black: 'Black Gold',
            cyber: 'Neon Cyber'
          };

          // Platform-specific title and description
          let title, description;
          
          if (platform === 'facebook') {
            // Facebook: Educational, soft titles
            if (type === 'test') {
              title = `Learn ${sym.name} Position Sizing`;
            } else if (type === 'chat') {
              title = `Explore ${sym.name} Markets`;
            } else if (type === 'update') {
              title = `${sym.name} Market Review`;
            } else {
              title = `${sym.name} ${typeConfig[type].name}`;
            }
            
            // Use platform-specific description
            if (isBot) {
              description = botFbDescription.replace('{symbol}', sym.name);
            } else {
              description = typeConfig[type].fbDescription.replace('{symbol}', sym.name);
            }
            
            // Add educational disclaimer for Facebook
            description += ' For educational purposes only. Not financial advice.';
          } else {
            // Google: Professional, feature-focused titles
            if (isBot) {
              title = `${sym.name} Automated Trading Software`;
            } else if (type === 'test') {
              title = `${sym.name} Prop Firm Calculator Pro`;
            } else if (type === 'chat') {
              title = `${sym.name} AI Market Analysis`;
            } else if (type === 'update') {
              title = `${sym.name} Professional Market Data`;
            } else {
              title = `${sym.name} ${typeConfig[type].name}`;
            }
            
            // Use platform-specific description
            if (isBot) {
              description = botGoogleDescription.replace('{symbol}', sym.name);
            } else {
              description = typeConfig[type].googleDescription.replace('{symbol}', sym.name);
            }
          }

          const subtitle = `${styleDescriptions[style]} ${sizeDescriptions[size]}`;

          // Item category
          const itemCategory = isBot ? 'Trading Software' : 'Trading Tools';

          // Contextual keywords
          const keywords = `${sym.name},${typeConfig[type].name},${styleDescriptions[style]},${sizeDescriptions[size]},trading,education,market analysis,risk management`.toLowerCase();

          if (platform === 'facebook') {
            // Facebook-specific row - SAFE VERSION
            rows.push([
              prodId,                                           // id
              title,                                            // title
              description,                                      // description (educational)
              'available for order',                            // availability (safer than 'in stock')
              'refurbished',                                    // condition (safer for FB)
              price + ' USD',                                   // price (0.00 for FB)
              link,                                             // link
              imageLink,                                        // image
              'MPIntellect  ',                             // brand (Education-focused)
              'Software > Business & Productivity',             // google_product_category
              sym.category,                                     // custom_label_0
              typeConfig[type].category                         // custom_label_1
            ]);
          } else {
            // Google-specific row - PROFESSIONAL VERSION
            rows.push([
              prodId,                                           // ID
              '',                                               // ID2
              link,                                             // Final URL
              imageLink,                                        // Image URL
              title,                                            // Item title
              subtitle,                                         // Item subtitle
              description,                                      // Item description (professional)
              '',                                               // Item address
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

  // Assemble CSV
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