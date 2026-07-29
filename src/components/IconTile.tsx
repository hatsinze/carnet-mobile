import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/tokens';

interface IconTileProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  count?: number;
  tint?: string;
  onPress: () => void;
}

export function IconTile({ icon, label, count, tint = colors.encre, onPress }: IconTileProps) {
  return (
    <Pressable style={styles.tile} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: `${tint}14` }]}>
        <Ionicons name={icon} size={22} color={tint} />
        {typeof count === 'number' && count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
          </View>
        )}
      </View>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: { width: '31%', alignItems: 'center', marginBottom: spacing.lg },
  iconCircle: { width: 52, height: 52, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.brique, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, borderWidth: 2, borderColor: colors.brume },
  badgeText: { color: colors.blanc, fontSize: 10, fontWeight: '700' },
  label: { fontSize: 12, color: colors.ardoise, marginTop: spacing.xs, textAlign: 'center', fontWeight: '500' },
});