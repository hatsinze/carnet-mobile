import { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../src/components/Card';
import { LoadingState } from '../../src/components/LoadingState';
import { ErrorState } from '../../src/components/ErrorState';
import { EmptyState } from '../../src/components/EmptyState';
import { LastUpdated } from '../../src/components/LastUpdated';
import { useAuth } from '../../src/features/auth/AuthContext';
import { usePeriodes } from '../../src/hooks/usePeriodes';
import { useEleveResultats } from '../../src/hooks/useEleveResultats';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';

export default function ResultatsScreen() {
  const { user } = useAuth();
  const { data: periodes, isLoading: periodesLoading } = usePeriodes();
  const [periodeId, setPeriodeId] = useState<number | undefined>();

  useEffect(() => {
    if (periodes && periodes.length > 0 && !periodeId) {
      setPeriodeId(periodes[periodes.length - 1].id);
    }
  }, [periodes]);

  const { data, isLoading, isError, refetch, isRefetching, dataUpdatedAt } = useEleveResultats(periodeId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes résultats</Text>
        {user?.eleve && <Text style={styles.headerSubtitle}>{user.eleve.matricule}</Text>}
      </View>

      {periodesLoading && <LoadingState />}

      {periodes && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.periodeRow}>
          {periodes.map((p) => {
            const isActive = p.id === periodeId;
            return (
              <Pressable
                key={p.id}
                style={[styles.periodePill, isActive && styles.periodePillActive]}
                onPress={() => setPeriodeId(p.id)}
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
        {isLoading && <LoadingState />}
        {isError && <ErrorState onRetry={refetch} />}

        {data?.classement && (
          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{data.classement.moyenne_generale.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Moyenne /20</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{data.classement.pourcentage_general.toFixed(0)}%</Text>
              <Text style={styles.statLabel}>Pourcentage</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{data.classement.rang_general}e</Text>
              <Text style={styles.statLabel}>Rang général</Text>
            </View>
          </View>
        )}

        {data?.moyennes.length === 0 && (
          <EmptyState message="Aucune note enregistrée pour cette période." />
        )}

        {data?.moyennes.map((m) => (
          <Card key={m.matiere} style={styles.matiereCard}>
            <View style={styles.matiereHeader}>
              <View style={styles.matiereIcon}>
                <Ionicons name="book-outline" size={18} color={colors.encre} />
              </View>
              <View style={styles.matiereInfo}>
                <Text style={styles.matiereNom}>{m.matiere}</Text>
                <Text style={styles.matiereCoef}>Coefficient {m.coefficient}</Text>
              </View>
              <Text style={[styles.matiereMoyenne, { color: m.moyenne >= 10 ? colors.sauge : colors.brique }]}>
                {m.moyenne.toFixed(2)}
              </Text>
            </View>
            {m.rang_matiere !== null && (
              <Text style={styles.matiereRang}>Ma place : {m.rang_matiere}e</Text>
            )}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brume },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  headerTitle: { ...typography.h1, color: colors.ardoise },
  headerSubtitle: { fontSize: 13, color: colors.ardoiseMuted, marginTop: 2 },
  periodeRow: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.sm },
  periodePill: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.blanc, borderWidth: 1, borderColor: colors.ligne, marginRight: spacing.sm },
  periodePillActive: { backgroundColor: colors.encre, borderColor: colors.encre },
  periodeLabel: { fontSize: 14, fontWeight: '500', color: colors.ardoise },
  periodeLabelActive: { color: colors.blanc },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl },
  statRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  statBox: { flex: 1, backgroundColor: colors.blanc, borderWidth: 1, borderColor: colors.ligne, borderRadius: radius.md, paddingVertical: spacing.lg, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '700', color: colors.ardoise, fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 12, color: colors.ardoiseMuted, marginTop: spacing.xs, textAlign: 'center' },
  matiereCard: { marginBottom: spacing.sm },
  matiereHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  matiereIcon: { width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.brume, justifyContent: 'center', alignItems: 'center' },
  matiereInfo: { flex: 1 },
  matiereNom: { ...typography.body, fontWeight: '600', color: colors.ardoise },
  matiereCoef: { fontSize: 12, color: colors.ardoiseMuted, marginTop: 2 },
  matiereMoyenne: { fontSize: 20, fontWeight: '700', fontVariant: ['tabular-nums'] },
  matiereRang: { fontSize: 13, color: colors.ardoiseMuted, marginTop: spacing.sm, marginLeft: 48 },
});