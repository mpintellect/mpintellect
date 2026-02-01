import { SymbolData } from "../fetchData";

export const generateForecastReport = (data: SymbolData) => {
  const sym = data.symbol.toUpperCase();
  const summary = data.summary || "";
  
  // 1. SMART EXTRACTION
  // We scan the summary text for specific markers
  
  // Find "Action: **BUY**" or "Action: SELL"
  const actionMatch = summary.match(/Action:\s*(?:.+?\*\*)?([A-Z]+)/i);
  const action = actionMatch ? actionMatch[1].toUpperCase() : "WATCH";

  // Find "Risk Level: Low Risk High Confidence"
  const riskMatch = summary.match(/Risk Level:\s*(.*?)(?:\n|$)/);
  const riskLevel = riskMatch ? riskMatch[1].trim() : "Moderate Risk";

  // Find "Market Context: Range Bound"
  const contextMatch = summary.match(/Market Context:\s*(.*?)(?:\n|$)/);
  const marketContext = contextMatch ? contextMatch[1].trim() : "Consolidated";

  // Data Accuracy
  const score = data.analysis_accuracy || 0;
  const isHighConfidence = score > 80;

  // 2. FORMATTING HELPERS
  // Clean up emoji artifacts if they got captured
  const cleanRisk = riskLevel.replace(/[^\w\s]/gi, '').trim(); 

  // Dynamic bias text
  let biasText = "remains neutral, awaiting a breakout trigger.";
  if (action === "BUY") biasText = "indicates potential for upward expansion (Bullish Bias).";
  if (action === "SELL") biasText = "suggests potential downside rejection (Bearish Bias).";

  return {
    // 1. GOOGLE TITLE
    title: `${sym} Forecast: ${action} Signal Detected (${score.toFixed(0)}% Accuracy)`,
    
    // 2. SERP DESCRIPTION
    metaDesc: `AI Price Prediction for ${sym}. Forecast Decision: ${action}. Market State: ${marketContext}. Probability Score: ${score}%. Institutional entry targets inside.`,

    // 3. EXECUTIVE SUMMARY BLOCK
    executive: `
      Our Predictive Model has finalized a directional bias of **${action}** for ${sym}. 
      The broader market context is currently identified as **"${marketContext}"**.
      This forecast carries a statistical confidence rating of ${score.toFixed(1)}%, based on the confluence of momentum, trend structure, and liquidity zones.
    `,

    // 4. RISK PROFILE BLOCK
    risk_analysis: `
      Risk Assessment: **${cleanRisk}**. 
      The component quality check reveals strong validation from ${data.component_quality?.zones ?? 0}% Zone Integrity and ${data.component_quality?.momentum ?? 0}% Momentum Flow. 
      ${isHighConfidence ? "This high confluence suggests aggressive entry tactics are permissible." : "Given the moderate confidence, reduced position sizing is recommended."}
    `,

    // 5. FINAL CONCLUSION BLOCK
    conclusion: `
      Algorithm Verdict: The confluence of data points ${biasText}
      Active Setup: Look for **${action === 'BUY' ? 'Demand Zone' : 'Supply Zone'}** validation before execution.
    `
  };
};