import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ChildSwitcher } from '../../src/components/ChildSwitcher';
import { Avatar } from '../../src/components/Avatar';
import { FadeInUp, PressableScale } from '../../src/components/Motion';
import { LoadingState } from '../../src/components/LoadingState';
import { ErrorState } from '../../src/components/ErrorState';
import { useTheme } from '../../src/features/theme/ThemeContext';
import { useChildContext } from '../../src/features/children/ChildContext';
import { useEleveStats } from '../../src/hooks/useEleveStats';
import { usePeriodes } from '../../src/hooks/usePeriodes';
import { useBilanEleve } from '../../src/hooks/useBilanEleve';
import { useUpcomingEvenements } from '../../src/hooks/useAccueilExtras';
import { useCommuniques } from '../../src/hooks/useCommuniques';
import { useFinancialSummary } from '../../src/hooks/useFinancialSummary';
import { colors, fonts, radius, spacing } from '../../src/theme/tokens';

function formatEventRange(dateDebutStr: string, dateFinStr: string) {
  const start = new Date(dateDebutStr);
  const end = new Date(dateFinStr);
  const sameDay = start.toDateString() === end.toDateString();
  const dayLabel = String(start.getDate());
  const monthLabel = start.toLocaleDateString('fr-FR', { month: 'short' });

  if (sameDay) {
    return {
      dayLabel,
      monthLabel,
      subtitle: start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isMultiDay: false,
    };
  }

  const endDay = end.getDate();
  const endMonth = end.toLocaleDateString('fr-FR', { month: 'short' });
  const durationDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  const rangeText = monthLabel === endMonth ? `${dayLabel}–${endDay} ${monthLabel}` : `${dayLabel} ${monthLabel} – ${endDay} ${endMonth}`;

  return { dayLabel, monthLabel, subtitle: `${rangeText} · ${durationDays} jours`, isMultiDay: true };
}

const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05,
  shadowRadius: 12,
  elevation: 2,
};

