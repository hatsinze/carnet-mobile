import { useState, useMemo } from 'react';
import { View, Text, SectionList, TextInput, Pressable, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LoadingState } from '../../../src/components/LoadingState';
import { ErrorState } from '../../../src/components/ErrorState';
import { FadeInUp } from '../../../src/components/Motion';
import { useCommuniques } from '../../../src/hooks/useCommuniques';
import type { Communique } from '../../../src/types/communique';
import { colors, fonts, radius, spacing } from '../../../src/theme/tokens';

function groupByRecency(items: Communique[]) {
  const now = Date.now();
  const week = 7 * 86400000;
  const month = 30 * 86400000;
  const buckets: Record<string, Communique[]> = { 'Cette semaine': [], 'Ce mois-ci': [], 'Plus anciens': [] };

  for (const c of items) {
    const t = c.publie_le ? new Date(c.publie_le.replace(' ', 'T')).getTime() : now;
    const diff = now - t;
    if (diff <= week) buckets['Cette semaine'].push(c);
    else if (diff <= month) buckets['Ce mois-ci'].push(c);
    else buckets['Plus anciens'].push(c);
  }

  return Object.entries(buckets)
    .filter(([, arr]) => arr.length > 0)
    .map(([title, data]) => ({ title, data }));
}

function getMonthYear(dateStr: string) {
  const d = new Date(dateStr.replace(' ', 'T'));
  return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}

function getDay(dateStr: string) {
  const d = new Date(dateStr.replace(' ', 'T'));
  return d.getDate();
}

function getMonthShort(dateStr: string) {
  const d = new Date(dateStr.replace(' ', 'T'));
  return d.toLocaleDateString('fr-FR', { month: 'short' });
}

export default function ArchivesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useCommuniques();

  const allItems = useMemo(() => {
    return data?.pages.flatMap((p) => p.data) ?? [];
  }, [data]);

  const filtered = useMemo(() => {
    if (!search.trim()) return allItems;
    const q = search.toLowerCase();
    return allItems.filter((c) => c.titre.toLowerCase().includes(q) || c.contenu.toLowerCase().includes(q));
  }, [allItems, search]);

  const sections = useMemo(() => groupByRecency(filtered), [filtered]);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Archives</Text>
        <Text style={styles.headerSubtitle}>
          {allItems.length} communiqué{allItems.length > 1 ? 's' : ''}
        </Text>
      </View>

      {/* Search Bar - Instagram Style */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={colors.ardoiseMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher dans les archives..."
            placeholderTextColor={colors.ardoiseMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color={colors.ardoiseMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {allItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="archive-outline" size={64} color={colors.ardoiseMuted} />
          <Text style={styles.emptyTitle}>Aucune archive</Text>
          <Text style={styles.emptySubtitle}>Les communiqués que vous recevrez apparaîtront ici</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color={colors.ardoiseMuted} />
          <Text style={styles.emptyTitle}>Aucun résultat</Text>
          <Text style={styles.emptySubtitle}>Essayez un autre terme de recherche</Text>
        </View>
      ) : (
        <SectionList
          contentContainerStyle={styles.content}
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.encre} />}
          onEndReached={() => !search && hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.4}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.encre} style={{ marginVertical: spacing.md }} /> : null}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeaderWrapper}>
              <Text style={styles.sectionHeader}>{title}</Text>
              <View style={styles.sectionHeaderLine} />
            </View>
          )}
          renderItem={({ item, index }) => (
            <FadeInUp delay={index * 30}>
              <Pressable onPress={() => router.push(`/(parent)/communiques/${item.id}`)}>
                <View style={[styles.card, !item.lu && styles.cardUnread]}>
                  {/* Date Badge */}
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateDay}>{getDay(item.publie_le || '')}</Text>
                    <Text style={styles.dateMonth}>{getMonthShort(item.publie_le || '')}</Text>
                  </View>

                  {/* Content */}
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <Text style={[styles.cardTitle, !item.lu && styles.cardTitleUnread]} numberOfLines={1}>
                        {item.titre}
                      </Text>
                      {!item.lu && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.cardSnippet} numberOfLines={2}>
                      {item.contenu}
                    </Text>
                    <View style={styles.cardFooter}>
                      {item.est_reunion && (
                        <View style={styles.tag}>
                          <Ionicons name="calendar-outline" size={12} color={colors.or} />
                          <Text style={styles.tagText}>Réunion</Text>
                        </View>
                      )}
                      <Text style={styles.cardDate}>
                        {getMonthYear(item.publie_le || '')}
                      </Text>
                    </View>
                  </View>

                  {/* Chevron */}
                  <Ionicons name="chevron-forward" size={18} color={colors.ardoiseMuted} style={styles.chevron} />
                </View>
              </Pressable>
            </FadeInUp>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },

  // Header
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 28,
    color: colors.ardoise,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ardoiseMuted,
    marginTop: 2,
  },

  // Search Bar
  searchWrapper: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blanc,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E8ECF0',
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ardoise,
  },
  clearButton: {
    padding: 2,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  emptyTitle: {
    fontFamily: fonts.displaySemiBold,
    fontSize: 20,
    color: colors.ardoise,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ardoiseMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },

  // Section Header
  sectionHeaderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionHeader: {
    fontFamily: fonts.displaySemiBold,
    fontSize: 17,
    color: colors.ardoise,
  },
  sectionHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8ECF0',
  },

  // Card - Social Media Style
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blanc,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E8ECF0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardUnread: {
    backgroundColor: '#FDF8F0',
    borderColor: '#FDE8D0',
  },

  // Date Badge
  dateBadge: {
    width: 48,
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
    borderRadius: radius.sm,
    paddingVertical: 4,
    marginRight: spacing.sm,
    flexShrink: 0,
  },
  dateDay: {
    fontFamily: fonts.monoBold,
    fontSize: 18,
    color: colors.ardoise,
  },
  dateMonth: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    color: colors.ardoiseMuted,
    textTransform: 'uppercase',
  },

  // Card Content
  cardContent: {
    flex: 1,
    minWidth: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  cardTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.ardoiseMuted,
    flex: 1,
  },
  cardTitleUnread: {
    fontFamily: fonts.bodySemiBold,
    color: colors.ardoise,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.or,
    flexShrink: 0,
  },
  cardSnippet: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ardoiseMuted,
    marginTop: 2,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF8F0',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  tagText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    color: colors.or,
  },
  cardDate: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.ardoiseMuted,
  },
  chevron: {
    marginLeft: spacing.xs,
    opacity: 0.3,
  },
});