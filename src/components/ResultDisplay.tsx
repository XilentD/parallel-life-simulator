'use client';

import type { GenerationResult } from '@/lib/types';
import TimelineCard from './TimelineCard';
import ShareButton from './ShareButton';
import ShareCard from './ShareCard';

interface ResultDisplayProps {
  data: GenerationResult;
  onReset: () => void;
  inputText: string;
}

export default function ResultDisplay({
  data,
  onReset,
  inputText,
}: ResultDisplayProps) {
  return (
    <section className="w-full max-w-5xl mx-auto mt-12 px-4 pb-24">
      {/* Section header */}
      <div className="text-center mb-8">
        <p className="text-sm text-white/40 mb-2">
          如果{" "}
          <span className="text-white/60">
            &ldquo;{inputText.slice(0, 40)}{inputText.length > 40 ? '...' : ''}&rdquo;
          </span>
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          三条平行人生，三种可能
        </h2>
      </div>

      {/* Three timeline cards */}
      {data.storylines.length === 0 ? (
        <p className="text-white/40 text-center mb-10">暂无结果，请重试</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {data.storylines.map((s, i) => (
            <TimelineCard key={`${s.id}-${i}`} storyline={s} index={i} />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onReset}
          className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10
                     text-white/60 hover:text-white/80
                     border border-white/[0.08] hover:border-white/[0.15]
                     transition-all duration-300 text-sm"
        >
          ← 再测一次
        </button>
        <ShareButton />
      </div>

      {/* Hidden share card (off-screen, for html2canvas capture) */}
      <ShareCard data={data} inputText={inputText} />
    </section>
  );
}
