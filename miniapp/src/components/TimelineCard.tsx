import { View, Text } from '@tarojs/components';
import type { Storyline } from '@/types';
import EmotionCurve from './EmotionCurve';

interface Props {
  storyline: Storyline;
  index: number;
}

const PALETTES = [
  { text: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
  { text: '#34d399', bg: 'rgba(52,211,153,0.08)' },
  { text: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
];

const LABELS = ['平行线 A', '平行线 B', '平行线 C'];

export default function TimelineCard({ storyline, index }: Props) {
  const palette = PALETTES[index % PALETTES.length];

  return (
    <View className="timeline-card">
      <Text className="tc-label" style={{ color: palette.text }}>
        {LABELS[index]}
      </Text>

      <Text className="tc-title">{storyline.title}</Text>

      {/* Events */}
      <View className="tc-events">
        {storyline.events.map((e, i) => (
          <View key={i} className="tc-event">
            <Text className="tc-year">{e.year}</Text>
            <Text className="tc-desc">{e.description}</Text>
          </View>
        ))}
      </View>

      {/* Emotion curve */}
      <View className="tc-curve">
        <Text className="tc-section-label">情感轨迹</Text>
        <EmotionCurve data={storyline.emotionCurve} />
      </View>

      {/* Snapshot */}
      <View className="tc-snapshot" style={{ backgroundColor: palette.bg }}>
        <Text className="tc-section-label">此刻 · 2026年</Text>
        <Text className="tc-snapshot-text">{storyline.snapshot}</Text>
      </View>

      {/* Summary */}
      <View className="tc-summary">
        <Text className="tc-summary-text">「{storyline.summary}」</Text>
      </View>
    </View>
  );
}
