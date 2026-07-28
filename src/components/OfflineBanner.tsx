import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsOnline } from '../hooks/useIsOnline';
import { colors, spacing } from '../theme/tokens';

export function OfflineBanner() {
  const isOnline = useIsOnline();

  if (isOnline) return null;

  return (
    <View style={styles.banner}>
      <Ionicons name="cloud-offline-outline" size={16} color={colors.blanc} />
      <Text style={styles.text}>Hors ligne — dernières données affichées</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.ardoise, paddingVertical: spacing.sm },
  text: { color: colors.blanc, fontSize: 13, fontWeight: '500' },
});