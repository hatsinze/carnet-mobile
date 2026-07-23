import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Card } from "../../../src/components/Card";
import { EmptyState } from "../../../src/components/EmptyState";
import { ErrorState } from "../../../src/components/ErrorState";
import { LoadingState } from "../../../src/components/LoadingState";
import { StatusBadge } from "../../../src/components/StatusBadge";
import { useCommuniques } from "../../../src/hooks/useCommuniques";
import { colors, spacing, typography } from "../../../src/theme/tokens";

export default function CommuniquesScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useCommuniques();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;
  if (data && data.length === 0)
    return <EmptyState message="Aucun communiqué pour le moment." />;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/communiques/[id]",
              params: { id: item.id },
            })
          }
        >
          <Card style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.titre}>{item.titre}</Text>
              {!item.lu && <StatusBadge label="Non lu" status="alert" />}
            </View>
            <Text style={styles.excerpt} numberOfLines={2}>
              {item.contenu}
            </Text>
            {item.publie_le && (
              <Text style={styles.date}>{item.publie_le}</Text>
            )}
          </Card>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.brume,
  },
  card: { marginBottom: spacing.md },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.xs,
  },
  titre: {
    ...typography.body,
    fontWeight: "600",
    color: colors.ardoise,
    flex: 1,
    marginRight: spacing.sm,
  },
  excerpt: {
    ...typography.body,
    color: colors.ardoiseMuted,
    marginBottom: spacing.xs,
  },
  date: { fontSize: 13, color: colors.ardoiseMuted },
});
