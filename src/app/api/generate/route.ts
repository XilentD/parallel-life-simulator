import { NextResponse } from 'next/server';
import { generateStorylines } from '@/lib/deepseek';
import { z } from 'zod';

const InputSchema = z.object({
  input: z
    .string()
    .min(2, '请输入至少2个字符')
    .max(200, '输入不能超过200字符'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = InputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const result = await generateStorylines(parsed.data.input);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Generate API error:', error);
    const message =
      error instanceof Error ? error.message : '生成失败，请稍后重试';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
