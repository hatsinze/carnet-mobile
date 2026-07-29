import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

interface AvatarProps {
  name: string;
  size?: number;
}

export function Avatar({ name, size = 56 }: AvatarProps) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { backgroundColor: colors.encre, justifyContent: 'center', alignItems: 'center' },
  initials: { color: colors.blanc, fontWeight: '700' },
});