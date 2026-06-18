'use client';

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'parallel-life-usage';
const DAILY_LIMIT = 3;

interface UsageData {
  date: string;
  count: number;
}

function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadUsage(): UsageData {
  if (typeof window === 'undefined') return { date: '', count: 0 };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { date: getToday(), count: 0 };
    const parsed = JSON.parse(stored) as UsageData;
    if (parsed.date !== getToday()) return { date: getToday(), count: 0 };
    return parsed;
  } catch {
    return { date: getToday(), count: 0 };
  }
}

export function useDailyLimit() {
  const [usage, setUsage] = useState<UsageData>(loadUsage);

  const remaining = Math.max(0, DAILY_LIMIT - usage.count);
  const canGenerate = usage.count < DAILY_LIMIT;
  const limit = DAILY_LIMIT;

  const increment = useCallback(() => {
    const today = getToday();
    setUsage((prev) => {
      const date = prev.date === today ? prev.date : today;
      const count = prev.date === today ? prev.count + 1 : 1;
      const newUsage = { date, count };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
      } catch { /* ignore */ }
      return newUsage;
    });
  }, []);

  return { remaining, canGenerate, limit, usageCount: usage.count, increment };
}
