import * as cheerio from 'cheerio';

export interface ScrapeResult {
  manufacturer: string;
  partNumber: string;
  success: boolean;
  rawText: string | null;
  sourceUrl: string | null;
  sourceType: string | null;
  confidence: number;
  error?: string;
}

export async function fetchSpecs(manufacturer: string, partNumber: string): Promise<ScrapeResult> {
  console.log(`[Evidence Retrieval] Fetching real evidence for ${manufacturer} ${partNumber}...`);
  
  try {
    const query = encodeURIComponent(`${manufacturer} ${partNumber} specifications`);
    const searchUrl = `https://html.duckduckgo.com/html/?q=${query}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`Search failed with status ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    // DuckDuckGo HTML search results
    const firstResult = $('.result__snippet').first().text().trim();
    const firstLink = $('.result__url').first().attr('href');

    if (firstResult && firstResult.length > 20) {
      return {
        manufacturer,
        partNumber,
        success: true,
        rawText: firstResult,
        sourceUrl: firstLink ? `https://${firstLink.trim()}` : searchUrl,
        sourceType: 'Search Engine Result',
        confidence: 0.85 // High confidence for search result
      };
    } else {
      throw new Error('No sufficient text snippet found in search results.');
    }

  } catch (error: any) {
    console.error(`[Evidence Retrieval] Failed for ${manufacturer} ${partNumber}:`, error.message);
    
    return {
      manufacturer,
      partNumber,
      success: false,
      rawText: null,
      sourceUrl: null,
      sourceType: null,
      confidence: 0,
      error: error.message || 'Failed to retrieve evidence'
    };
  }
}
