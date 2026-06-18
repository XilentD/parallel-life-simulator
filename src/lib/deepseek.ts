import { SYSTEM_PROMPT, buildUserPrompt } from './prompts';
import type { GenerationResult } from './types';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MODEL = 'deepseek-chat';

export async function generateStorylines(input: string): Promise<GenerationResult> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(input) },
      ],
      temperature: 0.85,
      max_tokens: 4096,
      top_p: 0.95,
      presence_penalty: 0.3,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from DeepSeek');

  // Strip potential markdown code fences
  const cleaned = content
    .replace(/^```json\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();

  return JSON.parse(cleaned) as GenerationResult;
}
