export function getDynamicRiskPercent({
  capital,
  confidence,
}: {
  capital: number;
  confidence: number;
}): number {
  let baseRisk = 0.5;

  // Capital tiers
  if (capital < 1000) baseRisk = 1.0;
  else if (capital < 5000) baseRisk = 1.5;
  else if (capital < 20000) baseRisk = 2.0;
  else baseRisk = 2.5;

  // Adjust based on confidence
  if (confidence <= 1) return baseRisk; // No increase
  if (confidence === 2) return baseRisk + 0.3;
  if (confidence === 3) return baseRisk + 0.5;
  if (confidence === 4) return baseRisk + 0.8;
  if (confidence >= 5) return baseRisk + 1.0;

  return baseRisk;
}