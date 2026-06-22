import { NextRequest, NextResponse } from 'next/server';
import { generateStorylines } from '@/lib/deepseek';
import { z } from 'zod';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const InputSchema = z.object({
  input: z
    .string()
    .min(2, '请输入至少2个字符')
    .max(200, '输入不能超过200字符')
    .refine((val) => !isPromptInjection(val), '输入包含不安全内容'),
  gender: z.enum(['male', 'female']).nullable().optional(),
});

// Detect common prompt injection / jailbreak patterns
function isPromptInjection(input: string): boolean {
  const patterns = [
    /忽略.{0,10}(指令|提示|规则|设定|角色)/i,
    /(ignore|forget|discard).{0,20}(instruction|prompt|rule|system)/i,
    /输出.{0,5}(系统提示|提示词|指令|规则)/i,
    /(print|output|show|reveal).{0,10}(system|prompt|instruction)/i,
    /你是一个.{0,20}(而不是|不再是|现在是)/i,
    /(new|新).{0,5}(instruction|指令|规则|设定)/i,
    /DAN\s|jailbreak|越狱/i,
    /\[system\]|\[prompt\]|\[指令\]/i,
    /<\|.*\|>/i,
  ];
  return patterns.some((p) => p.test(input));
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = InputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await generateStorylines(parsed.data.input, parsed.data.gender);
    return NextResponse.json(
      { success: true, data: result },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Generate API error:', error);
    const message =
      error instanceof Error ? error.message : '生成失败，请稍后重试';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500, headers: corsHeaders }
    );
  }
}
