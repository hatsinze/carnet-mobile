import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../src/features/auth/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>CC</Text>
      </View>
      <Text style={styles.title}>Carnet de correspondance</Text>
      <Text style={styles.subtitle}>Connectez-vous à votre espace</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Adresse e-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
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
  container: { flex: 1, backgroundColor: '#F5F7F8', justifyContent: 'center', padding: 24 },
  logoBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#14424D', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoText: { color: '#FFFFFF', fontWeight: '600', fontSize: 18 },
  title: { fontSize: 24, fontWeight: '700', color: '#20242B', textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#20242B99', textAlign: 'center', marginTop: 4, marginBottom: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#D8DEE2', padding: 20 },
  label: { fontSize: 13, fontWeight: '500', color: '#20242B', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#D8DEE2', borderRadius: 8, padding: 12, fontSize: 15, color: '#20242B' },
  error: { color: '#B85C3E', fontSize: 13, marginTop: 8 },
  button: { backgroundColor: '#14424D', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 20 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
});