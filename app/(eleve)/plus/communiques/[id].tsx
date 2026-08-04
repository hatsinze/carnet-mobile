import { Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Card } from '../../../src/components/Card';
import { LoadingState } from '../../../src/components/LoadingState';
import { ErrorState } from '../../../src/components/ErrorState';
import { useCommunique } from '../../../src/hooks/useCommuniques';
import { colors, spacing, typography } from '../../../src/theme/tokens';

export default function CommuniqueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useCommunique(Number(id));

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState onRetry={refetch} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titre}>{data.titre}</Text>
      {data.auteur && <Text style={styles.auteur}>Par {data.auteur}</Text>}
      <Card style={styles.contentCard}>
        <Text style={styles.contenu}>{data.contenu}</Text>
      </Card>
      {data.est_reunion && data.date_heure_reunion && (
        <Card>
          <Text style={styles.reunionLabel}>Réunion</Text>
          <Text style={styles.reunionInfo}>{data.date_heure_reunion}</Text>
          {data.lieu && <Text style={styles.reunionInfo}>{data.lieu}</Text>}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brume },
  content: { padding: spacing.lg },
  titre: { ...typography.h2, color: colors.ardoise, marginBottom: spacing.xs },
  auteur: { fontSize: 13, color: colors.ardoiseMuted, marginBottom: spacing.lg },
  contentCard: { marginBottom: spacing.lg },
  contenu: { ...typography.body, color: colors.ardoise, lineHeight: 24 },
  reunionLabel: { ...typography.label, color: colors.encre, marginBottom: spacing.sm },
  reunionInfo: { ...typography.body, color: colors.ardoise, marginBottom: spacing.xs },
});