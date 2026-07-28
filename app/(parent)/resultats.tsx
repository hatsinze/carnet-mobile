import { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable, StyleSheet } from 'react-native';
import { ChildSwitcher } from '../../src/components/ChildSwitcher';
import { Card } from '../../src/components/Card';
import { LoadingState } from '../../src/components/LoadingState';
import { ErrorState } from '../../src/components/ErrorState';
import { EmptyState } from '../../src/components/EmptyState';
import { LastUpdated } from '../../src/components/LastUpdated';
import { useChildContext } from '../../src/features/children/ChildContext';
import { usePeriodes } from '../../src/hooks/usePeriodes';
import { useMoyennes } from '../../src/hooks/useMoyennes';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';

export default function ResultatsScreen() {
  const { selectedChild } = useChildContext();
  const { data: periodes, isLoading: periodesLoading } = usePeriodes();
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<number | undefined>();

  useEffect(() => {
    if (periodes && periodes.length > 0 && !selectedPeriodeId) {
      setSelectedPeriodeId(periodes[periodes.length - 1].id);
    }
  }, [periodes, selectedPeriodeId]);

  const {
    data: moyennes, isLoading: moyennesLoading, isError, refetch, isRefetching, dataUpdatedAt,
  } = useMoyennes(selectedChild?.id, selectedPeriodeId);

  return (
    <View style={styles.container}>
      <ChildSwitcher />

      {periodesLoading && <LoadingState />}

      {periodes && periodes.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.periodeRow}>
          {periodes.map((p) => {
            const isActive = p.id === selectedPeriodeId;
            return (
              <Pressable
                key={p.id}
                style={[styles.periodePill, isActive && styles.periodePillActive]}
                onPress={() => setSelectedPeriodeId(p.id)}
              >
                <Text style={[styles.periodeLabel, isActive && styles.periodeLabelActive]}>{p.nom}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.encre} />}
      >
        <LastUpdated timestamp={dataUpdatedAt} />
        {moyennesLoading && <LoadingState />}
        {isError && <ErrorState onRetry={refetch} />}
        {moyennes && moyennes.length === 0 && (
          <EmptyState message="Aucune note enregistrée pour cette période." />
        )}

        {moyennes?.map((m) => (
          <Card key={m.id} style={styles.matiereCard}>
            <View style={styles.matiereRow}>
              <Text style={styles.matiereNom}>{m.matiere}</Text>
              <Text style={styles.matiereMoyenne}>{m.moyenne}/20</Text>
            </View>
            <View style={styles.matiereRow}>
              <Text style={styles.matiereMeta}>Coef. {m.coefficient}</Text>
              {m.rang_matiere !== null && <Text style={styles.matiereMeta}>Rang {m.rang_matiere}</Text>}
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brume },
  periodeRow: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.sm },
  periodePill: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.blanc, borderWidth: 1, borderColor: colors.ligne, marginRight: spacing.sm },
  periodePillActive: { backgroundColor: colors.encre, borderColor: colors.encre },
  periodeLabel: { fontSize: 14, fontWeight: '500', color: colors.ardoise },
  periodeLabelActive: { color: colors.blanc },
  content: { padding: spacing.lg, gap: spacing.md },
  matiereCard: { marginBottom: spacing.md },
  matiereRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  matiereNom: { ...typography.body, fontWeight: '600', color: colors.ardoise },
  matiereMoyenne: { fontSize: 17, fontWeight: '700', color: colors.encre },
  matiereMeta: { fontSize: 13, color: colors.ardoiseMuted },
});