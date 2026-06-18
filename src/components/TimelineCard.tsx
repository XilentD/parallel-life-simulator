import type { Storyline } from '@/lib/types';
import EmotionCurve from './EmotionCurve';

interface TimelineCardProps {
  storyline: Storyline;
  index: number;
}

const PALETTES = [
  { accent: 'from-amber-400 to-orange-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-300', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.1)]' },
  { accent: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-300', glow: 'shadow-[0_0_20px_rgba(52,211,153,0.1)]' },
  { accent: 'from-violet-400 to-purple-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-300', glow: 'shadow-[0_0_20px_rgba(167,139,250,0.1)]' },
];

const LABELS = ['平行线 A', '平行线 B', '平行线 C'];

export default function TimelineCard({ storyline, index }: TimelineCardProps) {
  const palette = PALETTES[index % PALETTES.length];

  return (
    <article
      className={`backdrop-blur-xl bg-white/[0.03] border ${palette.border}
                  rounded-2xl p-6 flex flex-col gap-5 ${palette.glow}
                  transition-all duration-500 hover:bg-white/[0.05]`}
    >
      {/* Label */}
      <span className={`text-xs font-medium uppercase tracking-widest ${palette.text}`}>
        {LABELS[index]}
      </span>

      {/* Title */}
      <h3 className="text-xl font-serif font-bold text-white leading-snug">
        {storyline.title}
      </h3>

      {/* Timeline events */}
      <div className="space-y-3">
        {storyline.events.map((event, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="shrink-0 text-xs font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded">
              {event.year}
            </span>
            <p className="text-sm text-white/70 leading-relaxed">
              {event.description}
            </p>
          </div>
        ))}
      </div>

      {/* Emotion curve */}
      <div className="pt-1">
        <p className="text-[10px] text-white/25 uppercase tracking-widest mb-2">
          情感轨迹
        </p>
        <EmotionCurve data={storyline.emotionCurve} />
      </div>

      {/* Snapshot */}
      <div className={`${palette.bg} rounded-xl p-4 border ${palette.border}`}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1.5">
          此刻 · {new Date().getFullYear()}年
        </p>
        <p className="text-sm text-white/80 leading-relaxed">
          {storyline.snapshot}
        </p>
      </div>

      {/* Summary */}
      <div className="pt-1 border-t border-white/[0.06]">
        <p className="text-sm text-white/50 italic leading-relaxed">
          「{storyline.summary}」
        </p>
      </div>
    </article>
  );
}
