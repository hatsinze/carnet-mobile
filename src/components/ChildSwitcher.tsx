import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { useChildContext } from '../features/children/ChildContext';
import { colors, radius, spacing } from '../theme/tokens';

export function ChildSwitcher() {
  const { children, selectedChild, selectChild } = useChildContext();

  if (children.length <= 1) return null; // nothing to switch between

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {children.map((child) => {
        const isActive = selectedChild?.id === child.id;
        return (
          <Pressable
            key={child.id}
            style={[styles.pill, isActive && styles.pillActive]}
            onPress={() => selectChild(child)}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{child.prenom}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm },
  pill: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.blanc,
    borderWidth: 1,
    borderColor: colors.ligne,
    marginRight: spacing.sm,
  },
  pillActive: { backgroundColor: colors.encre, borderColor: colors.encre },
  label: { fontSize: 15, fontWeight: '500', color: colors.ardoise },
  labelActive: { color: colors.blanc },
});