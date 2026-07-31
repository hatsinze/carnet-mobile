import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../src/features/auth/AuthContext';
import { useTheme } from '../src/features/theme/ThemeContext';
import { fonts, radius, spacing } from '../src/theme/tokens';

export default function LoginScreen() {
  const { login } = useAuth();
  const { colors } = useTheme(); // colors already includes dark/light based on theme
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
      style={[styles.container, { backgroundColor: colors.brume }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.logoBox, { backgroundColor: colors.encre }]}>
        <Text style={styles.logoText}>CC</Text>
      </View>
      <Text style={[styles.title, { color: colors.ardoise }]}>Carnet de correspondance</Text>
      <Text style={[styles.subtitle, { color: colors.ardoiseMuted }]}>Connectez-vous à votre espace</Text>

      <View style={[styles.card, { backgroundColor: colors.blanc, borderColor: colors.ligne }]}>
        <Text style={[styles.label, { color: colors.ardoiseMuted }]}>Adresse e-mail</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.blanc, 
            borderColor: colors.ligne, 
            color: colors.ardoise 
          }]}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={colors.ardoiseMuted}
          placeholder="exemple@email.com"
        />

        <Text style={[styles.label, { color: colors.ardoiseMuted }]}>Mot de passe</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.blanc, 
            borderColor: colors.ligne, 
            color: colors.ardoise 
          }]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={colors.ardoiseMuted}
          placeholder="••••••••"
        />

        {error && <Text style={[styles.error, { color: colors.brique }]}>{error}</Text>}

        <Pressable
          style={[styles.button, { backgroundColor: colors.encre }, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Connexion…' : 'Se connecter'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  logoBox: { width: 48, height: 48, borderRadius: 12, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoText: { color: '#FFFFFF', fontWeight: '600', fontSize: 18 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 15, textAlign: 'center', marginTop: 4, marginBottom: 24 },
  card: { borderRadius: 12, borderWidth: 1, padding: 20 },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15 },
  error: { fontSize: 13, marginTop: 8 },
  button: { borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 20 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
});