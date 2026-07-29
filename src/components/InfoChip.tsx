import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/tokens';

interface InfoChipProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  tint?: string;
}

export function InfoChip({ icon, label, tint = colors.ardoise }: InfoChipProps) {
  return (
    <View style={[styles.chip, { backgroundColor: `${tint}12` }]}>
      <Ionicons name={icon} size={13} color={tint} />
      <Text style={[styles.label, { color: tint }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: radius.sm, paddingVertical: 5, paddingHorizontal: spacing.sm },
  label: { fontSize: 12, fontWeight: '600' },
});