import { View, Text, FlatList, Pressable, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChildSwitcher } from '../../../src/components/ChildSwitcher';
import { Card } from '../../../src/components/Card';
import { StatusBadge } from '../../../src/components/StatusBadge';
import { LoadingState } from '../../../src/components/LoadingState';
import { ErrorState } from '../../../src/components/ErrorState';
import { EmptyState } from '../../../src/components/EmptyState';
import { LastUpdated } from '../../../src/components/LastUpdated';
import { useChildContext } from '../../../src/features/children/ChildContext';
import { useMinervalEleves } from '../../../src/hooks/useMinervalEleves';
import type { MinervalEleve } from '../../../src/types/finance';
import { colors, spacing, typography } from '../../../src/theme/tokens';

const STATUT_CONFIG: Record<MinervalEleve['statut'], { label: string; status: 'positive' | 'alert' | 'neutral' }> = {
  a_jour: { label: 'À jour', status: 'positive' },
  paye: { label: 'Payé', status: 'positive' },
  en_retard: { label: 'En retard', status: 'alert' },
  exonere: { label: 'Exonéré', status: 'neutral' },
};

export default function PaiementsScreen() {
  const router = useRouter();
  const { selectedChild } = useChildContext();
  const {
    data, isLoading, isError, refetch, isRefetching,
    fetchNextPage, hasNextPage, isFetchingNextPage, dataUpdatedAt,
  } = useMinervalEleves(selectedChild?.id);

  const items = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <View style={styles.container}>
      <ChildSwitcher />

      {isLoading && <LoadingState />}
      {isError && <ErrorState onRetry={refetch} />}
      {!isLoading && items.length === 0 && <EmptyState message="Aucune échéance enregistrée." />}

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.encre} />}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={<LastUpdated timestamp={dataUpdatedAt} />}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.encre} style={{ marginVertical: spacing.md }} /> : null}
        renderItem={({ item }) => {
          const config = STATUT_CONFIG[item.statut];
          const solde = item.montant_du - item.montant_paye;
          return (
            <Pressable onPress={() => router.push(`/(parent)/paiements/${item.id}`)}>
              <Card style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.libelle}>{item.echeance.libelle}</Text>
                  <StatusBadge label={config.label} status={config.status} />
                </View>
                <Text style={styles.montant}>{item.montant_du.toLocaleString('fr-FR')} FBu</Text>
                {solde > 0 && <Text style={styles.solde}>Solde restant : {solde.toLocaleString('fr-FR')} FBu</Text>}
                {item.jours_de_retard > 0 && <Text style={styles.retard}>{item.jours_de_retard} jour(s) de retard</Text>}
              </Card>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brume },
  content: { padding: spacing.lg, gap: spacing.md },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  libelle: { ...typography.body, fontWeight: '600', color: colors.ardoise },
  montant: { fontSize: 20, fontWeight: '700', color: colors.ardoise },
  solde: { fontSize: 13, color: colors.ardoiseMuted, marginTop: spacing.xs },
  retard: { fontSize: 13, color: colors.brique, marginTop: spacing.xs, fontWeight: '500' },
});