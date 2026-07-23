import { View, Text, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, style, ...rest }: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={colors.ardoiseMuted}
        accessibilityLabel={label}
        {...rest}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: spacing.md },
  label: { ...typography.label, color: colors.ardoise, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.ligne,
    borderRadius: radius.sm,
    padding: spacing.md,
    fontSize: 15,
    color: colors.ardoise,
    backgroundColor: colors.blanc,
  },
  inputError: { borderColor: colors.brique },
  error: { color: colors.brique, fontSize: 13, marginTop: spacing.xs },
});