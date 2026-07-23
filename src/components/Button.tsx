import { Pressable, Text, StyleSheet, ActivityIndicator, type PressableProps } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';

type Variant = 'primary' | 'secondary' | 'destructive';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
}

export function Button({ label, variant = 'primary', loading, disabled, ...rest }: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={[styles.base, styles[variant], isDisabled && styles.disabled]}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.encre : colors.blanc} />
      ) : (
        <Text style={[styles.label, variant === 'secondary' && styles.labelSecondary]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48, // accessible touch target
  },
  primary: { backgroundColor: colors.encre },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.encre },
  destructive: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.brique },
  disabled: { opacity: 0.5 },
  label: { color: colors.blanc, fontSize: 15, fontWeight: '600' },
  labelSecondary: { color: colors.encre },
});