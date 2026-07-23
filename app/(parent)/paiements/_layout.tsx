import { Stack } from 'expo-router';
import { colors } from '../../../src/theme/tokens';

export default function PaiementsLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerTintColor: colors.encre }}>
      <Stack.Screen name="index" options={{ title: 'Paiements' }} />
      <Stack.Screen name="[id]" options={{ title: 'Détail' }} />
    </Stack>
  );
}