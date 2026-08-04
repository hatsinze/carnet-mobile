import { Text, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../../src/components/ScreenHeader';
import { LoadingState } from '../../../../src/components/LoadingState';
import { ErrorState } from '../../../../src/components/ErrorState';
import { useTheme } from '../../../../src/features/theme/ThemeContext';
import { useCommunique } from '../../../../src/hooks/useCommuniques';
import { fonts, radius, spacing } from '../../../../src/theme/tokens';

export default function CommuniqueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { data, isLoading, isError, refetch } = useCommunique(Number(id));

  function goBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(eleve)/plus/communiques');
    }
  }

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState onRetry={refetch} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.brume }]}>
      <ScreenHeader 
        title="Communiqué" 
        fallbackRoute="/(eleve)/plus/communiques"
        onBackPress={goBack}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status */}
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: data.lu ? colors.sauge : colors.or }]} />
          <Text style={[styles.statusText, { color: colors.ardoiseMuted }]}>{data.lu ? 'Lu' : 'Non lu'}</Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.ardoise }]}>{data.titre}</Text>

        {/* Meta */}
        <View style={styles.metaRow}>
          {data.auteur && (
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color={colors.ardoiseMuted} />
              <Text style={[styles.metaText, { color: colors.ardoiseMuted }]}>Par {data.auteur}</Text>
            </View>
          )}
          {data.publie_le && (
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={colors.ardoiseMuted} />
              <Text style={[styles.metaText, { color: colors.ardoiseMuted }]}>
                {new Date(data.publie_le.replace(' ', 'T')).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          )}
        </View>

        {/* Body */}
        <View style={[styles.bodyCard, { backgroundColor: colors.brume }]}>
          <Text style={[styles.body, { color: colors.ardoise }]}>{data.contenu}</Text>
        </View>

        {/* Meeting Section */}
        {data.est_reunion && (
          <View style={[styles.meetingCard, { backgroundColor: colors.brume }]}>
            <View style={styles.meetingHeader}>
              <Ionicons name="calendar-outline" size={18} color={colors.or} />
              <Text style={[styles.meetingBadgeText, { color: colors.or }]}>Réunion</Text>
            </View>
            {data.date_heure_reunion && (
              <View style={styles.meetingRow}>
                <Ionicons name="time-outline" size={16} color={colors.ardoiseMuted} />
                <Text style={[styles.meetingText, { color: colors.ardoise }]}>
                  {new Date(data.date_heure_reunion.replace(' ', 'T')).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            )}
            {data.lieu && (
              <View style={styles.meetingRow}>
                <Ionicons name="location-outline" size={16} color={colors.ardoiseMuted} />
                <Text style={[styles.meetingText, { color: colors.ardoise }]}>{data.lieu}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xxxl },

  // Status
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontFamily: fonts.bodyMedium, fontSize: 12 },

  // Title
  title: { fontFamily: fonts.displayBold, fontSize: 24, lineHeight: 30, marginBottom: spacing.md },

  // Meta
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontFamily: fonts.body, fontSize: 13 },

  // Body
  bodyCard: { borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.lg },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 26 },

  // Meeting
  meetingCard: { borderRadius: radius.md, padding: spacing.lg },
  meetingHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md },
  meetingBadgeText: { fontFamily: fonts.bodySemiBold, fontSize: 14 },
  meetingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  meetingText: { fontFamily: fonts.body, fontSize: 14, flex: 1 },
});