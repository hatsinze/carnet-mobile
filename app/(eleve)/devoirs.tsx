import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';

export default function DevoirsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="construct-outline" size={32} color={colors.encre} />
      </View>
      <Text style={styles.title}>Bientôt disponible</Text>
      <Text style={styles.subtitle}>
        Le suivi de vos devoirs sera bientôt accessible ici. En attendant, consultez votre emploi du temps
        pour voir vos prochains cours et examens.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brume, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl },
  iconCircle: { width: 72, height: 72, borderRadius: radius.lg, backgroundColor: colors.blanc, borderWidth: 1, borderColor: colors.ligne, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h2, color: colors.ardoise, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.ardoiseMuted, textAlign: 'center', lineHeight: 22 },
});