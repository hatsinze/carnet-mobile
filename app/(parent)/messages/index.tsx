import { View, Text, FlatList, Pressable, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../src/components/ScreenHeader';
import { Avatar } from '../../../src/components/Avatar';
import { CommuniqueCardSkeleton } from '../../../src/components/Skeleton';
import { ErrorState } from '../../../src/components/ErrorState';
import { useTheme } from '../../../src/features/theme/ThemeContext';
import { useConversations } from '../../../src/hooks/useConversations';
import { fonts, radius, spacing } from '../../../src/theme/tokens';

const TYPE_LABELS: Record<string, string> = {
  justification_absence: "Justification d'absence",
  demande_rdv: 'Demande de rendez-vous',
  question_generale: 'Question générale',
};

function timeAgo(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr.replace(' ', 'T'));
  const diffH = (Date.now() - d.getTime()) / 3600000;
  if (diffH < 24) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  if (diffH < 48) return 'Hier';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function MessagesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { data, isLoading, isError, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useConversations();
  const items = data?.pages.flatMap((p) => p.data) ?? [];

  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.brume }]}>
      <ScreenHeader
        title="Messages"
        showBack={false}
        right={
          <Pressable style={[styles.composeButton, { backgroundColor: colors.encre }]} onPress={() => router.push('/(parent)/messages/new')}>
            <Ionicons name="create-outline" size={16} color="#FFFFFF" />
          </Pressable>
        }
      />

      {isLoading ? (
        <View style={styles.content}>{[1, 2, 3, 4].map((i) => <CommuniqueCardSkeleton key={i} />)}</View>
      ) : items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="chatbubbles-outline" size={40} color={colors.ardoiseMuted} />
          <Text style={[styles.emptyText, { color: colors.ardoiseMuted }]}>Aucune conversation pour le moment.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.encre} />}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.4}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.encre} style={{ marginVertical: spacing.md }} /> : null}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/(parent)/messages/${item.id}`)}>
              <View style={[styles.row, { borderBottomColor: colors.ligne }]}>
                <Avatar name={`${item.eleve.prenom} ${item.eleve.nom}`} size={48} />
                <View style={styles.rowInfo}>
                  <View style={styles.rowTop}>
                    <Text style={[styles.name, { color: colors.ardoise }]} numberOfLines={1}>{item.eleve.prenom} {item.eleve.nom}</Text>
                    <Text style={[styles.time, { color: colors.ardoiseMuted }]}>{timeAgo(item.dernier_message?.envoye_le)}</Text>
                  </View>
                  <View style={styles.rowBottom}>
                    <Text style={[styles.preview, { color: item.unread_count ? colors.ardoise : colors.ardoiseMuted, fontFamily: item.unread_count ? fonts.bodySemiBold : fonts.body }]} numberOfLines={1}>
                      {item.dernier_message?.contenu ?? TYPE_LABELS[item.type]}
                    </Text>
                    {!!item.unread_count && item.unread_count > 0 && (
                      <View style={[styles.unreadBadge, { backgroundColor: colors.encre }]}>
                        <Text style={styles.unreadBadgeText}>{item.unread_count > 9 ? '9+' : item.unread_count}</Text>
                      </View>
                    )}
                    {item.statut === 'fermee' && (
                      <View style={[styles.closedTag, { backgroundColor: colors.brume }]}>
                        <Text style={[styles.closedTagText, { color: colors.ardoiseMuted }]}>Fermée</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  composeButton: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emptyText: { fontFamily: fonts.body, fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth },
  rowInfo: { flex: 1, minWidth: 0 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontFamily: fonts.bodySemiBold, fontSize: 15, flex: 1, marginRight: spacing.sm },
  time: { fontFamily: fonts.body, fontSize: 12 },
  rowBottom: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 3 },
  preview: { fontFamily: fonts.body, fontSize: 13, flex: 1 },
  unreadBadge: { minWidth: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  unreadBadgeText: { fontFamily: fonts.bodyBold, fontSize: 11, color: '#FFFFFF' },
  closedTag: { borderRadius: radius.sm, paddingVertical: 2, paddingHorizontal: 6 },
  closedTagText: { fontFamily: fonts.bodyMedium, fontSize: 9 },
});