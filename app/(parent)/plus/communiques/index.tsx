import { useState, useMemo } from 'react';
import { View, Text, SectionList, TextInput, Pressable, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CommuniqueCardSkeleton } from '../../../../src/components/Skeleton';
import { ErrorState } from '../../../../src/components/ErrorState';
import { useTheme } from '../../../../src/features/theme/ThemeContext';
import { useCommuniques } from '../../../../src/hooks/useCommuniques';
import type { Communique } from '../../../../src/types/communique';
import { fonts, radius, spacing } from '../../../../src/theme/tokens';

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
  return Object.entries(buckets).filter(([, arr]) => arr.length > 0).map(([title, data]) => ({ title, data }));
}

export default function CommuniquesArchiveScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useCommuniques();

  const allItems = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);
  const filtered = useMemo(() => {
    if (!search.trim()) return allItems;
    const q = search.toLowerCase();
    return allItems.filter((c) => c.titre.toLowerCase().includes(q) || c.contenu.toLowerCase().includes(q));
  }, [allItems, search]);
  const sections = useMemo(() => groupByRecency(filtered), [filtered]);

  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.brume }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.count, { color: colors.ardoiseMuted }]}>
          {allItems.length} communiqué{allItems.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <View style={[styles.searchBar, { backgroundColor: colors.blanc, borderColor: colors.ligne }]}>
        <Ionicons name="search-outline" size={17} color={colors.ardoiseMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.ardoise }]}
          placeholder="Rechercher…"
          placeholderTextColor={colors.ardoiseMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}><Ionicons name="close-circle" size={17} color={colors.ardoiseMuted} /></Pressable>
        )}
      </View>

      {isLoading ? (
        <View style={styles.content}>
          {[1, 2, 3, 4].map((i) => <CommuniqueCardSkeleton key={i} />)}
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="archive-outline" size={40} color={colors.ardoiseMuted} />
          <Text style={[styles.emptyText, { color: colors.ardoiseMuted }]}>
            {allItems.length === 0 ? 'Aucun communiqué archivé.' : 'Aucun résultat pour cette recherche.'}
          </Text>
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
            <Text style={[styles.sectionHeader, { color: colors.ardoise }]}>{title}</Text>
          )}
          renderItem={({ item }) => {
            const d = item.publie_le ? new Date(item.publie_le.replace(' ', 'T')) : null;
            return (
              <Pressable onPress={() => router.push(`/(parent)/plus/communiques/${item.id}`)}>
                <View style={[styles.row, { backgroundColor: colors.blanc, borderColor: colors.ligne }]}>
                  <View style={[styles.dateBadge, { backgroundColor: colors.encreLight }]}>
                    <Text style={[styles.dateDay, { color: colors.encre }]}>{d ? d.getDate() : '–'}</Text>
                    <Text style={[styles.dateMonth, { color: colors.encre }]}>{d ? d.toLocaleDateString('fr-FR', { month: 'short' }) : ''}</Text>
                  </View>
                  <View style={styles.rowInfo}>
                    <View style={styles.rowTopLine}>
                      <Text style={[styles.titre, { color: item.lu ? colors.ardoiseMuted : colors.ardoise, fontFamily: item.lu ? fonts.bodyMedium : fonts.bodyBold }]} numberOfLines={1}>
                        {item.titre}
                      </Text>
                      {!item.lu && <View style={[styles.unreadDot, { backgroundColor: colors.or }]} />}
                    </View>
                    <Text style={[styles.snippet, { color: colors.ardoiseMuted }]} numberOfLines={2}>{item.contenu}</Text>
                    {item.est_reunion && (
                      <View style={[styles.tag, { backgroundColor: colors.soleilLight }]}>
                        <Text style={[styles.tagText, { color: colors.or }]}>Réunion</Text>
                      </View>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.ardoiseMuted} />
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  count: { fontFamily: fonts.bodyMedium, fontSize: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.md, borderWidth: 1, marginHorizontal: spacing.lg, marginTop: spacing.sm, paddingHorizontal: spacing.md, gap: spacing.sm },
  searchInput: { flex: 1, paddingVertical: 10, fontFamily: fonts.body, fontSize: 14 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emptyText: { fontFamily: fonts.body, fontSize: 13 },
  sectionHeader: { fontFamily: fonts.displaySemiBold, fontSize: 16, marginTop: spacing.lg, marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: radius.md, borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  dateBadge: { width: 44, height: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  dateDay: { fontFamily: fonts.monoBold, fontSize: 15 },
  dateMonth: { fontFamily: fonts.bodyMedium, fontSize: 9, textTransform: 'uppercase' },
  rowInfo: { flex: 1, minWidth: 0 },
  rowTopLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  titre: { fontSize: 14, flex: 1 },
  unreadDot: { width: 6, height: 6, borderRadius: 3 },
  snippet: { fontFamily: fonts.body, fontSize: 12, marginTop: 3, lineHeight: 17 },
  tag: { alignSelf: 'flex-start', borderRadius: radius.sm, paddingVertical: 2, paddingHorizontal: spacing.sm, marginTop: 6 },
  tagText: { fontFamily: fonts.bodySemiBold, fontSize: 10 },
});