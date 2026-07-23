import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../src/components/Card';
import { StatusBadge } from '../../src/components/StatusBadge';
import { LoadingState } from '../../src/components/LoadingState';
import { ErrorState } from '../../src/components/ErrorState';
import { EmptyState } from '../../src/components/EmptyState';
import { useAuth } from '../../src/features/auth/AuthContext';
import { usePeriodes } from '../../src/hooks/usePeriodes';
import { useEleveSanctions } from '../../src/hooks/useEleveSanctions';
import { useBilanEleve } from '../../src/hooks/useBilanEleve';
import type { SanctionType } from '../../src/types/sanction';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';

const TYPE_LABELS: Record<SanctionType, string> = {
  avertissement: 'Avertissement',
  retenue: 'Retenue',
  exclusion_temporaire: 'Exclusion temporaire',
  exclusion_definitive: 'Exclusion définitive',
};

const TYPE_STATUS: Record<SanctionType, 'neutral' | 'alert'> = {
  avertissement: 'neutral',
  retenue: 'alert',
  exclusion_temporaire: 'alert',
  exclusion_definitive: 'alert',
};

const SOURCE_LABELS: Record<string, string> = {
  faute: 'Faute',
  sanction: 'Sanction',
  decision_conseil: 'Décision conseil',
};

export default function ComportementScreen() {
  const { user } = useAuth();
  const { data: periodes } = usePeriodes();
  const [periodeId, setPeriodeId] = useState<number | undefined>();

  useEffect(() => {
    if (periodes && periodes.length > 0 && !periodeId) {
      setPeriodeId(periodes[periodes.length - 1].id);
    }
  }, [periodes, periodeId]);

  const eleveId = user?.eleve?.id;
  const { data: sanctions, isLoading: sanctionsLoading, isError: sanctionsError, refetch: refetchSanctions } = useEleveSanctions(eleveId, periodeId);
  const { data: bilan, isLoading: bilanLoading, isError: bilanError, refetch: refetchBilan } = useBilanEleve(eleveId, periodeId);

  const score = bilan?.score;
  const pourcentage = score?.pourcentage ?? 0;
  const level = pourcentage >= 80 ? 'good' : pourcentage >= 50 ? 'medium' : 'low';
  const levelConfig = {
    good: { label: 'Bon comportement', color: colors.sauge, icon: 'shield-checkmark-outline' as const },
    medium: { label: 'À surveiller', color: colors.soleil, icon: 'alert-circle-outline' as const },
    low: { label: 'Attention nécessaire', color: colors.brique, icon: 'warning-outline' as const },
  }[level];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon comportement</Text>
      </View>

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

      <ScrollView contentContainerStyle={styles.content}>
        {bilanLoading && <LoadingState />}
        {bilanError && <ErrorState onRetry={refetchBilan} />}

        {score && (
          <Card style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <View style={[styles.scoreIcon, { backgroundColor: `${levelConfig.color}1A` }]}>
                <Ionicons name={levelConfig.icon} size={26} color={levelConfig.color} />
              </View>
              <View style={styles.scoreInfo}>
                <Text style={styles.scoreLabel}>Points de conduite</Text>
                <View style={styles.scoreValueRow}>
                  <Text style={styles.scoreValue}>{score.score}</Text>
                  <Text style={styles.scoreMax}> / {score.base_points}</Text>
                </View>
              </View>
              <StatusBadge
                label={levelConfig.label}
                status={level === 'good' ? 'positive' : level === 'medium' ? 'neutral' : 'alert'}
              />
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.min(pourcentage, 100)}%`, backgroundColor: levelConfig.color }]} />
            </View>

            {score.points_retires > 0 && (
              <Text style={styles.deductedText}>
                <Text style={{ color: colors.brique, fontWeight: '700' }}>−{score.points_retires}</Text> point{score.points_retires > 1 ? 's' : ''} retiré{score.points_retires > 1 ? 's' : ''} cette période
              </Text>
            )}
          </Card>
        )}

        {bilan && bilan.retraits.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Déductions</Text>
            {bilan.retraits.map((r) => (
              <Card key={r.id} style={styles.retraitCard}>
                <View style={styles.row}>
                  <Text style={styles.retraitMotif}>{r.motif}</Text>
                  <Text style={styles.retraitPoints}>−{r.points_retires}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.retraitDate}>{r.date}</Text>
                  <StatusBadge label={SOURCE_LABELS[r.source] ?? r.source} status="neutral" />
                </View>
              </Card>
            ))}
          </>
        )}

        <Text style={styles.sectionLabel}>Sanctions</Text>
        {sanctionsLoading && <LoadingState />}
        {sanctionsError && <ErrorState onRetry={refetchSanctions} />}
        {sanctions && sanctions.length === 0 && (
          <EmptyState message="Aucune sanction pour cette période." />
        )}
        {sanctions?.map((s) => (
          <Card key={s.id} style={styles.card}>
            <View style={styles.row}>
              <StatusBadge label={TYPE_LABELS[s.type]} status={TYPE_STATUS[s.type]} />
              <Text style={styles.date}>
                {new Date(s.date_debut).toLocaleDateString('fr-FR')}
                {s.date_fin ? ` – ${new Date(s.date_fin).toLocaleDateString('fr-FR')}` : ''}
              </Text>
            </View>
            <Text style={styles.motif}>{s.motif}</Text>
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
  periodeRow: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.sm },
  periodePill: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.blanc, borderWidth: 1, borderColor: colors.ligne, marginRight: spacing.sm },
  periodePillActive: { backgroundColor: colors.encre, borderColor: colors.encre },
  periodeLabel: { fontSize: 14, fontWeight: '500', color: colors.ardoise },
  periodeLabelActive: { color: colors.blanc },
  content: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxxl },
  scoreCard: { marginBottom: spacing.lg },
  scoreHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  scoreIcon: { width: 48, height: 48, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center' },
  scoreInfo: { flex: 1 },
  scoreLabel: { ...typography.label, color: colors.ardoiseMuted },
  scoreValueRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 2 },
  scoreValue: { fontSize: 28, fontWeight: '700', color: colors.ardoise, fontVariant: ['tabular-nums'] },
  scoreMax: { fontSize: 15, color: colors.ardoiseMuted },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: colors.ligne, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  deductedText: { fontSize: 13, color: colors.ardoiseMuted, marginTop: spacing.sm },
  sectionLabel: { ...typography.h2, fontSize: 16, color: colors.ardoise, marginTop: spacing.md, marginBottom: spacing.xs },
  retraitCard: { marginBottom: spacing.sm },
  retraitMotif: { ...typography.body, fontWeight: '600', color: colors.ardoise, flex: 1 },
  retraitPoints: { fontSize: 16, fontWeight: '700', color: colors.brique },
  retraitDate: { fontSize: 12, color: colors.ardoiseMuted },
  card: { marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  date: { fontSize: 12, color: colors.ardoiseMuted },
  motif: { ...typography.body, color: colors.ardoise },
});