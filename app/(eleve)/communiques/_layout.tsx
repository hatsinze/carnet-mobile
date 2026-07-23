import { Stack } from 'expo-router';
import { colors } from '../../../src/theme/tokens';

export default function CommuniquesLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: true, 
      headerTintColor: colors.encre,
      headerStyle: { backgroundColor: colors.blanc },
      headerTitleStyle: { color: colors.ardoise, fontWeight: '600' },
      headerBackTitle: 'Retour',
    }}>
      <Stack.Screen name="index" options={{ title: 'Communiqués' }} />
      <Stack.Screen name="[id]" options={{ title: 'Détail' }} />
    </Stack>
  );
}