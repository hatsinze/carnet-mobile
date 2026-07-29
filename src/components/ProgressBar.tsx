import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  trackColor?: string;
  height?: number;
}

export function ProgressBar({ value, color = colors.encre, trackColor = colors.ligne, height = 8 }: ProgressBarProps) {
  return (
    <View style={[styles.track, { backgroundColor: trackColor, height, borderRadius: height / 2 }]}>
      <View style={[styles.fill, { width: `${Math.min(Math.max(value, 0), 100)}%`, backgroundColor: color, borderRadius: height / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden' },
  fill: { height: '100%' },
});