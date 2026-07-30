import { View, Text, FlatList, Pressable, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../src/components/Card';
import { StatusBadge } from '../../../src/components/StatusBadge';
import { LoadingState } from '../../../src/components/LoadingState';
import { ErrorState } from '../../../src/components/ErrorState';
import { EmptyState } from '../../../src/components/EmptyState';
import { LastUpdated } from '../../../src/components/LastUpdated';
import { useCommuniques } from '../../../src/hooks/useCommuniques';
import { colors, fonts, spacing, typography } from '../../../src/theme/tokens';

export default function CommuniquesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    data, isLoading, isError, refetch, isRefetching,
    fetchNextPage, hasNextPage, isFetchingNextPage, dataUpdatedAt,
  } = useCommuniques();

  const items = data?.pages.flatMap((p) => p.data) ?? [];

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;
  if (items.length === 0) return <EmptyState message="Aucun communiqué pour le moment." />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.brume }}>
      {/* Custom Header */}
      <View style={[headerStyles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(parent)')} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color={colors.encre} />
        </Pressable>
        <Text style={headerStyles.title}>Communiqués</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Existing FlatList */}
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.encre} />}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={<LastUpdated timestamp={dataUpdatedAt} />}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.encre} style={{ marginVertical: spacing.md }} /> : null}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/(parent)/communiques/${item.id}`)}>
            <Card style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.titre}>{item.titre}</Text>
                {!item.lu && <StatusBadge label="Non lu" status="alert" />}
              </View>
              <Text style={styles.excerpt} numberOfLines={2}>{item.contenu}</Text>
              {item.publie_le && <Text style={styles.date}>{item.publie_le}</Text>}
            </Card>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, backgroundColor: colors.brume },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xs },
  titre: { ...typography.body, fontWeight: '600', color: colors.ardoise, flex: 1, marginRight: spacing.sm },
  excerpt: { ...typography.body, color: colors.ardoiseMuted, marginBottom: spacing.xs },
  date: { fontSize: 13, color: colors.ardoiseMuted },
});

const headerStyles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: spacing.lg, 
    paddingBottom: spacing.md, 
    backgroundColor: colors.blanc, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.ligne 
  },
  title: { 
    fontFamily: fonts.bodySemiBold, 
    fontSize: 17, 
    color: colors.ardoise 
  },
});