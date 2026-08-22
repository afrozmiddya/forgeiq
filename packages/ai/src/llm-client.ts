import { PromptContext, buildPrompt } from './prompt-builder';
import OpenAI from 'openai';
import { GeminiProvider } from './gemini';

export interface LLMResponse {
  raw: string;
  parsed: any | null;
  error?: string;
  confidence?: number;
}

const geminiProvider = new GeminiProvider();

export async function executeExtraction(context: PromptContext): Promise<LLMResponse> {
  const parsed = await geminiProvider.extractAttributes(
    context.title, 
    context.description, 
    context.schema, 
    context.lovs
  );

  return {
    raw: JSON.stringify(parsed),
    parsed: parsed,
    confidence: parsed ? 0.95 : 0 // Gemini doesn't return confidence directly yet
  };
}

/**
 * Mock LLM Client that simulates returning structured JSON.
 * Clearly labeled as a mock per Rule 6.
 */
export async function executeExtractionMock(context: PromptContext): Promise<LLMResponse> {
  console.log('[LLM Client] Simulating extraction (MOCK)...');
  
  await new Promise(res => setTimeout(res, 600));

  let mockPayload: any = {};

  if (userText(context).includes('faucet') || userText(context).includes('delta')) {
    mockPayload = {
      Part_Desc: context.title,
      Material: 'Brass',
      LENGTH: 12,
      LENGTH_UOM: 'in',
      Color: context.description.includes('Pink') ? 'Neon Pink' : 'Chrome'
    };
  } else {
    mockPayload = {
      Part_Desc: context.title,
      Voltage: '20',
      VOLTAGE_UOM: 'V',
      Weight: 1.15,
      WEIGHT_UOM: 'kg',
      Chuck_Size: 13,
      CHUCK_SIZE_UOM: 'mm'
    };
  }

  const rawJsonString = JSON.stringify(mockPayload, null, 2);

  return {
    raw: rawJsonString,
    parsed: mockPayload,
    confidence: 0.85
  };
}

function userText(ctx: PromptContext) {
  return `${ctx.title} ${ctx.description}`.toLowerCase();
}
