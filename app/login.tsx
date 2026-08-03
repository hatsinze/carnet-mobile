import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../src/features/auth/AuthContext';
import { useTheme } from '../src/features/theme/ThemeContext';
import { FadeInUp } from '../src/components/Motion';
import { fonts, radius, spacing } from '../src/theme/tokens';

export default function LoginScreen() {
  const { login } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch {
      setError('Identifiants incorrects.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.brume }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <LinearGradient colors={[colors.encreDark, colors.encre]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.logoBox, { marginTop: insets.top + spacing.xxl }]}>
          <Text style={styles.logoText}>CC</Text>
        </LinearGradient>

        <FadeInUp delay={100}>
          <Text style={[styles.title, { color: colors.ardoise }]}>Carnet de correspondance</Text>
          <Text style={[styles.subtitle, { color: colors.ardoiseMuted }]}>Connectez-vous à votre espace</Text>
        </FadeInUp>

        <FadeInUp delay={180}>
          <View style={styles.form}>
            <View>
              <Text style={[styles.label, { color: colors.ardoiseMuted }]}>Adresse e-mail</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.ligne, color: colors.ardoise, backgroundColor: colors.blanc }]}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={colors.ardoiseMuted}
                placeholder="exemple@email.com"
              />
            </View>

            <View style={{ marginTop: spacing.md }}>
              <Text style={[styles.label, { color: colors.ardoiseMuted }]}>Mot de passe</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.ligne, color: colors.ardoise, backgroundColor: colors.blanc }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={colors.ardoiseMuted}
                placeholder="••••••••"
              />
            </View>

            {error && <Text style={[styles.error, { color: colors.brique }]}>{error}</Text>}

            <Pressable
              style={[styles.button, { backgroundColor: colors.encre }, isSubmitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>{isSubmitting ? 'Connexion…' : 'Se connecter'}</Text>
            </Pressable>
          </View>
        </FadeInUp>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, justifyContent: 'center', paddingBottom: spacing.xxxl },
  logoBox: { width: 56, height: 56, borderRadius: radius.lg, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg },
  logoText: { color: '#FFFFFF', fontFamily: fonts.displayBold, fontSize: 20 },
  title: { fontFamily: fonts.displayBold, fontSize: 24, textAlign: 'center' },
  subtitle: { fontFamily: fonts.body, fontSize: 14, textAlign: 'center', marginTop: 4, marginBottom: spacing.xxl },
  form: { gap: spacing.sm },
  label: { fontFamily: fonts.bodyMedium, fontSize: 12, marginBottom: spacing.xs },
  input: { borderWidth: 1, borderRadius: radius.md, padding: spacing.md, fontFamily: fonts.body, fontSize: 15 },
  error: { fontFamily: fonts.body, fontSize: 13, marginTop: spacing.sm },
  button: { borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.xl },
  buttonText: { color: '#FFFFFF', fontFamily: fonts.bodySemiBold, fontSize: 15 },
});