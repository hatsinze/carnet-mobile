import { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressRing } from '../../../src/components/ProgressRing';
import { SegmentedControl } from '../../../src/components/SegmentedControl';
import { FadeInUp } from '../../../src/components/Motion';
import { LoadingState } from '../../../src/components/LoadingState';
import { ErrorState } from '../../../src/components/ErrorState';
import { EmptyState } from '../../../src/components/EmptyState';
import { useChildContext } from '../../../src/features/children/ChildContext';
import { usePeriodes } from '../../../src/hooks/usePeriodes';
import { useEleveSanctions } from '../../../src/hooks/useEleveSanctions';
import { useBilanEleve } from '../../../src/hooks/useBilanEleve';
import type { SanctionType } from '../../../src/types/sanction';
import { colors, fonts, radius, shadows, spacing } from '../../../src/theme/tokens';

const TYPE_LABELS: Record<SanctionType, string> = {
  avertissement: 'Avertissement', retenue: 'Retenue', exclusion_temporaire: 'Exclusion temporaire', exclusion_definitive: 'Exclusion définitive',
};
const SOURCE_LABELS: Record<string, string> = { faute: 'Faute', sanction: 'Sanction', decision_conseil: 'Décision conseil' };

export default function ComportementScreen() {
  const { selectedChild } = useChildContext();
  const { data: periodes } = usePeriodes();
  const [periodeId, setPeriodeId] = useState<string>('');

  // Fix: default to the FIRST period (1er Trimestre), not the last.
  useEffect(() => {
    if (periodes && periodes.length > 0 && !periodeId) setPeriodeId(String(periodes[0].id));
  }, [periodes, periodeId]);

  const eleveId = selectedChild?.id;
  const numericPeriodeId = periodeId ? Number(periodeId) : undefined;
  const { data: sanctions, isLoading: sLoading, isError: sError, refetch: sRefetch, isRefetching: sRefetching } = useEleveSanctions(eleveId, numericPeriodeId);
  const { data: bilan, isLoading: bLoading, isError: bError, refetch: bRefetch, isRefetching: bRefetching } = useBilanEleve(eleveId, numericPeriodeId);

  if (!selectedChild) return <EmptyState message="Sélectionnez un enfant depuis l'accueil pour afficher son dossier comportemental." />;

  const score = bilan?.score;
  const pourcentage = score?.pourcentage ?? 0;
  const level = pourcentage >= 80 ? 'good' : pourcentage >= 50 ? 'medium' : 'low';
  const levelConfig = {
    good: { label: 'Bon comportement', color: colors.sauge },
    medium: { label: 'À surveiller', color: colors.soleil },
    low: { label: 'Attention nécessaire', color: colors.brique },
  }[level];

  const periodeOptions = (periodes ?? []).map((p) => ({ value: String(p.id), label: p.nom }));

  function handleRefresh() { sRefetch(); bRefetch(); }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={sRefetching || bRefetching} onRefresh={handleRefresh} tintColor={colors.encre} />}
    >
      {periodeOptions.length > 0 && (
        <SegmentedControl options={periodeOptions} value={periodeId} onChange={setPeriodeId} />
      )}

      <View style={{ height: spacing.xl }} />

      {bLoading && <LoadingState />}
      {bError && <ErrorState onRetry={bRefetch} />}

      {score && (
        <FadeInUp>
          <View style={[styles.scoreCard, shadows.card]}>
            <ProgressRing
              value={pourcentage}
              color={levelConfig.color}
              centerLabel={`${score.score}`}
              centerSubLabel={`/ ${score.base_points}`}
            />
            <View style={styles.scoreRight}>
              <View style={[styles.badge, { backgroundColor: `${levelConfig.color}18` }]}>
                <Text style={[styles.badgeText, { color: levelConfig.color }]}>{levelConfig.label}</Text>
              </View>
              <Text style={styles.pourcentageText}>{pourcentage}% des points conservés</Text>
              {score.points_retires > 0 && (
                <Text style={styles.deductedText}>
                  <Text style={{ color: colors.brique, fontFamily: fonts.bodyBold }}>−{score.points_retires}</Text> retiré(s)
                </Text>
              )}
            </View>
          </View>
        </FadeInUp>
      )}

      {bilan && bilan.retraits.length > 0 && (
        <FadeInUp>
          <Text style={styles.sectionTitle}>Déductions</Text>
          {bilan.retraits.map((r) => (
            <View key={r.id} style={[styles.itemCard, shadows.card]}>
              <View style={[styles.itemIcon, { backgroundColor: colors.briqueLight }]}>
                <Ionicons name="remove-circle-outline" size={16} color={colors.brique} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemMotif}>{r.motif}</Text>
                <View style={styles.itemMetaRow}>
                  <Text style={styles.itemDate}>{r.date}</Text>
                  <Text style={styles.itemSource}>{SOURCE_LABELS[r.source] ?? r.source}</Text>
                </View>
              </View>
              <Text style={styles.itemPoints}>−{r.points_retires}</Text>
            </View>
          ))}
        </FadeInUp>
      )}

      <FadeInUp>
        <Text style={styles.sectionTitle}>Sanctions</Text>
        {sLoading && <LoadingState />}
        {sError && <ErrorState onRetry={sRefetch} />}
        {sanctions && sanctions.length === 0 && <EmptyState message="Aucune sanction pour cette période." />}
        {sanctions?.map((s) => {
          const isActive = !s.date_fin || new Date(s.date_fin) >= new Date();
          return (
            <View key={s.id} style={[styles.itemCard, shadows.card]}>
              <View style={[styles.itemIcon, { backgroundColor: colors.encreLight }]}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.encre} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemMotif}>{s.motif}</Text>
                <View style={styles.itemMetaRow}>
                  <Text style={styles.itemDate}>
                    {new Date(s.date_debut).toLocaleDateString('fr-FR')}{s.date_fin ? ` – ${new Date(s.date_fin).toLocaleDateString('fr-FR')}` : ''}
                  </Text>
                  <Text style={styles.itemSource}>{TYPE_LABELS[s.type]}</Text>
                </View>
              </View>
              <View style={[styles.statusPill, { backgroundColor: isActive ? '#FBEEE9' : colors.brume }]}>
                <Text style={[styles.statusPillText, { color: isActive ? colors.brique : colors.ardoiseMuted }]}>
                  {isActive ? 'Active' : 'Expirée'}
                </Text>
              </View>
            </View>
          );
        })}
      </FadeInUp>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brume },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  scoreCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.blanc, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl, gap: spacing.lg },
  scoreRight: { flex: 1 },
  badge: { alignSelf: 'flex-start', borderRadius: radius.sm, paddingVertical: 5, paddingHorizontal: spacing.sm, marginBottom: spacing.sm },
  badgeText: { fontFamily: fonts.bodySemiBold, fontSize: 12 },
  pourcentageText: { fontFamily: fonts.body, fontSize: 13, color: colors.ardoise },
  deductedText: { fontFamily: fonts.body, fontSize: 12, color: colors.ardoiseMuted, marginTop: 4 },
  sectionTitle: { fontFamily: fonts.displaySemiBold, fontSize: 16, color: colors.ardoise, marginBottom: spacing.md },
  itemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.blanc, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  itemIcon: { width: 34, height: 34, borderRadius: radius.sm, justifyContent: 'center', alignItems: 'center' },
  itemInfo: { flex: 1, minWidth: 0 },
  itemMotif: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.ardoise },
  itemMetaRow: { flexDirection: 'row', gap: spacing.sm, marginTop: 3 },
  itemDate: { fontFamily: fonts.body, fontSize: 11, color: colors.ardoiseMuted },
  itemSource: { fontFamily: fonts.bodyMedium, fontSize: 11, color: colors.encre },
  itemPoints: { fontFamily: fonts.monoBold, fontSize: 15, color: colors.brique },
  statusPill: { borderRadius: radius.sm, paddingVertical: 4, paddingHorizontal: spacing.sm },
  statusPillText: { fontFamily: fonts.bodySemiBold, fontSize: 10 },
});