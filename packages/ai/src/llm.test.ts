import { describe, it, expect } from 'vitest';
import { buildPrompt } from './prompt-builder';
import { executeExtractionMock } from './llm-client';

describe('LLM Prompt Builder', () => {
  it('truncates extremely long descriptions', () => {
    const longDesc = 'A'.repeat(5000);
    const { user } = buildPrompt({
      title: 'Short title',
      description: longDesc,
      schema: '{}'
    });
    
    expect(user.length).toBeLessThan(3000); // 2000 for desc + headers
    expect(user).toContain('[TRUNCATED]');
  });

  it('injects LOV constraints into prompt', () => {
    const { user } = buildPrompt({
      title: 'Valve',
      description: 'A valve.',
      schema: '{}',
      lovs: { 'Material': ['Brass', 'Steel'] }
    });

    expect(user).toContain('ALLOWED VALUES (LOV)');
    expect(user).toContain('- Material: [Brass, Steel]');
  });
});

describe('LLM Mock Client', () => {
  it('returns structured JSON', async () => {
    const res = await executeExtractionMock({
      title: 'Kitchen Faucet',
      description: 'A shiny faucet.',
      schema: '{}'
    });

    expect(res.parsed).toBeDefined();
    expect(res.parsed.Material).toBe('Brass');
    expect(typeof res.raw).toBe('string');
  });
});
