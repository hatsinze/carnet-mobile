import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../src/features/auth/AuthContext";
import { colors, radius, spacing, typography } from "../../src/theme/tokens";

export default function PlusScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const items: {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  }[] = [
    {
      label: "Communiqués",
      icon: "megaphone-outline",
      onPress: () => router.push("../communiques"),
    },
    { label: "Se déconnecter", icon: "log-out-outline", onPress: logout },
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <Pressable key={item.label} style={styles.row} onPress={item.onPress}>
          <Ionicons name={item.icon} size={22} color={colors.ardoise} />
          <Text style={styles.label}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brume, padding: spacing.lg },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.blanc,
    borderWidth: 1,
    borderColor: colors.ligne,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  label: { ...typography.body, color: colors.ardoise, fontWeight: "500" },
});
