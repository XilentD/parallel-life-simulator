import { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import InputPanel from '@/components/InputPanel';
import LoadingView from '@/components/LoadingView';
import ErrorView from '@/components/ErrorView';
import TimelineCard from '@/components/TimelineCard';
import SharePanel from '@/components/SharePanel';
import { generateStorylines } from '@/utils/api';
import type { Gender, GenerationResult } from '@/types';

type Phase = 'input' | 'loading' | 'result' | 'error';

export default function Index() {
  const [phase, setPhase] = useState<Phase>('input');
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async (input: string, gender: Gender) => {
    setInputText(input);
    setPhase('loading');
    setError('');

    try {
      const res = await generateStorylines(input, gender);
      if (res.success && res.data) {
        setResult(res.data);
        setPhase('result');
      } else {
        setError(res.error || '生成失败');
        setPhase('error');
      }
    } catch (e: any) {
      setError(e.message || '网络请求失败');
      setPhase('error');
    }
  };

  const handleRetry = () => {
    setPhase('input');
  };

  const handleReset = () => {
    setPhase('input');
    setResult(null);
    setError('');
  };

  return (
    <View className="index">
      {/* Input phase */}
      {phase === 'input' && (
        <InputPanel onGenerate={handleGenerate} loading={false} />
      )}

      {/* Loading phase */}
      {phase === 'loading' && (
        <>
          <InputPanel onGenerate={handleGenerate} loading />
          <LoadingView />
        </>
      )}

      {/* Error phase */}
      {phase === 'error' && (
        <>
          <InputPanel onGenerate={handleGenerate} loading={false} />
          <ErrorView message={error} onRetry={handleRetry} />
        </>
      )}

      {/* Result phase */}
      {phase === 'result' && result && (
        <ScrollView className="result-scroll" scrollY>
          <View className="result-header">
            <Text className="back-link" onClick={handleReset}>
              ← 回到首页
            </Text>
          </View>

          <View className="result-container">
            <Text className="result-title">
              如果「{inputText.slice(0, 40)}{inputText.length > 40 ? '...' : ''}」
            </Text>
            <Text className="result-subtitle">三条平行人生，三种可能</Text>

            {result.storylines.map((s, i) => (
              <TimelineCard key={s.id} storyline={s} index={i} />
            ))}

            <SharePanel data={result} inputText={inputText} />

            <View className="btn-reset-wrap">
              <Text className="btn-reset" onClick={handleReset}>
                ← 再测一次
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Footer */}
      {phase === 'input' && (
        <View className="footer">
          <Text>这不是预言，这是一场思想实验。</Text>
        </View>
      )}
    </View>
  );
}
