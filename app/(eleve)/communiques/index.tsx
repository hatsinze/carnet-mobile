import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../../src/components/Card';
import { StatusBadge } from '../../../src/components/StatusBadge';
import { LoadingState } from '../../../src/components/LoadingState';
import { ErrorState } from '../../../src/components/ErrorState';
import { EmptyState } from '../../../src/components/EmptyState';
import { useCommuniques } from '../../../src/hooks/useCommuniques';
import { colors, spacing, typography } from '../../../src/theme/tokens';

export default function CommuniquesScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useCommuniques();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;
  if (data && data.length === 0) return <EmptyState message="Aucun communiqué pour le moment." />;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <Pressable onPress={() => router.push(`/(eleve)/communiques/${item.id}` as any)}>
          <Card style={[styles.card, !item.lu && styles.cardUnread]}>
            <View style={styles.row}>
              <Text style={[styles.titre, !item.lu && styles.titreUnread]}>{item.titre}</Text>
              {!item.lu && <StatusBadge label="Non lu" status="alert" />}
            </View>
            <Text style={styles.excerpt} numberOfLines={2}>{item.contenu}</Text>
          </Card>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, backgroundColor: colors.brume },
  card: { marginBottom: spacing.md },
  cardUnread: { borderColor: colors.encre },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xs },
  titre: { ...typography.body, color: colors.ardoise, flex: 1, marginRight: spacing.sm },
  titreUnread: { fontWeight: '700' },
  excerpt: { ...typography.body, color: colors.ardoiseMuted },
});