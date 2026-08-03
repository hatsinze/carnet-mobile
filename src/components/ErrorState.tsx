import { View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';
import { useTheme } from '../features/theme/ThemeContext';
import { spacing, typography } from '../theme/tokens';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message = "Une erreur s'est produite.", onRetry }: ErrorStateProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.brume }]}>
      <Text style={[styles.message, { color: colors.brique }]}>{message}</Text>
      <View style={styles.action}>
        <Button label="Réessayer" onPress={onRetry} variant="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.xxl, alignItems: 'center', flex: 1, justifyContent: 'center' },
  message: { ...typography.body, textAlign: 'center' },
  action: { marginTop: spacing.lg },
});