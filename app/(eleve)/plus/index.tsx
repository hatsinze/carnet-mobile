import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../src/components/ScreenHeader';
import { useTheme } from '../../../src/features/theme/ThemeContext';
import { fonts, radius, spacing } from '../../../src/theme/tokens';

const ITEMS: { key: string; icon: keyof typeof Ionicons.glyphMap; label: string; desc: string; route: string }[] = [
  { key: 'communiques', icon: 'megaphone-outline', label: 'Communiqués', desc: 'Historique complet et recherche', route: '/(eleve)/plus/communiques' },
  { key: 'compte', icon: 'person-outline', label: 'Mon compte', desc: 'Informations et déconnexion', route: '/(eleve)/plus/compte' },
];

export default function PlusMenuScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.brume }]}>
      <ScreenHeader title="Plus" showBack={false} />
      <View style={[styles.list, { backgroundColor: colors.blanc, borderColor: colors.ligne }]}>
        {ITEMS.map((item, i) => (
          <Pressable key={item.key} style={[styles.row, i < ITEMS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.ligne }]} onPress={() => router.push(item.route as any)}>
            <View style={[styles.iconCircle, { backgroundColor: colors.encreLight }]}><Ionicons name={item.icon} size={19} color={colors.encre} /></View>
            <View style={styles.rowInfo}>
              <Text style={[styles.rowLabel, { color: colors.ardoise }]}>{item.label}</Text>
              <Text style={[styles.rowDesc, { color: colors.ardoiseMuted }]}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.ardoiseMuted} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { marginHorizontal: spacing.lg, marginTop: spacing.lg, borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, gap: spacing.md },
  iconCircle: { width: 40, height: 40, borderRadius: radius.sm, justifyContent: 'center', alignItems: 'center' },
  rowInfo: { flex: 1 },
  rowLabel: { fontFamily: fonts.bodySemiBold, fontSize: 15 },
  rowDesc: { fontFamily: fonts.body, fontSize: 12, marginTop: 2 },
});