import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LoadingState } from '../../../../src/components/LoadingState';
import { ErrorState } from '../../../../src/components/ErrorState';
import { FadeInUp } from '../../../../src/components/Motion';
import { useTheme } from '../../../../src/features/theme/ThemeContext';
import { useCommunique, useConfirmerPresence } from '../../../../src/hooks/useCommuniques';
import { fonts, radius, spacing } from '../../../../src/theme/tokens';

export default function CommuniqueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const communiqueId = Number(id);
  const { data, isLoading, isError, refetch } = useCommunique(communiqueId);
  const confirmerPresence = useConfirmerPresence(communiqueId);

  function close() {
    if (router.canGoBack()) router.back();
    else router.replace('/(parent)/plus/communiques');
  }

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;
  if (!data) return null;

  const formattedDate = data.publie_le
    ? new Date(data.publie_le.replace(' ', 'T')).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '';

  const bgColor = isDark ? '#0A0A0A' : colors.blanc;
  const textColor = isDark ? '#FFFFFF' : colors.ardoise;
  const textMuted = isDark ? '#8E8E93' : colors.ardoiseMuted;
  const bodyBg = isDark ? '#1C1C1E' : colors.brume;
  const borderColor = isDark ? '#2C2C2E' : colors.ligne;
  const closeBg = isDark ? '#2C2C2E' : colors.brume;

  return (
    <View style={[styles.container, { backgroundColor: bgColor, paddingTop: insets.top }]}>
      <View style={styles.handle} />

      <View style={styles.header}>
        <View style={[styles.statusRow]}>
          <View style={[styles.statusDot, { backgroundColor: data.lu ? colors.sauge : colors.or }]} />
          <Text style={[styles.statusText, { color: textMuted }]}>{data.lu ? 'Lu' : 'Non lu'}</Text>
        </View>
        <Pressable onPress={close} hitSlop={10} style={[styles.closeButton, { backgroundColor: closeBg }]}>
          <Ionicons name="close" size={18} color={textColor} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FadeInUp delay={60}>
          <Text style={[styles.title, { color: textColor }]}>{data.titre}</Text>

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color={textMuted} />
              <Text style={[styles.metaText, { color: textMuted }]}>{data.auteur || 'Administration'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={textMuted} />
              <Text style={[styles.metaText, { color: textMuted }]}>{formattedDate}</Text>
            </View>
          </View>

          <View style={[styles.bodyCard, { backgroundColor: bodyBg }]}>
            <Text style={[styles.body, { color: textColor }]}>{data.contenu}</Text>
          </View>

          {data.est_reunion && (
            <FadeInUp delay={100}>
              <View style={[styles.meetingCard, { backgroundColor: bodyBg }]}>
                <View style={styles.meetingHeader}>
                  <Ionicons name="calendar-outline" size={18} color={colors.or} />
                  <Text style={[styles.meetingBadgeText, { color: colors.or }]}>Réunion</Text>
                </View>
                {data.date_heure_reunion && (
                  <View style={styles.meetingRow}>
                    <Ionicons name="time-outline" size={16} color={textMuted} />
                    <Text style={[styles.meetingText, { color: textColor }]}>{data.date_heure_reunion}</Text>
                  </View>
                )}
                {data.lieu && (
                  <View style={styles.meetingRow}>
                    <Ionicons name="location-outline" size={16} color={textMuted} />
                    <Text style={[styles.meetingText, { color: textColor }]}>{data.lieu}</Text>
                  </View>
                )}

                <View style={[styles.divider, { backgroundColor: borderColor }]} />

                {data.confirmation === null ? (
                  <View style={styles.confirmRow}>
                    <Pressable style={[styles.confirmButton, { backgroundColor: colors.encre }]} onPress={() => confirmerPresence.mutate('oui')} disabled={confirmerPresence.isPending}>
                      <Ionicons name="checkmark-outline" size={18} color="#FFFFFF" />
                      <Text style={styles.confirmButtonPrimaryText}>Confirmer</Text>
                    </Pressable>
                    <Pressable style={[styles.confirmButton, styles.confirmButtonSecondary, { borderColor: colors.brique }]} onPress={() => confirmerPresence.mutate('non')} disabled={confirmerPresence.isPending}>
                      <Ionicons name="close-outline" size={18} color={colors.brique} />
                      <Text style={[styles.confirmButtonSecondaryText, { color: colors.brique }]}>Décliner</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={[styles.confirmedBanner, { backgroundColor: data.confirmation === 'oui' ? colors.saugeLight : colors.briqueLight }]}>
                    <Ionicons name={data.confirmation === 'oui' ? 'checkmark-circle' : 'close-circle'} size={20} color={data.confirmation === 'oui' ? colors.sauge : colors.brique} />
                    <Text style={[styles.confirmedText, { color: data.confirmation === 'oui' ? colors.sauge : colors.brique }]}>
                      {data.confirmation === 'oui' ? 'Présence confirmée' : 'Vous avez décliné cette réunion'}
                    </Text>
                  </View>
                )}
              </View>
            </FadeInUp>
          )}
        </FadeInUp>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#00000020', alignSelf: 'center', marginTop: spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontFamily: fonts.bodyMedium, fontSize: 12 },
  closeButton: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xxxl },
  title: { fontFamily: fonts.displayBold, fontSize: 24, lineHeight: 30, marginBottom: spacing.md },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontFamily: fonts.body, fontSize: 13 },
  bodyCard: { borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.lg },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 26 },
  meetingCard: { borderRadius: radius.md, padding: spacing.lg },
  meetingHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md },
  meetingBadgeText: { fontFamily: fonts.bodySemiBold, fontSize: 14 },
  meetingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  meetingText: { fontFamily: fonts.body, fontSize: 14, flex: 1 },
  divider: { height: 1, marginVertical: spacing.md },
  confirmRow: { flexDirection: 'row', gap: spacing.sm },
  confirmButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: radius.md, paddingVertical: spacing.md },
  confirmButtonSecondary: { borderWidth: 1.5, backgroundColor: 'transparent' },
  confirmButtonPrimaryText: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: '#FFFFFF' },
  confirmButtonSecondaryText: { fontFamily: fonts.bodySemiBold, fontSize: 14 },
  confirmedBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderRadius: radius.md, padding: spacing.md },
  confirmedText: { fontFamily: fonts.bodySemiBold, fontSize: 14 },
});