const PRESETS = [
  { id: 1, text: '如果当初我没离开北京', icon: '🏙️', hint: '事业·漂泊' },
  { id: 2, text: '如果当初我接受了那份工作', icon: '💼', hint: '选择·代价' },
  { id: 3, text: '如果当初我向TA表白了', icon: '💔', hint: '爱情·遗憾' },
  { id: 4, text: '如果当初我没有出国', icon: '✈️', hint: '异乡·归属' },
  { id: 5, text: '如果当初我选择了创业', icon: '🚀', hint: '冒险·安稳' },
];

interface PresetTemplatesProps {
  onSelect: (text: string) => void;
  disabled: boolean;
}

export default function PresetTemplates({
  onSelect,
  disabled,
}: PresetTemplatesProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {PRESETS.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onSelect(preset.text)}
          disabled={disabled}
          className="group relative px-4 py-2.5 rounded-xl border border-white/10 bg-white/5
                     backdrop-blur-sm text-sm text-white/70 hover:text-white
                     hover:bg-white/10 hover:border-white/20
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-300 hover:scale-[1.02]"
        >
          <span className="mr-1.5">{preset.icon}</span>
          <span className="hidden sm:inline">{preset.hint}</span>
          <span className="sm:hidden">{preset.hint.split('·')[0]}</span>
        </button>
      ))}
    </div>
  );
}
