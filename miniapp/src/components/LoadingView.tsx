import { View, Text } from '@tarojs/components';

export default function LoadingView() {
  return (
    <View className="loading-view">
      <Text className="loading-title">正在探寻平行宇宙中的你...</Text>
      <Text className="loading-sub">这大约需要 10 秒</Text>
      {[1, 2, 3].map((i) => (
        <View key={i} className="skeleton-card" style={{ animationDelay: `${i * 0.2}s` }}>
          <View className="skeleton-line w-60" />
          <View className="skeleton-line w-40" />
          <View className="skeleton-line w-80" />
          <View className="skeleton-line w-70" />
          <View className="skeleton-line w-50" />
        </View>
      ))}
    </View>
  );
}
