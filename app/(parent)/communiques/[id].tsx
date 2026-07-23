import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Card } from '../../../src/components/Card';
import { Button } from '../../../src/components/Button';
import { LoadingState } from '../../../src/components/LoadingState';
import { ErrorState } from '../../../src/components/ErrorState';
import { useCommunique, useConfirmerPresence } from '../../../src/hooks/useCommuniques';
import { colors, spacing, typography } from '../../../src/theme/tokens';

export default function CommuniqueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const communiqueId = Number(id);
  const { data, isLoading, isError, refetch } = useCommunique(communiqueId);
  const confirmerPresence = useConfirmerPresence(communiqueId);

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState onRetry={refetch} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titre}>{data.titre}</Text>
      {data.auteur && <Text style={styles.auteur}>Par {data.auteur}</Text>}
      {data.publie_le && <Text style={styles.date}>{data.publie_le}</Text>}

      <Card style={styles.contentCard}>
        <Text style={styles.contenu}>{data.contenu}</Text>
      </Card>

      {data.est_reunion && (
        <Card style={styles.reunionCard}>
          <Text style={styles.reunionLabel}>Réunion</Text>
          {data.date_heure_reunion && <Text style={styles.reunionInfo}>{data.date_heure_reunion}</Text>}
          {data.lieu && <Text style={styles.reunionInfo}>{data.lieu}</Text>}

          {data.confirmation === null ? (
            <View style={styles.confirmRow}>
                <View style={styles.confirmButton}>
                <Button
                    label="Confirmer présence"
                    onPress={() => confirmerPresence.mutate('oui')}
                    loading={confirmerPresence.isPending}
                />
                </View>
                <View style={styles.confirmButton}>
                <Button
                    label="Décliner"
                    variant="destructive"
                    onPress={() => confirmerPresence.mutate('non')}
                    loading={confirmerPresence.isPending}
                />
                </View>
            </View>
            ) : (
            <Text style={styles.confirmedText}>
                {data.confirmation === 'oui' ? 'Présence confirmée ✓' : 'Vous avez décliné cette réunion'}
            </Text>
            )}

        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brume },
  content: { padding: spacing.lg },
  titre: { ...typography.h2, color: colors.ardoise, marginBottom: spacing.xs },
  auteur: { fontSize: 13, color: colors.ardoiseMuted },
  date: { fontSize: 13, color: colors.ardoiseMuted, marginBottom: spacing.lg },
  contentCard: { marginBottom: spacing.lg },
  contenu: { ...typography.body, color: colors.ardoise, lineHeight: 24 },
  reunionCard: { backgroundColor: colors.blanc },
  reunionLabel: { ...typography.label, color: colors.encre, marginBottom: spacing.sm },
  reunionInfo: { ...typography.body, color: colors.ardoise, marginBottom: spacing.xs },
  confirmRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  confirmButton: { flex: 1 },
  confirmedText: { ...typography.body, color: colors.sauge, fontWeight: '600', marginTop: spacing.md },
});