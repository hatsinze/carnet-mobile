import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Card } from '../../../src/components/Card';
import { Button } from '../../../src/components/Button';
import { LoadingState } from '../../../src/components/LoadingState';
import { ErrorState } from '../../../src/components/ErrorState';
import { EmptyState } from '../../../src/components/EmptyState';
import { usePaiementsHistory } from '../../../src/hooks/usePaiementsHistory';
import { colors, spacing, typography } from '../../../src/theme/tokens';
import { downloadAndOpenPdf } from '../../../src/lib/download';

const MODE_LABELS: Record<string, string> = {
  especes: 'Espèces',
  virement: 'Virement',
  mobile_money: 'Mobile Money',
  cheque: 'Chèque',
};

export default function PaiementDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const minervalEleveId = Number(id);
  const { data, isLoading, isError, refetch } = usePaiementsHistory(minervalEleveId);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <View style={styles.container}>
      {data && data.length === 0 && (
        <EmptyState message="Aucun paiement enregistré pour cette échéance." />
      )}
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.montant}>{item.montant.toLocaleString('fr-FR')} FBu</Text>
              <Text style={styles.date}>{item.paye_le}</Text>
            </View>
            <Text style={styles.mode}>{MODE_LABELS[item.mode_paiement] ?? item.mode_paiement}</Text>
            {item.reference_transaction && (
              <Text style={styles.reference}>Réf : {item.reference_transaction}</Text>
            )}
            {item.recu && (

              <Button
                label={`Télécharger le reçu (${item.recu.numero_recu})`}
                variant="secondary"
                onPress={async () => {
                  try {
                    await downloadAndOpenPdf(item.recu!.url_telechargement, `recu-${item.recu!.numero_recu}.pdf`);
                  } catch (e) {
                    console.warn('Receipt download failed:', e);
                  }
                }}
              />

            )}
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brume },
  content: { padding: spacing.lg, gap: spacing.md },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  montant: { fontSize: 18, fontWeight: '700', color: colors.ardoise },
  date: { ...typography.body, color: colors.ardoiseMuted },
  mode: { ...typography.body, color: colors.ardoise, marginBottom: spacing.xs },
  reference: { fontSize: 13, color: colors.ardoiseMuted, marginBottom: spacing.md },
});