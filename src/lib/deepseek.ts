import { SYSTEM_PROMPT } from './prompts';
import type { GenerationResult } from './types';

const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL ?? 'https://api.deepseek.com/v1/chat/completions';
const MODEL = process.env.DEEPSEEK_MODEL ?? 'deepseek-chat';
const FETCH_TIMEOUT_MS = 90_000;

if (!process.env.DEEPSEEK_API_KEY) {
  console.error('DEEPSEEK_API_KEY is not set');
}

export async function generateStorylines(
  input: string,
  gender?: string | null
): Promise<GenerationResult> {
  const userPrompt = buildUserPrompt(input, gender);

  try {
    return await callDeepSeek(userPrompt, 0.85);
  } catch (firstError) {
    if (firstError instanceof SyntaxError) {
      console.warn('JSON parse error, retry 1/2 (temp=0.3)...');
      try {
        return await callDeepSeek(userPrompt, 0.3);
      } catch (e2) {
        console.warn('Retry 1 failed:', e2 instanceof Error ? e2.message : e2);
        console.warn('JSON parse error, retry 2/2 (temp=0.1)...');
        try {
          return await callDeepSeek(userPrompt, 0.1);
        } catch (e3) {
          console.error('All retries failed:', e3 instanceof Error ? e3.message : e3);
        }
      }
    }
    throw firstError;
  }
}

async function callDeepSeek(
  userPrompt: string,
  temperature: number
): Promise<GenerationResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
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
          { role: 'user', content: userPrompt },
        ],
        temperature,
        max_tokens: 8192,
        top_p: 0.95,
        presence_penalty: temperature > 0.5 ? 0.3 : 0.1,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const status = response.status;
      // Never expose API error body to client — it may contain credentials
      if (status === 401) {
        throw new Error('API authentication failed. Check server configuration.');
      }
      if (status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        throw new Error(`Rate limited.${retryAfter ? ` Retry after: ${retryAfter}s` : ''}`);
      }
      throw new Error(`AI service error (${status}). Please try again.`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from AI service');

    return cleanAndParse(content);
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildUserPrompt(input: string, gender?: string | null): string {
  let prompt = `假如${input}，请为我创作3条平行人生故事线。`;
  const genderHints: Record<string, string> = {
    male: '\n我是男性。',
    female: '\n我是女性。',
  };
  if (gender && genderHints[gender]) prompt += genderHints[gender];
  return prompt;
}

function cleanAndParse(content: string): GenerationResult {
  let raw = content.trim();
  raw = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

  const firstBrace = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    raw = raw.slice(firstBrace, lastBrace + 1);
  }

  const repaired = repairJSON(raw);

  try {
    const parsed = JSON.parse(repaired);
    // Runtime validation of expected structure
    if (!parsed.storylines || !Array.isArray(parsed.storylines) || parsed.storylines.length === 0) {
      throw new SyntaxError('Response missing valid storylines array');
    }
    return parsed as GenerationResult;
  } catch (e) {
    // Log the raw content for debugging (truncated to avoid log bloat)
    console.error('Parse failure. Raw content (first 500 chars):', raw.slice(0, 500));
    throw e;
  }
}

function repairJSON(raw: string): string {
  let s = raw;

  // 1. Remove trailing commas before } or ]
  s = s.replace(/,(\s*[}\]])/g, '$1');

  // 2. Walk character by character, tracking string state
  const chars: string[] = [];
  let inString = false;
  let escaped = false;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (escaped) {
      // Handle \uXXXX unicode escapes
      if (ch === 'u' && i + 4 < s.length) {
        chars.push('\\', 'u');
        chars.push(s[++i], s[++i], s[++i], s[++i]);
      } else {
        chars.push(ch);
      }
      escaped = false;
      continue;
    }

    if (ch === '\\' && inString) {
      chars.push(ch);
      escaped = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      chars.push(ch);
      continue;
    }

    // Inside a string: escape control characters
    if (inString) {
      if (ch === '\n') { chars.push('\\'); chars.push('n'); continue; }
      if (ch === '\r') { chars.push('\\'); chars.push('r'); continue; }
      if (ch === '\t') { chars.push('\\'); chars.push('t'); continue; }
    }

    chars.push(ch);
  }

  s = chars.join('');

  // 3. Count braces ONLY outside strings (use same state machine)
  let openBraces = 0;
  let closeBraces = 0;
  let openBrackets = 0;
  let closeBrackets = 0;
  let isInStr = false;
  let isEsc = false;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (isEsc) { isEsc = false; continue; }
    if (ch === '\\') { isEsc = true; continue; }
    if (ch === '"') { isInStr = !isInStr; continue; }
    if (isInStr) continue;
    if (ch === '{') openBraces++;
    if (ch === '}') closeBraces++;
    if (ch === '[') openBrackets++;
    if (ch === ']') closeBrackets++;
  }

  // Close any open strings and brackets
  if (inString) s += '"';
  for (let j = 0; j < openBrackets - closeBrackets; j++) s += ']';
  for (let j = 0; j < openBraces - closeBraces; j++) s += '}';

  return s;
}
