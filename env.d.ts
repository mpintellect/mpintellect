interface CloudflareEnv {
  DB: D1Database;
  // Facebook Ads monitoring dashboard (see SETUP_FACEBOOK_ADS.md)
  FB_ACCESS_TOKEN?: string;
  FB_AD_ACCOUNT_ID?: string;
  FB_APP_ID?: string;
  FB_APP_SECRET?: string;
  FB_GRAPH_API_VERSION?: string;
  FB_CONVERSION_ACTION_TYPES?: string;
  FB_DAILY_BUDGET_CAP?: string;
  FB_WEEKLY_BUDGET_CAP?: string;
  FB_CONVERSION_TARGET_DAILY?: string;
  FB_CONVERSION_TARGET_WEEKLY?: string;
}

declare module 'nodemailer';