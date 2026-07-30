import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, shadows, spacing } from '../../../src/theme/tokens';

const ITEMS: { key: string; icon: keyof typeof Ionicons.glyphMap; label: string; desc: string; route: string }[] = [
  { key: 'calendrier', icon: 'calendar-outline', label: 'Calendrier scolaire', desc: 'Cours, examens, réunions et vacances', route: '/(parent)/plus/calendrier' },
  { key: 'comportement', icon: 'shield-outline', label: 'Comportement', desc: 'Fautes, sanctions et points de conduite', route: '/(parent)/plus/comportement' },
  { key: 'archives', icon: 'archive-outline', label: 'Archives', desc: 'Historique complet des communiqués', route: '/(parent)/plus/archives' },
  { key: 'compte', icon: 'person-outline', label: 'Mon compte', desc: 'Informations et déconnexion', route: '/(parent)/plus/compte' },
];

export default function PlusMenuScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={[styles.list, shadows.card]}>
        {ITEMS.map((item, i) => (
          <Pressable
            key={item.key}
            style={[styles.row, i < ITEMS.length - 1 && styles.rowBorder]}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={19} color={colors.encre} />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowDesc}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.ardoiseMuted} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brume, padding: spacing.lg },
  list: { backgroundColor: colors.blanc, borderRadius: radius.lg, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, gap: spacing.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.ligne },
  iconCircle: { width: 40, height: 40, borderRadius: radius.sm, backgroundColor: colors.encreLight, justifyContent: 'center', alignItems: 'center' },
  rowInfo: { flex: 1 },
  rowLabel: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.ardoise },
  rowDesc: { fontFamily: fonts.body, fontSize: 12, color: colors.ardoiseMuted, marginTop: 2 },
});