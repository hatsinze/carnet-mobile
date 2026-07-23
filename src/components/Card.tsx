import { View, StyleSheet, type ViewProps } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';

export function Card({ style, ...rest }: ViewProps) {
  return <View style={[styles.card, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.blanc,
    borderWidth: 1,
    borderColor: colors.ligne,
    borderRadius: radius.md,
    padding: spacing.lg,
    // no shadow by default — Doc 3 reserves shadows for modals/overlays only
  },
});