export default function AccueilScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { selectedChild } = useChildContext();
  const { data: stats, isLoading, isError, refetch, isRefetching } = useEleveStats(selectedChild?.id);
  const { data: periodes } = usePeriodes();
  const currentPeriodeId = periodes && periodes.length > 0 ? periodes[0].id : undefined;
  const { data: bilan } = useBilanEleve(selectedChild?.id, currentPeriodeId);
  const { data: upcomingEvents } = useUpcomingEvenements(2);
  const { data: communiquesData } = useCommuniques();
  const { data: financial } = useFinancialSummary(selectedChild?.id);

  const fullName = selectedChild ? `${selectedChild.prenom} ${selectedChild.nom}` : '';
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const latestCommuniques = communiquesData?.pages[0]?.data.slice(0, 2) ?? [];
  const disciplineScore = bilan?.score;

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.encreDark, colors.encre]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.heroDate}>{today}</Text>

        {selectedChild && (
          <FadeInUp delay={80}>
            <View style={styles.heroChildRow}>
              <Avatar name={fullName} size={52} />
              <View style={styles.heroChildInfo}>
                <Text style={styles.heroChildName} numberOfLines={1}>{selectedChild.prenom}</Text>
                {selectedChild.classe && <Text style={styles.heroChildClasse}>{selectedChild.classe.nom}</Text>}
              </View>
            </View>
          </FadeInUp>
        )}

        {stats && (
          <FadeInUp delay={140}>
            <View style={styles.statsRow}>
              <View style={styles.statBlock}>
                <Text style={styles.statNumber}>{stats.moyenne_generale ?? '—'}</Text>
                <Text style={styles.statLabel}>MOYENNE /20</Text>
              </View>
              <View style={styles.statDividerLight} />
              <View style={styles.statBlock}>
                <Text style={styles.statNumber}>{stats.rang ?? '—'}</Text>
                <Text style={styles.statLabel}>RANG /{stats.total_eleves || '—'}</Text>
              </View>
              <View style={styles.statDividerLight} />
              <View style={styles.statBlock}>
                <Text style={styles.statNumber}>{disciplineScore ? `${disciplineScore.score}/${disciplineScore.base_points}` : '—'}</Text>
                <Text style={styles.statLabel}>DISCIPLINE</Text>
              </View>
            </View>
          </FadeInUp>
        )}
      </LinearGradient>

      {/* Child Switcher - Always visible, shows "Unique" badge for single child */}
      <View style={styles.switcherWrap}>
        <ChildSwitcher />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.encre} />}
      >
        {isLoading && <LoadingState />}
        {isError && <ErrorState onRetry={refetch} />}

        {financial && financial.echeanceCount > 0 && (
          <FadeInUp delay={180}>
            <PressableScale onPress={() => router.push('/(parent)/paiements')}>
              <View style={[styles.financeCard, cardShadow]}>
                <View style={styles.financeHeaderRow}>
                  <View style={styles.financeIconCircle}>
                    <Ionicons name="wallet-outline" size={18} color={colors.or} />
                  </View>
                  <Text style={styles.financeTitle}>Minerval</Text>
                  {financial.enRetardCount > 0 && (
                    <View style={styles.financeAlertPill}>
                      <Text style={styles.financeAlertText}>{financial.enRetardCount} en retard</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={18} color={colors.ardoiseMuted} />
                </View>

                <Text style={styles.financeRemaining}>{financial.remaining.toLocaleString('fr-FR')} FBu</Text>
                <Text style={styles.financeRemainingLabel}>restant à payer</Text>

                <View style={styles.financeFootRow}>
                  <View>
                    <Text style={styles.financeFootValue}>{financial.totalDue.toLocaleString('fr-FR')}</Text>
                    <Text style={styles.financeFootLabel}>Total dû</Text>
                  </View>
                  <View>
                    <Text style={[styles.financeFootValue, { color: colors.sauge }]}>{financial.totalPaid.toLocaleString('fr-FR')}</Text>
                    <Text style={styles.financeFootLabel}>Payé</Text>
                  </View>
                </View>
              </View>
            </PressableScale>
          </FadeInUp>
        )}

        <FadeInUp delay={220}>
          <Text style={styles.sectionTitle}>À venir</Text>
          {upcomingEvents && upcomingEvents.length > 0 ? (
            upcomingEvents.map((ev) => {
              const f = formatEventRange(ev.date_debut, ev.date_fin);
              return (
                <PressableScale key={ev.id} onPress={() => router.push('/(parent)/plus/calendrier')}>
                  <View style={[styles.eventRow, cardShadow]}>
                    <View style={[styles.eventDateBox, f.isMultiDay && styles.eventDateBoxWide]}>
                      <Text style={styles.eventDay}>{f.dayLabel}</Text>
                      <Text style={styles.eventMonth}>{f.monthLabel}</Text>
                    </View>
                    <View style={styles.eventInfo}>
                      <Text style={styles.eventTitle} numberOfLines={1}>{ev.titre}</Text>
                      <Text style={styles.eventMeta}>{f.subtitle}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.ardoiseMuted} />
                  </View>
                </PressableScale>
              );
            })
          ) : (
            <View style={[styles.emptyCard, cardShadow]}>
              <Text style={styles.emptyCardText}>Rien de prévu pour le moment.</Text>
            </View>
          )}
        </FadeInUp>

        <FadeInUp delay={260}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Communiqués</Text>
            {!!stats?.communiques_non_lus && stats.communiques_non_lus > 0 && (
              <View style={styles.countPill}>
                <Text style={styles.countPillText}>{stats.communiques_non_lus} non lu{stats.communiques_non_lus > 1 ? 's' : ''}</Text>
              </View>
            )}
          </View>
          {latestCommuniques.length > 0 ? (
            latestCommuniques.map((c) => (
              <PressableScale key={c.id} onPress={() => router.push(`/(parent)/communiques/${c.id}`)}>
                <View style={[styles.communiqueRow, cardShadow]}>
                  <View style={[styles.communiqueDot, { backgroundColor: c.lu ? colors.ligne : colors.or }]} />
                  <View style={styles.communiqueInfo}>
                    <Text style={[styles.communiqueTitle, !c.lu && styles.communiqueTitleUnread]} numberOfLines={1}>{c.titre}</Text>
                    <Text style={styles.communiqueBody} numberOfLines={1}>{c.contenu}</Text>
                  </View>
                </View>
              </PressableScale>
            ))
          ) : (
            <View style={[styles.emptyCard, cardShadow]}>
              <Text style={styles.emptyCardText}>Aucun communiqué pour le moment.</Text>
            </View>
          )}
        </FadeInUp>

        <FadeInUp delay={300}>
          <Text style={styles.sectionTitle}>Comportement</Text>
          <PressableScale onPress={() => router.push('/(parent)/plus/comportement')}>
            <View style={[styles.behaviorCard, cardShadow]}>
              <View style={[styles.financeIconCircle, { backgroundColor: (stats?.fautes ?? 0) === 0 ? colors.saugeLight : colors.briqueLight }]}>
                <Ionicons name={(stats?.fautes ?? 0) === 0 ? 'shield-checkmark-outline' : 'shield-outline'} size={18} color={(stats?.fautes ?? 0) === 0 ? colors.sauge : colors.brique} />
              </View>
              <View style={styles.behaviorInfo}>
                <Text style={styles.behaviorTitle}>
                  {(stats?.fautes ?? 0) === 0 ? 'Bon comportement' : `${stats?.fautes ?? 0} faute(s), ${stats?.sanctions ?? 0} sanction(s)`}
                </Text>
                <Text style={styles.behaviorMeta}>Cette période scolaire</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.ardoiseMuted} />
            </View>
          </PressableScale>
        </FadeInUp>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brume },
  hero: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl },
  heroDate: { fontFamily: fonts.bodyMedium, fontSize: 12, color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' },
  heroChildRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, gap: spacing.md },
  heroChildInfo: { flex: 1, minWidth: 0 },
  heroChildName: { fontFamily: fonts.displayBold, fontSize: 30, color: colors.blanc },
  heroChildClasse: { fontFamily: fonts.bodyMedium, fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  statsRow: { flexDirection: 'row', marginTop: spacing.xl },
  statBlock: { flex: 1, alignItems: 'center' },
  statDividerLight: { width: 1, backgroundColor: 'rgba(255,255,255,0.18)' },
  statNumber: { fontFamily: fonts.monoBold, fontSize: 26, color: colors.blanc },
  statLabel: { fontFamily: fonts.bodyMedium, fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.6 },
  
  // Child Switcher wrapper - consistent spacing for all users
  switcherWrap: { 
    marginTop: -spacing.lg, 
    marginBottom: spacing.md 
  },
  
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl, paddingTop: spacing.sm },
  sectionTitle: { fontFamily: fonts.displaySemiBold, fontSize: 19, color: colors.ardoise, marginBottom: spacing.md },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  countPill: { backgroundColor: colors.soleilLight, borderRadius: radius.sm, paddingVertical: 4, paddingHorizontal: spacing.sm },
  countPillText: { fontFamily: fonts.bodySemiBold, fontSize: 11, color: colors.or },

  financeCard: { backgroundColor: colors.encreDark, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl },
  financeHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  financeIconCircle: { width: 32, height: 32, borderRadius: radius.sm, backgroundColor: 'rgba(212,165,57,0.18)', justifyContent: 'center', alignItems: 'center' },
  financeTitle: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: 'rgba(255,255,255,0.85)', flex: 1 },
  financeAlertPill: { backgroundColor: 'rgba(184,92,62,0.25)', borderRadius: radius.sm, paddingVertical: 3, paddingHorizontal: spacing.sm, marginRight: spacing.xs },
  financeAlertText: { fontFamily: fonts.bodySemiBold, fontSize: 11, color: '#F3A98E' },
  financeRemaining: { fontFamily: fonts.monoBold, fontSize: 34, color: colors.blanc, marginTop: spacing.md },
  financeRemainingLabel: { fontFamily: fonts.body, fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 },
  financeFootRow: { flexDirection: 'row', gap: spacing.xxl, marginTop: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)' },
  financeFootValue: { fontFamily: fonts.monoSemiBold, fontSize: 15, color: colors.blanc },
  financeFootLabel: { fontFamily: fonts.body, fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 },

  eventRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.blanc, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  eventDateBox: { width: 46, alignItems: 'center', backgroundColor: colors.encreLight, borderRadius: radius.sm, paddingVertical: spacing.xs },
  eventDateBoxWide: { backgroundColor: colors.soleilLight },
  eventDay: { fontFamily: fonts.monoBold, fontSize: 17, color: colors.encre },
  eventMonth: { fontFamily: fonts.bodyMedium, fontSize: 10, color: colors.encre, textTransform: 'uppercase' },
  eventInfo: { flex: 1, minWidth: 0 },
  eventTitle: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.ardoise },
  eventMeta: { fontFamily: fonts.body, fontSize: 12, color: colors.ardoiseMuted, marginTop: 2 },

  communiqueRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, backgroundColor: colors.blanc, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  communiqueDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  communiqueInfo: { flex: 1, minWidth: 0 },
  communiqueTitle: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.ardoiseMuted },
  communiqueTitleUnread: { fontFamily: fonts.bodySemiBold, color: colors.ardoise },
  communiqueBody: { fontFamily: fonts.body, fontSize: 12, color: colors.ardoiseMuted, marginTop: 2 },

  behaviorCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.blanc, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.md },
  behaviorInfo: { flex: 1 },
  behaviorTitle: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.ardoise },
  behaviorMeta: { fontFamily: fonts.body, fontSize: 12, color: colors.ardoiseMuted, marginTop: 2 },

  emptyCard: { backgroundColor: colors.blanc, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.xl },
  emptyCardText: { fontFamily: fonts.body, fontSize: 13, color: colors.ardoiseMuted },
});