import { View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';
import { colors, spacing, typography } from '../theme/tokens';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message = "Une erreur s'est produite.", onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.action}>
        <Button label="Réessayer" onPress={onRetry} variant="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.xxl, alignItems: 'center' },
  message: { ...typography.body, color: colors.brique, textAlign: 'center' },
  action: { marginTop: spacing.lg },
});