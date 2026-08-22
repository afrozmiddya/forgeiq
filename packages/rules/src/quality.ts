import { ValidationResult } from './types';

export interface QualityScoreInput {
  hasManufacturer: boolean;
  hasPartNumber: boolean;
  totalAttributes: number;
  attributesWithEvidence: number;
  validationResult: ValidationResult;
  averageConfidence: number; // 0 to 1
}

/**
 * Calculates the overall Quality Score for a product.
 * Formula:
 * - Identity Quality (30%): 15% for Manufacturer, 15% for Part Number.
 * - Attribute & Evidence Quality (30%): (attributesWithEvidence / max(totalAttributes, 1)) * 30
 * - Validation Quality (20%): 20 if valid, 0 if invalid
 * - Confidence Quality (20%): averageConfidence * 20
 * 
 * Total max score = 100
 */
export function calculateQualityScore(input: QualityScoreInput): number {
  let score = 0;

  // Identity Quality (30%)
  if (input.hasManufacturer) score += 15;
  if (input.hasPartNumber) score += 15;

  // Attribute Evidence Quality (30%)
  const attrRatio = input.totalAttributes > 0 
    ? (input.attributesWithEvidence / input.totalAttributes) 
    : 0;
  score += attrRatio * 30;

  // Validation Quality (20%)
  if (input.validationResult.isValid) {
    score += 20;
  }

  // Confidence Quality (20%)
  score += Math.max(0, Math.min(1, input.averageConfidence)) * 20;

  return Math.round(score);
}
