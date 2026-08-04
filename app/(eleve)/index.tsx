import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../../src/components/Avatar';
import { FadeInUp, PressableScale } from '../../src/components/Motion';
import { LoadingState } from '../../src/components/LoadingState';
import { ErrorState } from '../../src/components/ErrorState';
import { useTheme } from '../../src/features/theme/ThemeContext';
import { useAuth } from '../../src/features/auth/AuthContext';
import { usePeriodes } from '../../src/hooks/usePeriodes';
import { useBilanEleve } from '../../src/hooks/useBilanEleve';
import { useUpcomingEvenements } from '../../src/hooks/useAccueilExtras';
import { useCommuniques } from '../../src/hooks/useCommuniques';
import { useEleveResultats } from '../../src/hooks/useEleveResultats';
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

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

export default function AccueilScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user } = useAuth();
  const eleve = user?.eleve;
  
  // Get the first period (current) for consistent data
  const { data: periodes } = usePeriodes();
  const currentPeriodeId = periodes && periodes.length > 0 ? periodes[0].id : undefined;
  
  // Use the same data source as Résultats for consistency
  const { data: resultatsData, isLoading, isError, refetch, isRefetching } = useEleveResultats(currentPeriodeId);
  const { data: bilan } = useBilanEleve(eleve?.id, currentPeriodeId);
  const { data: upcomingEvents } = useUpcomingEvenements(2);
  const { data: communiquesData } = useCommuniques();

  const fullName = eleve ? `${eleve.prenom} ${eleve.nom}` : '';
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const latestCommuniques = communiquesData?.pages[0]?.data.slice(0, 2) ?? [];
  const disciplineScore = bilan?.score;

  // Get data from resultats (same as Résultats tab)
  const generalAvg = resultatsData?.classement?.moyenne_generale ?? null;
  const rank = resultatsData?.classement?.rang_general ?? null;
  
  // Calculate fautes from bilan or use 0
  const fautes = bilan?.score?.points_retires ?? 0;
  const sanctions = 0; // If you have sanctions data, add it here

  // Get communiques non lus from communiquesData or use 0
  const communiquesNonLus = communiquesData?.pages[0]?.data.filter((c) => !c.lu).length ?? 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.brume }]}>
      <LinearGradient colors={[colors.encreDark, colors.encre]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.heroDate}>{today}</Text>

        {eleve && (
          <FadeInUp delay={80}>
            <View style={styles.heroChildRow}>
              <Avatar name={fullName} size={52} />
              <View style={styles.heroChildInfo}>
                <Text style={styles.heroChildName} numberOfLines={1}>{greeting()}, {eleve.prenom}</Text>
                {eleve.matricule && <Text style={styles.heroChildClasse}>{eleve.matricule}</Text>}
              </View>
            </View>
          </FadeInUp>
        )}

        {resultatsData && (
          <FadeInUp delay={140}>
            <View style={styles.statsRow}>
              <View style={styles.statBlock}>
                <Text style={styles.statNumber}>{generalAvg !== null ? generalAvg.toFixed(1) : '—'}</Text>
                <Text style={styles.statLabel}>MOYENNE /20</Text>
              </View>
              <View style={styles.statDividerLight} />
              <View style={styles.statBlock}>
                <Text style={styles.statNumber}>
                  {rank !== null ? `${rank}e` : '—'}
                </Text>
                <Text style={styles.statLabel}>RANG</Text>
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

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.encre} />}
      >
        {isLoading && <LoadingState />}
        {isError && <ErrorState onRetry={refetch} />}

        {/* À venir Section */}
        <FadeInUp delay={220}>
          <Text style={[styles.sectionTitle, { color: colors.ardoise }]}>À venir</Text>
          {upcomingEvents && upcomingEvents.length > 0 ? (
            upcomingEvents.map((ev) => {
              const f = formatEventRange(ev.date_debut, ev.date_fin);
              return (
                <PressableScale key={ev.id} onPress={() => router.push('/(eleve)/emploi')}>
                  <View style={[styles.eventRow, cardShadow, { backgroundColor: colors.blanc }]}>
                    <View style={[styles.eventDateBox, { backgroundColor: colors.encreLight }]}>
                      <Text style={[styles.eventDay, { color: colors.encre }]}>{f.dayLabel}</Text>
                      <Text style={[styles.eventMonth, { color: colors.encre }]}>{f.monthLabel}</Text>
                    </View>
                    <View style={styles.eventInfo}>
                      <Text style={[styles.eventTitle, { color: colors.ardoise }]} numberOfLines={1}>{ev.titre}</Text>
                      <Text style={[styles.eventMeta, { color: colors.ardoiseMuted }]}>{f.subtitle}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.ardoiseMuted} />
                  </View>
                </PressableScale>
              );
            })
          ) : (
            <View style={[styles.emptyCard, cardShadow, { backgroundColor: colors.blanc }]}>
              <Text style={[styles.emptyCardText, { color: colors.ardoiseMuted }]}>Rien de prévu pour le moment.</Text>
            </View>
          )}
        </FadeInUp>

        {/* Communiqués Section */}
        <FadeInUp delay={260}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.ardoise }]}>Communiqués</Text>
            {communiquesNonLus > 0 && (
              <View style={[styles.countPill, { backgroundColor: colors.soleilLight }]}>
                <Text style={[styles.countPillText, { color: colors.or }]}>{communiquesNonLus} non lu{communiquesNonLus > 1 ? 's' : ''}</Text>
              </View>
            )}
          </View>
          {latestCommuniques.length > 0 ? (
            latestCommuniques.map((c) => (
              <PressableScale key={c.id} onPress={() => router.push(`/(eleve)/plus/communiques/${c.id}`)}>
                <View style={[styles.communiqueRow, cardShadow, { backgroundColor: colors.blanc }]}>
                  <View style={[styles.communiqueDot, { backgroundColor: c.lu ? colors.ligne : colors.or }]} />
                  <View style={styles.communiqueInfo}>
                    <Text style={[styles.communiqueTitle, { color: c.lu ? colors.ardoiseMuted : colors.ardoise, fontFamily: c.lu ? fonts.bodyMedium : fonts.bodyBold }]} numberOfLines={1}>{c.titre}</Text>
                    <Text style={[styles.communiqueBody, { color: colors.ardoiseMuted }]} numberOfLines={1}>{c.contenu}</Text>
                  </View>
                </View>
              </PressableScale>
            ))
          ) : (
            <View style={[styles.emptyCard, cardShadow, { backgroundColor: colors.blanc }]}>
              <Text style={[styles.emptyCardText, { color: colors.ardoiseMuted }]}>Aucun communiqué pour le moment.</Text>
            </View>
          )}
        </FadeInUp>

        {/* Comportement Section */}
        <FadeInUp delay={300}>
          <Text style={[styles.sectionTitle, { color: colors.ardoise }]}>Comportement</Text>
          <PressableScale onPress={() => router.push('/(eleve)/comportement')}>
            <View style={[styles.behaviorCard, cardShadow, { backgroundColor: colors.blanc }]}>
              <View style={[styles.behaviorIcon, { backgroundColor: fautes === 0 ? colors.saugeLight : colors.briqueLight }]}>
                <Ionicons name={fautes === 0 ? 'shield-checkmark-outline' : 'shield-outline'} size={18} color={fautes === 0 ? colors.sauge : colors.brique} />
              </View>
              <View style={styles.behaviorInfo}>
                <Text style={[styles.behaviorTitle, { color: colors.ardoise }]}>
                  {fautes === 0 ? 'Bon comportement' : `${fautes} faute(s), ${sanctions} sanction(s)`}
                </Text>
                <Text style={[styles.behaviorMeta, { color: colors.ardoiseMuted }]}>Cette période scolaire</Text>
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
  container: { flex: 1 },
  hero: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl },
  heroDate: { fontFamily: fonts.bodyMedium, fontSize: 12, color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' },
  heroChildRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, gap: spacing.md },
  heroChildInfo: { flex: 1, minWidth: 0 },
  heroChildName: { fontFamily: fonts.displayBold, fontSize: 30, color: '#FFFFFF' },
  heroChildClasse: { fontFamily: fonts.bodyMedium, fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  statsRow: { flexDirection: 'row', marginTop: spacing.xl },
  statBlock: { flex: 1, alignItems: 'center' },
  statDividerLight: { width: 1, backgroundColor: 'rgba(255,255,255,0.18)' },
  statNumber: { fontFamily: fonts.monoBold, fontSize: 26, color: '#FFFFFF' },
  statLabel: { fontFamily: fonts.bodyMedium, fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.6 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl, paddingTop: spacing.sm },

  sectionTitle: { fontFamily: fonts.displaySemiBold, fontSize: 19, color: colors.ardoise, marginBottom: spacing.md },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  countPill: { backgroundColor: colors.soleilLight, borderRadius: radius.sm, paddingVertical: 4, paddingHorizontal: spacing.sm },
  countPillText: { fontFamily: fonts.bodySemiBold, fontSize: 11, color: colors.or },

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
  behaviorIcon: { width: 32, height: 32, borderRadius: radius.sm, justifyContent: 'center', alignItems: 'center' },
  behaviorInfo: { flex: 1 },
  behaviorTitle: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.ardoise },
  behaviorMeta: { fontFamily: fonts.body, fontSize: 12, color: colors.ardoiseMuted, marginTop: 2 },

  emptyCard: { backgroundColor: colors.blanc, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.xl },
  emptyCardText: { fontFamily: fonts.body, fontSize: 13, color: colors.ardoiseMuted },
});