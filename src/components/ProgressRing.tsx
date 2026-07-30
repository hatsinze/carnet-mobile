import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, fonts } from '../theme/tokens';

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  value: number; // 0–100
  color: string;
  centerLabel: string;
  centerSubLabel?: string;
}

export function ProgressRing({ size = 120, strokeWidth = 10, value, color, centerLabel, centerSubLabel }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(value, 0), 100) / 100) * circumference;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={colors.ligne} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text style={styles.centerLabel}>{centerLabel}</Text>
      {centerSubLabel && <Text style={styles.centerSubLabel}>{centerSubLabel}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  centerLabel: { fontFamily: fonts.monoBold, fontSize: 26, color: colors.ardoise },
  centerSubLabel: { fontFamily: fonts.bodyMedium, fontSize: 11, color: colors.ardoiseMuted, marginTop: 2 },
});