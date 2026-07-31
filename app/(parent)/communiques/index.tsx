import { View, Text, FlatList, Pressable, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LoadingState } from '../../../src/components/LoadingState';
import { ErrorState } from '../../../src/components/ErrorState';
import { EmptyState } from '../../../src/components/EmptyState';
import { FadeInUp } from '../../../src/components/Motion';
import { useTheme } from '../../../src/features/theme/ThemeContext';
import { useCommuniques } from '../../../src/hooks/useCommuniques';
import { colors, fonts, radius, spacing } from '../../../src/theme/tokens';

export default function CommuniquesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const {
    data, isLoading, isError, refetch, isRefetching,
    fetchNextPage, hasNextPage, isFetchingNextPage,
  } = useCommuniques();

  const items = data?.pages.flatMap((p) => p.data) ?? [];

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;
  if (items.length === 0) return <EmptyState message="Aucun communiqué pour le moment." />;

  function getDay(dateStr: string) {
    const d = new Date(dateStr.replace(' ', 'T'));
    return d.getDate();
  }

  function getMonthShort(dateStr: string) {
    const d = new Date(dateStr.replace(' ', 'T'));
    return d.toLocaleDateString('fr-FR', { month: 'short' });
  }

  // Theme-aware colors
  const bgColor = isDark ? '#0A0A0A' : colors.brume;
  const cardBg = isDark ? '#1C1C1E' : colors.blanc;
  const cardBorder = isDark ? '#2C2C2E' : colors.ligne;
  const textColor = isDark ? '#FFFFFF' : colors.ardoise;
  const textMuted = isDark ? '#8E8E93' : colors.ardoiseMuted;
  const surfaceBg = isDark ? '#2C2C2E' : colors.encreLight;
  const headerBg = isDark ? '#0A0A0A' : colors.blanc;
  const borderColor = isDark ? '#2C2C2E' : colors.ligne;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View style={[styles.header, { 
        paddingTop: insets.top + spacing.sm,
        backgroundColor: headerBg,
        borderBottomColor: borderColor,
      }]}>
        <View style={styles.headerContent}>
          <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(parent)')} hitSlop={10}>
            <Ionicons name="chevron-back" size={24} color={textColor} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: textColor }]}>Communiqués</Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={[styles.headerSubtitle, { color: textMuted }]}>
          {items.length} communiqué{items.length > 1 ? 's' : ''}
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.content, { backgroundColor: bgColor }]}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={textColor} />}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.4}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={textColor} style={{ marginVertical: spacing.md }} /> : null}
        renderItem={({ item, index }) => (
          <FadeInUp delay={index * 40}>
            <Pressable onPress={() => router.push(`/(parent)/communiques/${item.id}`)}>
              <View style={[styles.card, { 
                backgroundColor: cardBg,
                borderColor: cardBorder,
              }, !item.lu && styles.cardUnread]}>
                {/* Date Badge */}
                <View style={[styles.dateBadge, { backgroundColor: surfaceBg }]}>
                  <Text style={[styles.dateDay, { color: textColor }]}>
                    {getDay(item.publie_le || '')}
                  </Text>
                  <Text style={[styles.dateMonth, { color: textMuted }]}>
                    {getMonthShort(item.publie_le || '')}
                  </Text>
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: textColor }, !item.lu && styles.cardTitleUnread]} numberOfLines={1}>
                      {item.titre}
                    </Text>
                    {!item.lu && <View style={[styles.unreadDot, { backgroundColor: colors.or }]} />}
                  </View>
                  <Text style={[styles.cardSnippet, { color: textMuted }]} numberOfLines={2}>
                    {item.contenu}
                  </Text>
                  {item.est_reunion && (
                    <View style={[styles.tag, { backgroundColor: colors.soleilLight }]}>
                      <Ionicons name="calendar-outline" size={12} color={colors.or} />
                      <Text style={[styles.tagText, { color: colors.or }]}>Réunion</Text>
                    </View>
                  )}
                </View>

                {/* Chevron */}
                <Ionicons name="chevron-forward" size={18} color={textMuted} style={styles.chevron} />
              </View>
            </Pressable>
          </FadeInUp>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontFamily: fonts.displaySemiBold, fontSize: 20, letterSpacing: -0.3 },
  headerSubtitle: { fontFamily: fonts.body, fontSize: 13, marginTop: 4 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xxxl },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  cardUnread: { backgroundColor: '#FDF8F0', borderColor: '#FDE8D0' },
  dateBadge: { width: 48, alignItems: 'center', borderRadius: radius.sm, paddingVertical: 4, marginRight: spacing.sm, flexShrink: 0 },
  dateDay: { fontFamily: fonts.monoBold, fontSize: 18 },
  dateMonth: { fontFamily: fonts.bodyMedium, fontSize: 10, textTransform: 'uppercase' },
  cardContent: { flex: 1, minWidth: 0 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  cardTitle: { fontFamily: fonts.bodyMedium, fontSize: 15, flex: 1 },
  cardTitleUnread: { fontFamily: fonts.bodySemiBold },
  unreadDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  cardSnippet: { fontFamily: fonts.body, fontSize: 13, marginTop: 2, lineHeight: 18 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.sm, marginTop: 4, alignSelf: 'flex-start' },
  tagText: { fontFamily: fonts.bodyMedium, fontSize: 10 },
  chevron: { marginLeft: spacing.xs, opacity: 0.3 },
});