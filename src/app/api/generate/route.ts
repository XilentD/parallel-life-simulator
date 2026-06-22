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
    .refine((val) => typeof val === 'string' && !isPromptInjection(val), '输入包含不安全内容'),
  gender: z.enum(['male', 'female']).nullable().optional(),
});

// Detect prompt injection — use [\\s\\S] (matches everything including newlines) instead of .
function isPromptInjection(input: string): boolean {
  const patterns = [
    /忽略[\s\S]{0,10}(指令|提示|规则|设定|角色)/i,
    /(ignore|forget|discard)[\s\S]{0,20}(instruction|prompt|rule|system)/i,
    /输出[\s\S]{0,5}(系统提示|提示词|指令|规则)/i,
    /(print|output|show|reveal)[\s\S]{0,10}(system|prompt|instruction)/i,
    /你是一个[\s\S]{0,20}(而不是|不再是|现在是)/i,
    /(new|新)[\s\S]{0,10}(instruction|指令|规则|设定)/i,
    /DAN\b|jailbreak|越狱/i,
    /\[system\]|\[prompt\]|\[指令\]/i,
    /<\|[\s\S]*\|>/i,
  ];
  return patterns.some((p) => p.test(input));
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    // Validate Content-Type
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { success: false, error: '请使用 JSON 格式发送请求' },
        { status: 415, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const parsed = InputSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      // Map field paths to user-friendly messages
      const fieldErrors: Record<string, string> = {
        input: '请输入有效的问题描述',
      };
      const msg = issue.path.length > 0
        ? (fieldErrors[issue.path[0] as string] || issue.message)
        : issue.message;
      return NextResponse.json(
        { success: false, error: msg },
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
    // Never expose raw error details to client — use controlled messages
    const msg = error instanceof Error ? error.message : '生成失败，请稍后重试';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500, headers: corsHeaders }
    );
  }
}
