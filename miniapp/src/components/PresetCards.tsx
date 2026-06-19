import { View, ScrollView, Text } from '@tarojs/components';

const PRESETS = [
  { id: 1, text: '如果当初我没离开北京', icon: '🏙️' },
  { id: 2, text: '如果当初我接受了那份工作', icon: '💼' },
  { id: 3, text: '如果当初我向TA表白了', icon: '💔' },
  { id: 4, text: '如果当初我没有出国', icon: '✈️' },
  { id: 5, text: '如果当初我选择了创业', icon: '🚀' },
];

interface Props {
  onSelect: (text: string) => void;
}

export default function PresetCards({ onSelect }: Props) {
  return (
    <View className="presets">
      <Text className="presets-title">或者试试这些</Text>
      <ScrollView className="presets-scroll" scrollX showScrollbar={false}>
        {PRESETS.map((p) => (
          <View
            key={p.id}
            className="preset-card"
            onClick={() => onSelect(p.text)}
          >
            <Text className="preset-icon">{p.icon}</Text>
            <Text className="preset-text">{p.text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
