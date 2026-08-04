import { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { ProgressRing } from '../../src/components/ProgressRing';
import { ProgressBar } from '../../src/components/ProgressBar';
import { SegmentedControl } from '../../src/components/SegmentedControl';
import { CommuniqueCardSkeleton } from '../../src/components/Skeleton';
import { ErrorState } from '../../src/components/ErrorState';
import { FadeInUp } from '../../src/components/Motion';
import { useTheme } from '../../src/features/theme/ThemeContext';
import { useChildContext } from '../../src/features/children/ChildContext';
import { usePeriodes } from '../../src/hooks/usePeriodes';
import { useMoyennes } from '../../src/hooks/useMoyennes';
import { fonts, radius, spacing } from '../../src/theme/tokens';

export default function ResultatsScreen() {
  const { colors } = useTheme();
  const { selectedChild } = useChildContext();
  const { data: periodes } = usePeriodes();
  const [periodeId, setPeriodeId] = useState<string>('');

  useEffect(() => {
    if (!periodes?.length) return;
    setPeriodeId((current) => current || String(periodes[0].id));
  }, [periodes, periodeId]);

  const numericPeriodeId = periodeId ? Number(periodeId) : undefined;
  const { data: moyennes, isLoading, isError, refetch, isRefetching } = useMoyennes(selectedChild?.id, numericPeriodeId);

  // Only subjects with a real grade contribute to the average or render a value —
  // ungraded subjects still show in the list, just without a number, no "—" trick needed.
  const graded = (moyennes ?? []).filter((m) => m.moyenne !== null);
  const weightedSum = graded.reduce((sum, m) => sum + m.moyenne! * m.coefficient, 0);
  const totalCoef = graded.reduce((sum, m) => sum + m.coefficient, 0);
  const generalAvg = totalCoef > 0 ? weightedSum / totalCoef : null;
  const ringColor = generalAvg !== null ? (generalAvg >= 10 ? colors.sauge : colors.brique) : colors.encre;

  const bestRank = graded
    .map((m) => m.rang_matiere)
    .filter((r): r is number => r !== null)
    .sort((a, b) => a - b)[0];

  const periodeOptions = (periodes ?? []).map((p) => ({ value: String(p.id), label: p.nom }));

  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.brume }}>
      <ScreenHeader title="Résultats" showBack={false} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.encre} />}
      >
        {selectedChild?.classe && (
          <Text style={[styles.headerSub, { color: colors.ardoiseMuted }]}>
            {selectedChild.prenom} {selectedChild.nom} · {selectedChild.classe.nom}
          </Text>
        )}

        {periodeOptions.length > 0 && (
          <>
            <SegmentedControl options={periodeOptions} value={periodeId} onChange={setPeriodeId} />
            <View style={{ height: spacing.lg }} />
          </>
        )}

        {isLoading ? (
          <View style={[styles.ringCard, { backgroundColor: colors.blanc, borderColor: colors.ligne }]}>
            <CommuniqueCardSkeleton />
          </View>
        ) : generalAvg !== null ? (
          <FadeInUp>
            <View style={[styles.ringCard, { backgroundColor: colors.blanc, borderColor: colors.ligne }]}>
              <ProgressRing value={(generalAvg / 20) * 100} color={ringColor} centerLabel={generalAvg.toFixed(1)} centerSubLabel="/ 20" size={104} strokeWidth={10} />
              <View style={styles.ringStatsCol}>
                <Text style={[styles.ringLabel, { color: colors.ardoiseMuted }]}>Moyenne générale</Text>
                <Text style={[styles.ringSubtext, { color: colors.ardoise }]}>
                  {graded.length} matière{graded.length !== 1 ? 's' : ''} évaluée{graded.length !== 1 ? 's' : ''}
                </Text>
                {bestRank !== undefined && (
                  <View style={[styles.rankBadge, { backgroundColor: colors.soleilLight }]}>
                    <Ionicons name="trophy-outline" size={13} color={colors.or} />
                    <Text style={[styles.rankBadgeText, { color: colors.or }]}>Meilleure place : {bestRank}e</Text>
                  </View>
                )}
              </View>
            </View>
          </FadeInUp>
        ) : (
          <View style={[styles.emptyCard, { backgroundColor: colors.blanc, borderColor: colors.ligne }]}>
            <Ionicons name="school-outline" size={32} color={colors.ardoiseMuted} />
            <Text style={[styles.emptyText, { color: colors.ardoiseMuted }]}>Aucune note enregistrée pour cette période.</Text>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: colors.ardoise }]}>Matières</Text>

        {isLoading ? (
          <>{[1, 2, 3].map((i) => <CommuniqueCardSkeleton key={i} />)}</>
        ) : !moyennes || moyennes.length === 0 ? null : (
          moyennes.map((m, idx) => {
            const hasGrade = m.moyenne !== null;
            const isGood = hasGrade && m.moyenne! >= 10;
            const pct = hasGrade ? (m.moyenne! / 20) * 100 : 0;

            return (
              <FadeInUp key={m.id} delay={idx * 40}>
                <View style={[styles.subjectCard, { backgroundColor: colors.blanc, borderColor: colors.ligne }]}>
                  <View style={styles.subjectTopRow}>
                    <View style={[styles.subjectIcon, { backgroundColor: hasGrade ? (isGood ? colors.saugeLight : colors.briqueLight) : colors.brume }]}>
                      <Ionicons name="book-outline" size={17} color={hasGrade ? (isGood ? colors.sauge : colors.brique) : colors.ardoiseMuted} />
                    </View>
                    <View style={styles.subjectInfo}>
                      <Text style={[styles.subjectName, { color: colors.ardoise }]} numberOfLines={1}>{m.matiere}</Text>
                      <View style={styles.chipRow}>
                        <View style={[styles.chip, { backgroundColor: colors.brume }]}>
                          <Text style={[styles.chipText, { color: colors.ardoiseMuted }]}>Coef. {m.coefficient}</Text>
                        </View>
                        {m.rang_matiere !== null && (
                          <View style={[styles.chip, { backgroundColor: colors.encreLight }]}>
                            <Text style={[styles.chipText, { color: colors.encre }]}>Rang {m.rang_matiere}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <Text style={[styles.subjectAvg, { color: hasGrade ? (isGood ? colors.sauge : colors.brique) : colors.ardoiseMuted }]}>
                      {hasGrade ? m.moyenne!.toFixed(1) : '—'}
                    </Text>
                  </View>
                  {hasGrade && (
                    <View style={{ marginTop: spacing.sm }}>
                      <ProgressBar value={pct} color={isGood ? colors.sauge : colors.brique} trackColor={colors.brume} height={5} />
                    </View>
                  )}
                </View>
              </FadeInUp>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  headerSub: { fontFamily: fonts.body, fontSize: 13, marginBottom: spacing.lg },
  ringCard: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg, marginBottom: spacing.xl },
  ringStatsCol: { flex: 1, marginLeft: spacing.lg, gap: 6 },
  ringLabel: { fontFamily: fonts.bodyMedium, fontSize: 12 },
  ringSubtext: { fontFamily: fonts.bodySemiBold, fontSize: 15 },
  rankBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', borderRadius: radius.sm, paddingVertical: 4, paddingHorizontal: spacing.sm, marginTop: 2 },
  rankBadgeText: { fontFamily: fonts.bodySemiBold, fontSize: 11 },
  emptyCard: { alignItems: 'center', borderRadius: radius.lg, borderWidth: 1, padding: spacing.xxl, gap: spacing.md, marginBottom: spacing.xl },
  emptyText: { fontFamily: fonts.body, fontSize: 13, textAlign: 'center' },
  sectionTitle: { fontFamily: fonts.displaySemiBold, fontSize: 17, marginBottom: spacing.md },
  subjectCard: { borderRadius: radius.md, borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm },
  subjectTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  subjectIcon: { width: 36, height: 36, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  subjectInfo: { flex: 1, minWidth: 0 },
  subjectName: { fontFamily: fonts.bodySemiBold, fontSize: 14 },
  chipRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  chip: { borderRadius: radius.sm, paddingVertical: 2, paddingHorizontal: 7 },
  chipText: { fontFamily: fonts.bodyMedium, fontSize: 10 },
  subjectAvg: { fontFamily: fonts.monoBold, fontSize: 19 },
});