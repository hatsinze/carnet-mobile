import { Text, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

interface LastUpdatedProps {
  timestamp: number | undefined;
}

export function LastUpdated({ timestamp }: LastUpdatedProps) {
  if (!timestamp) return null;

  const time = new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const today = new Date(timestamp).toDateString() === new Date().toDateString();
  const label = today ? `aujourd'hui ${time}` : new Date(timestamp).toLocaleDateString('fr-FR');

  return <Text style={styles.text}>Dernière mise à jour : {label}</Text>;
}

const styles = StyleSheet.create({
  text: { fontSize: 12, color: colors.ardoiseMuted, textAlign: 'center', paddingVertical: 6 },
});