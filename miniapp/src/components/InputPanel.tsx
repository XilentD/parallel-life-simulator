import { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import type { Gender } from '@/types';
import GenderPills from './GenderPills';
import PresetCards from './PresetCards';

interface Props {
  onGenerate: (input: string, gender: Gender) => void;
  loading: boolean;
}

export default function InputPanel({ onGenerate, loading }: Props) {
  const [input, setInput] = useState('');
  const [gender, setGender] = useState<Gender>(null);

  const canSubmit = input.trim().length >= 2 && !loading;

  const handleGenerate = () => {
    if (!canSubmit) return;
    onGenerate(input.trim(), gender);
  };

  const handlePreset = (text: string) => {
    setInput(text);
  };

  return (
    <View className="input-panel">
      {/* Title */}
      <View className="header">
        <Text className="title">平行人生模拟器</Text>
        <Text className="subtitle">
          如果当初做出不同的选择，现在的你会在哪里？
        </Text>
      </View>

      {/* Input card */}
      <View className="input-card">
        {/* Gender pills */}
        <GenderPills gender={gender} onChange={setGender} />

        {/* Textarea */}
        <Textarea
          className="textarea"
          value={input}
          onInput={(e) => setInput(e.detail.value)}
          placeholder='输入一个"如果当初..."'
          placeholderClass="placeholder"
          maxlength={200}
          autoHeight
          disabled={loading}
        />

        {/* Counter + Button */}
        <View className="input-footer">
          <Text className="counter">{input.length}/200</Text>
        </View>

        <Button
          className={`btn-generate ${canSubmit ? '' : 'disabled'}`}
          onClick={handleGenerate}
          disabled={!canSubmit}
          loading={loading}
        >
          {loading ? '正在穿越平行宇宙...' : '开启平行宇宙'}
        </Button>
      </View>

      {/* Presets */}
      <PresetCards onSelect={handlePreset} />
    </View>
  );
}
