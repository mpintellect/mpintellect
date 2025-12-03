import { google } from 'googleapis';

const ALL_PSEO_TYPES = [
  'analysis', 'trade', 'trend', 'forecast', 
  'volatility', 'momentum', 'zones', 'calculator', 'indicator'
];

export async function requestIndexingForSymbol(symbol: string, pagesToPing?: string[]) {
  try {
    const cleanSym = symbol.toLowerCase().replace('/', '-'); 
    const baseUrl = 'https://mzprimer.com'; // Make sure this matches your real domain EXACTLY

    const email = process.env.FIREBASE_CLIENT_EMAIL;
    const rawKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!email || !rawKey) throw new Error("Missing Credentials");

    const key = rawKey.replace(/\\n/g, '\n').replace(/"/g, '');

    const jwtClient = new google.auth.JWT({
      email: email,
      key: key,
      scopes: ["https://www.googleapis.com/auth/indexing"],
    });

    await jwtClient.authorize();
    const accessToken = jwtClient.credentials.access_token;

    if (!accessToken) throw new Error("Google Auth Token generation failed");

    const types = pagesToPing || ALL_PSEO_TYPES;

    const promises = types.map(async (type) => {
        const pageUrl = `${baseUrl}/${type}/${cleanSym}`;
        
        const response = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                url: pageUrl,
                type: "URL_UPDATED"
            })
        });

        // --- THE FIX: Detailed Logging ---
        if (!response.ok) {
            const errorBody = await response.json();
            const errorMsg = errorBody?.error?.message || "Unknown Error";
            console.error(`❌ GOOGLE REJECTED (${type}/${cleanSym}): [${response.status}] ${errorMsg}`);
        } else {
            console.log(`✅ INDEXED: ${type}/${cleanSym}`);
        }
        return response.status;
    });

    await Promise.all(promises);
    return { success: true };

  } catch (error: any) {
    console.error("INDEXING SCRIPT CRASH:", error.message);
    throw new Error(error.message);
  }
}