import { SYSTEM_PROMPT } from './prompts';

export interface PromptContext {
  title: string;
  description: string;
  schema: string;
  lovs?: Record<string, string[]>;
}

/**
 * Truncates text to prevent context window overflow.
 */
function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...[TRUNCATED]';
}

/**
 * Builds the complete prompt to be sent to the LLM.
 */
export function buildPrompt(context: PromptContext): { system: string, user: string } {
  const safeTitle = truncateString(context.title, 500);
  const safeDesc = truncateString(context.description, 2000);
  
  let userPrompt = `PRODUCT TITLE:\n${safeTitle}\n\nPRODUCT DESCRIPTION:\n${safeDesc}\n\n`;
  
  userPrompt += `TARGET SCHEMA:\n${context.schema}\n\n`;

  if (context.lovs) {
    userPrompt += `ALLOWED VALUES (LOV):\n`;
    for (const [key, values] of Object.entries(context.lovs)) {
      userPrompt += `- ${key}: [${values.join(', ')}]\n`;
    }
  }

  return {
    system: SYSTEM_PROMPT,
    user: userPrompt
  };
}
