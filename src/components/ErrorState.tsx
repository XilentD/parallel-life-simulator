interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section className="w-full max-w-xl mx-auto mt-16 px-4">
      <div className="backdrop-blur-xl bg-red-500/[0.06] border border-red-500/[0.15]
                      rounded-2xl p-8 text-center space-y-4">
        <div className="text-4xl">🌌</div>
        <p className="text-lg text-white/70">平行宇宙暂时失联</p>
        <p className="text-sm text-white/40">{message}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15
                     text-white/80 hover:text-white transition-all duration-300
                     border border-white/10 hover:border-white/20"
        >
          再次尝试
        </button>
      </div>
    </section>
  );
}
