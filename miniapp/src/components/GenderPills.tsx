import { View, Text } from '@tarojs/components';
import type { Gender } from '@/types';

interface Props {
  gender: Gender;
  onChange: (g: Gender) => void;
}

const OPTIONS = [
  { key: 'male', label: '男性', icon: '♂' },
  { key: 'female', label: '女性', icon: '♀' },
] as const;

export default function GenderPills({ gender, onChange }: Props) {
  const handleTap = (key: string) => {
    onChange(gender === key ? null : (key as 'male' | 'female'));
  };

  return (
    <View className="gender-pills">
      <Text className="label">我是</Text>
      {OPTIONS.map((opt) => {
        const active = gender === opt.key;
        return (
          <View
            key={opt.key}
            className={`pill ${active ? 'active' : ''}`}
            onClick={() => handleTap(opt.key)}
          >
            <Text>{opt.icon} </Text>
            <Text>{opt.label}</Text>
          </View>
        );
      })}
      <Text className="hint">选填</Text>
    </View>
  );
}
