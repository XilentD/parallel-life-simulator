'use client';

import { useState, useCallback } from 'react';
import type { GenerationResult } from '@/lib/types';

interface UseGenerateReturn {
  loading: boolean;
  error: string | null;
  result: GenerationResult | null;
  generate: (input: string) => Promise<void>;
  reset: () => void;
}

export function useGenerate(): UseGenerateReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const generate = useCallback(async (input: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || '生成失败');
      }

      setResult(data.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '未知错误');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { loading, error, result, generate, reset };
}
