import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';

type Status = 'positive' | 'alert' | 'neutral';

interface StatusBadgeProps {
  label: string;
  status: Status;
}

const statusColors: Record<Status, string> = {
  positive: colors.sauge,
  alert: colors.brique,
  neutral: colors.ardoiseMuted,
};

export function StatusBadge({ label, status }: StatusBadgeProps) {
  const dotColor = statusColors[status];

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.brume,
    borderRadius: radius.lg,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.sm },
  label: { fontSize: 13, fontWeight: '500', color: colors.ardoise },
});