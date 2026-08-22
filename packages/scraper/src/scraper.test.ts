import { describe, it, expect } from 'vitest';
import { fetchSpecs } from './browser';
import { parseScrapedPayload } from './parser';

describe('Scraper & Parser Integration', () => {
  it('mocks fetching and parsing DEWALT specs', async () => {
    const result = await fetchSpecs('DEWALT', 'DCD708C2');
    
    expect(result.success).toBe(true);
    expect(result.rawText).toContain('DEWALT Product Specifications');

    const parsed = parseScrapedPayload(result);
    expect(parsed['Voltage']).toBe('20V MAX');
    expect(parsed['Chuck Size']).toBe('1/2 in');
    expect(parsed['Max RPM']).toBe('2000 rpm');
  });

  it('fails gracefully for unknown manufacturers', async () => {
    const result = await fetchSpecs('UNKNOWN_BRAND', '12345');
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();

    const parsed = parseScrapedPayload(result);
    expect(Object.keys(parsed).length).toBe(0); // Empty object
  });
});
