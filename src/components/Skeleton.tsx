import { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { useTheme } from '../features/theme/ThemeContext';

interface SkeletonProps {
  width: number | `${number}%`;
  height: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width, height, radius = 8, style }: SkeletonProps) {
  const { isDark } = useTheme();
  const translateX = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(translateX, { toValue: 1, duration: 1100, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const baseColor = isDark ? '#2A2A2E' : '#EAEAEA';
  const highlightColor = isDark ? '#3A3A3E' : '#F5F5F5';

  return (
    <View style={[{ width, height, borderRadius: radius, backgroundColor: baseColor, overflow: 'hidden' }, style]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: highlightColor,
            transform: [{ translateX: translateX.interpolate({ inputRange: [-1, 1], outputRange: [-120, 120] }) }],
            opacity: 0.9,
          },
        ]}
      />
    </View>
  );
}

export function CommuniqueCardSkeleton() {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.blanc, borderColor: colors.ligne }]}>
      <Skeleton width={44} height={44} radius={12} />
      <View style={{ flex: 1, marginLeft: 12, gap: 8 }}>
        <Skeleton width="70%" height={14} />
        <Skeleton width="90%" height={12} />
        <Skeleton width="40%" height={10} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10 },
});