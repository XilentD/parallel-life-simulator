import { SYSTEM_PROMPT } from './prompts';
import type { GenerationResult } from './types';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MODEL = 'deepseek-chat';

export async function generateStorylines(
  input: string,
  gender?: string | null
): Promise<GenerationResult> {
  const userPrompt = buildUserPrompt(input, gender);

  // First attempt: normal generation
  try {
    return await callDeepSeek(userPrompt, 0.85);
  } catch (firstError) {
    const isJsonError =
      firstError instanceof Error &&
      (firstError.message.includes('JSON') ||
        firstError.message.includes('parse') ||
        firstError.message.includes('position') ||
        firstError.message.includes('token'));

    if (isJsonError) {
      // Retry 1: lower temperature
      console.warn('JSON error, retry 1/2 (temp=0.3)...');
      try {
        return await callDeepSeek(userPrompt, 0.3);
      } catch {
        // Retry 2: even lower, shorter output
        console.warn('JSON error, retry 2/2 (temp=0.1)...');
        try {
          return await callDeepSeek(userPrompt, 0.1);
        } catch {
          // All attempts failed
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
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from DeepSeek');

  const cleaned = cleanAndParse(content);
  return cleaned;
}

function buildUserPrompt(input: string, gender?: string | null): string {
  let prompt = `假如${input}，请为我创作3条平行人生故事线。`;
  if (gender === 'male') prompt += '\n我是男性。';
  if (gender === 'female') prompt += '\n我是女性。';
  return prompt;
}

function cleanAndParse(content: string): GenerationResult {
  // Strip markdown code fences and any non-JSON wrapper text
  let raw = content.trim();

  // Remove ```json fences
  raw = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

  // Extract JSON object: find the outermost { ... }
  const firstBrace = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    raw = raw.slice(firstBrace, lastBrace + 1);
  }

  // Apply repairs BEFORE first parse attempt
  const repaired = repairJSON(raw);

  return JSON.parse(repaired) as GenerationResult;
}

/**
 * Repair common LLM JSON issues:
 * - Trailing commas before } or ]
 * - Unescaped control characters inside string values
 * - Unescaped double quotes within string values (e.g. dialogue)
 */
function repairJSON(raw: string): string {
  let s = raw;

  // 1. Remove trailing commas before } or ]
  s = s.replace(/,(\s*[}\]])/g, '$1');

  // 2. Escape control characters within JSON strings
  // We walk through the string char by char, tracking whether we're inside a string
  const chars: string[] = [];
  let inString = false;
  let escaped = false;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (escaped) {
      chars.push(ch);
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

  // 3. If the JSON is truncated (missing closing brackets), try to close it
  const openBraces = (s.match(/{/g) || []).length;
  const closeBraces = (s.match(/}/g) || []).length;
  const openBrackets = (s.match(/\[/g) || []).length;
  const closeBrackets = (s.match(/\]/g) || []).length;

  // Close any open strings
  if (inString) s += '"';

  // Close any open arrays/objects
  for (let j = 0; j < openBrackets - closeBrackets; j++) s += ']';
  for (let j = 0; j < openBraces - closeBraces; j++) s += '}';

  return s;
}
