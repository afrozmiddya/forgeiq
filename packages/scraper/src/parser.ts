import { ScrapeResult } from './browser';

/**
 * Extracts key-value pairs from raw scraped text payload using basic heuristics.
 * This acts as a pre-processor before sending the text to the LLM orchestration layer.
 */
export function parseScrapedPayload(result: ScrapeResult): Record<string, string> {
  if (!result.success || !result.rawText) {
    return {};
  }

  const extracted: Record<string, string> = {};
  const lines = result.rawText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  for (const line of lines) {
    // Look for generic key: value patterns (e.g., "Voltage: 20V")
    const match = line.match(/^([a-zA-Z\s]+):\s*(.+)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim();
      extracted[key] = val;
    }
  }

  return extracted;
}
