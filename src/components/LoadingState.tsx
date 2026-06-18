export default function LoadingState() {
  return (
    <section className="w-full max-w-5xl mx-auto mt-16 px-4">
      <div className="text-center mb-10">
        <p className="text-xl text-white/60 animate-pulse">
          正在探寻平行宇宙中的你...
        </p>
        <p className="text-sm text-white/30 mt-2">这大约需要 10 秒</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06]
                       rounded-2xl p-6 space-y-5 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          >
            {/* Title skeleton */}
            <div className="h-7 bg-white/10 rounded-lg w-3/4" />
            {/* Summary skeleton */}
            <div className="h-4 bg-white/5 rounded w-full" />
            {/* Timeline skeleton */}
            <div className="space-y-3">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex gap-3">
                  <div className="h-6 w-14 bg-white/10 rounded" />
                  <div className="h-6 flex-1 bg-white/5 rounded" />
                </div>
              ))}
            </div>
            {/* Emotion curve skeleton */}
            <div className="h-20 bg-white/[0.03] rounded-lg" />
            {/* Snapshot skeleton */}
            <div className="space-y-2">
              <div className="h-3 bg-white/5 rounded w-full" />
              <div className="h-3 bg-white/5 rounded w-5/6" />
              <div className="h-3 bg-white/5 rounded w-4/6" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
