import type { CostEntry, CostScenario } from '../types';
import type { InterpretationLevel, SoilInterpretation } from '../types';
import { soilReferenceRanges } from '../data/soilReferenceData';

export function calculateTotalCost(entries: CostEntry[]): number {
  return entries.reduce((sum, entry) => sum + (entry.totalCost || 0), 0);
}

export function calculateCostByCategory(entries: CostEntry[]): Record<string, number> {
  return entries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + (entry.totalCost || 0);
    return acc;
  }, {} as Record<string, number>);
}

export function calculateCostDifference(currentCost: number, proposedCost: number): {
  difference: number;
  percentageDifference: number | null;
  isLower: boolean;
} {
  const difference = currentCost - proposedCost;
  const percentageDifference = currentCost > 0
    ? ((currentCost - proposedCost) / currentCost) * 100
    : null;
  return {
    difference,
    percentageDifference,
    isLower: proposedCost < currentCost,
  };
}

export function calculateRevenue(scenario: CostScenario): number | null {
  if (scenario.soldQty && scenario.sellingPrice) {
    return scenario.soldQty * scenario.sellingPrice;
  }
  return null;
}

export function calculateNetReturn(scenario: CostScenario): number | null {
  const revenue = calculateRevenue(scenario);
  if (revenue === null) return null;
  const totalCost = calculateTotalCost(scenario.entries);
  return revenue - totalCost;
}

export function interpretSoilParameter(
  key: string,
  value: number | undefined
): SoilInterpretation | null {
  if (value === undefined || value === null) return null;

  const ref = soilReferenceRanges[key];
  if (!ref) return null;

  let level: InterpretationLevel = 'pending';
  let label = 'Interpretation pending review';
  let description = '';
  let recommendation = '';

  for (const range of ref.ranges) {
    if (value >= range.min && value <= range.max) {
      level = range.level;
      label = range.label;
      description = range.description;
      recommendation = range.recommendation;
      break;
    }
  }

  return {
    parameter: ref.name,
    value,
    unit: ref.unit,
    level,
    label,
    description,
    recommendation,
    source: ref.source,
    reviewStatus: ref.reviewStatus,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
