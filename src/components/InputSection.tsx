import PresetTemplates from './PresetTemplates';

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  onPreset: (text: string) => void;
  loading: boolean;
  gender: string | null;
  onGenderChange: (g: string | null) => void;
}

const GENDER_OPTIONS = [
  { key: 'male', label: '男性', icon: '♂' },
  { key: 'female', label: '女性', icon: '♀' },
];

export default function InputSection({
  value,
  onChange,
  onGenerate,
  onPreset,
  loading,
  gender,
  onGenderChange,
}: InputSectionProps) {
  const canSubmit = value.trim() && !loading;

  return (
    <section className="w-full max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-white">
          平行人生模拟器
        </h1>
        <p className="text-lg text-white/50">
          如果当初做出不同的选择，现在的你会在哪里？
        </p>
      </div>

      {/* Input area */}
      <div
        className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08]
                     rounded-2xl p-6 space-y-4 shadow-[0_8px_40px_rgba(0,0,0,0.3)]
                     transition-shadow duration-500 focus-within:shadow-[0_8px_60px_rgba(99,102,241,0.15)]
                     focus-within:border-white/[0.15]"
      >
        {/* Gender pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/25 mr-0.5">我是</span>
          {GENDER_OPTIONS.map((opt) => {
            const active = gender === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => onGenderChange(active ? null : opt.key)}
                disabled={loading}
                aria-pressed={active}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300
                  ${active
                    ? 'bg-white/15 text-white border border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                    : 'bg-transparent text-white/35 border border-white/10 hover:text-white/60 hover:border-white/20'
                  }
                  disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                <span className="mr-1">{opt.icon}</span>
                {opt.label}
              </button>
            );
          })}
          <span className="text-xs text-white/20 ml-1 hidden sm:inline">
            选填，不选则默认中性视角
          </span>
        </div>

        <textarea
          aria-label="输入一个如果当初的假设"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (canSubmit) onGenerate();
            }
          }}
          placeholder='输入一个"如果当初..."，比如：如果当初我没离开北京...'
          rows={3}
          maxLength={200}
          disabled={loading}
          className="w-full bg-transparent text-white text-lg placeholder:text-white/25
                     resize-none outline-none disabled:opacity-40
                     leading-relaxed"
        />

        <div className="flex items-center justify-end">
          <span className="text-xs text-white/30 tabular-nums">
            {value.length}/200
          </span>
        </div>

        <button
          onClick={onGenerate}
          disabled={!canSubmit}
          className="w-full py-3.5 rounded-xl font-medium text-base
                     bg-gradient-to-r from-indigo-500 to-purple-500
                     hover:from-indigo-400 hover:to-purple-400
                     disabled:from-white/10 disabled:to-white/10
                     disabled:text-white/30 disabled:cursor-not-allowed
                     text-white shadow-[0_4px_20px_rgba(99,102,241,0.3)]
                     hover:shadow-[0_4px_30px_rgba(99,102,241,0.45)]
                     transition-all duration-300"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              正在穿越平行宇宙...
            </span>
          ) : (
            '开启平行宇宙'
          )}
        </button>
      </div>

      {/* Presets */}
      <div className="text-center space-y-3">
        <p className="text-xs text-white/30 uppercase tracking-widest">
          或者试试这些
        </p>
        <PresetTemplates onSelect={onPreset} disabled={loading} />
      </div>
    </section>
  );
}
