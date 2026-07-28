import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { ChildSwitcher } from '../../src/components/ChildSwitcher';
import { Card } from '../../src/components/Card';
import { StatusBadge } from '../../src/components/StatusBadge';
import { LoadingState } from '../../src/components/LoadingState';
import { ErrorState } from '../../src/components/ErrorState';
import { LastUpdated } from '../../src/components/LastUpdated';
import { useChildContext } from '../../src/features/children/ChildContext';
import { useEleveStats } from '../../src/hooks/useEleveStats';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function AccueilScreen() {
  const { selectedChild } = useChildContext();
  const { data: stats, isLoading, isError, refetch, isRefetching, dataUpdatedAt } = useEleveStats(selectedChild?.id);

  return (
    <View style={styles.container}>
      <ChildSwitcher />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.encre} />}
      >
        <LastUpdated timestamp={dataUpdatedAt} />

        {selectedChild && (
          <Text style={styles.greeting}>
            {selectedChild.prenom} {selectedChild.nom}
            {selectedChild.classe ? ` — ${selectedChild.classe.nom}` : ''}
          </Text>
        )}

        {isLoading && <LoadingState />}
        {isError && <ErrorState onRetry={refetch} />}

        {stats && (
          <>
            <Card style={styles.card}>
              <Text style={styles.label}>Moyenne générale</Text>
              <Text style={styles.value}>
                {stats.moyenne_generale !== null ? `${stats.moyenne_generale}/20` : '—'}
              </Text>
              {stats.rang !== null && (
                <Text style={styles.subvalue}>Rang {stats.rang}/{stats.total_eleves}</Text>
              )}
            </Card>

            <Card style={styles.card}>
              <Text style={styles.label}>Discipline</Text>
              <View style={styles.row}>
                <StatusBadge
                  label={`${stats.fautes} faute${stats.fautes !== 1 ? 's' : ''}`}
                  status={stats.fautes > 0 ? 'alert' : 'positive'}
                />
              </View>
              <View style={[styles.row, { marginTop: spacing.sm }]}>
                <StatusBadge
                  label={`${stats.sanctions} sanction${stats.sanctions !== 1 ? 's' : ''}`}
                  status={stats.sanctions > 0 ? 'alert' : 'positive'}
                />
              </View>
            </Card>

            {stats.communiques_non_lus > 0 && (
              <Card style={styles.card}>
                <Text style={styles.label}>Communiqués non lus</Text>
                <Text style={styles.value}>{stats.communiques_non_lus}</Text>
              </Card>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brume },
  content: { padding: spacing.lg, gap: spacing.lg },
  greeting: { ...typography.h2, color: colors.ardoise, marginBottom: spacing.sm },
  card: { marginBottom: spacing.md },
  label: { ...typography.label, color: colors.ardoiseMuted, marginBottom: spacing.xs },
  value: { fontSize: 32, fontWeight: '700', color: colors.ardoise },
  subvalue: { ...typography.body, color: colors.ardoiseMuted, marginTop: spacing.xs },
  row: { flexDirection: 'row' },
});