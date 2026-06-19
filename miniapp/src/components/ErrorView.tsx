import { View, Text, Button } from '@tarojs/components';

interface Props {
  message: string;
  onRetry: () => void;
}

export default function ErrorView({ message, onRetry }: Props) {
  return (
    <View className="error-view">
      <Text className="error-icon">🌌</Text>
      <Text className="error-title">平行宇宙暂时失联</Text>
      <Text className="error-msg">{message}</Text>
      <Button className="btn-retry" onClick={onRetry}>
        再次尝试
      </Button>
    </View>
  );
}
