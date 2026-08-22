import { GoogleGenAI, Type } from '@google/genai';
import { AIProvider } from './provider';
import { buildPrompt } from './prompt-builder';
import { executeExtractionMock } from './llm-client'; // Fallback mock

export class GeminiProvider implements AIProvider {
  private ai: GoogleGenAI;
  private model: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    this.ai = new GoogleGenAI({ apiKey: apiKey || 'mock' });
    this.model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  }

  async extractAttributes(title: string, description: string, schema: string, lovs?: Record<string, string[]>): Promise<any> {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('[GeminiProvider] No GEMINI_API_KEY found. Falling back to mock extraction.');
      const mockRes = await executeExtractionMock({ title, description, schema, lovs });
      return mockRes.parsed;
    }

    try {
      console.log(`[GeminiProvider] Extracting attributes using ${this.model}...`);
      const { system, user } = buildPrompt({ title, description, schema, lovs });
      
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          { role: 'user', parts: [{ text: user }] }
        ],
        config: {
          systemInstruction: system,
          responseMimeType: 'application/json',
          temperature: 0.1,
        }
      });
      
      const raw = response.text || '{}';
      return JSON.parse(raw);
    } catch (error: any) {
      console.error('[GeminiProvider] Error extracting attributes:', error.message);
      return null;
    }
  }

  async classifyTaxonomy(title: string, description: string): Promise<any> {
    // Implement taxonomy classification via Gemini
    throw new Error('Not implemented');
  }

  async normalizeProduct(title: string, description: string): Promise<any> {
    // Implement normalization
    throw new Error('Not implemented');
  }

  async analyzeEvidence(claim: string, evidenceText: string): Promise<any> {
    // Implement evidence analysis
    throw new Error('Not implemented');
  }
}
