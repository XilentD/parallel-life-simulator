'use client';

import { useState, useCallback, useRef } from 'react';
import type { GenerationResult } from '@/lib/types';

interface UseGenerateReturn {
  loading: boolean;
  error: string | null;
  result: GenerationResult | null;
  generate: (input: string, gender?: string | null) => Promise<void>;
  reset: () => void;
}

export function useGenerate(): UseGenerateReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (input: string, gender?: string | null) => {
    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, gender }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (!data || typeof data !== 'object') {
        throw new Error('服务器返回了意外的响应格式');
      }
      if (!data.success) {
        throw new Error(data.error || '生成失败');
      }

      setResult(data.data);
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return;
      setError(e instanceof Error ? e.message : '未知错误');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { loading, error, result, generate, reset };
}
