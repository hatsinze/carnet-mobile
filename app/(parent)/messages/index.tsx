import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../src/components/Card';
import { StatusBadge } from '../../../src/components/StatusBadge';
import { LoadingState } from '../../../src/components/LoadingState';
import { ErrorState } from '../../../src/components/ErrorState';
import { EmptyState } from '../../../src/components/EmptyState';
import { useConversations } from '../../../src/hooks/useConversations';
import { colors, radius, spacing, typography } from '../../../src/theme/tokens';

const TYPE_LABELS: Record<string, string> = {
  justification_absence: "Justification d'absence",
  demande_rdv: 'Demande de rendez-vous',
  question_generale: 'Question générale',
};

export default function MessagesScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useConversations();

  return (
    <View style={styles.container}>
      {isLoading && <LoadingState />}
      {isError && <ErrorState onRetry={refetch} />}
      {data && data.length === 0 && <EmptyState message="Aucune conversation pour le moment." />}

      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/(parent)/messages/${item.id}` as any)}>
            <Card style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.eleveNom}>{item.eleve.prenom} {item.eleve.nom}</Text>
                {item.statut === 'fermee' && <StatusBadge label="Fermée" status="neutral" />}
              </View>
              <Text style={styles.type}>{TYPE_LABELS[item.type] ?? item.type}</Text>
              {item.dernier_message && (
                <Text style={styles.excerpt} numberOfLines={1}>{item.dernier_message.contenu}</Text>
              )}
            </Card>
          </Pressable>
        )}
      />

      <Pressable style={styles.fab} onPress={() => router.push('/(parent)/messages/new' as any)}>
        <Ionicons name="add" size={26} color={colors.blanc} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brume },
  content: { padding: spacing.lg, gap: spacing.md },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  eleveNom: { ...typography.body, fontWeight: '600', color: colors.ardoise },
  type: { fontSize: 13, color: colors.encre, fontWeight: '500', marginBottom: spacing.xs },
  excerpt: { fontSize: 14, color: colors.ardoiseMuted },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.encre,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow — FAB is the one component Doc 3 allows elevation on
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});