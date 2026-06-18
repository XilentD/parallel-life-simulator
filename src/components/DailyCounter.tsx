interface DailyCounterProps {
  used: number;
  limit: number;
}

export default function DailyCounter({ used, limit }: DailyCounterProps) {
  const remaining = Math.max(0, limit - used);

  return (
    <div className="flex items-center gap-2 text-sm text-white/50">
      <span>今日剩余</span>
      <span className="flex gap-1">
        {Array.from({ length: limit }).map((_, i) => (
          <span
            key={i}
            className={`inline-block w-2 h-2 rounded-full transition-colors duration-300 ${
              i < remaining ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' : 'bg-white/20'
            }`}
          />
        ))}
      </span>
      <span className="tabular-nums">
        {remaining}/{limit}
      </span>
    </div>
  );
}
