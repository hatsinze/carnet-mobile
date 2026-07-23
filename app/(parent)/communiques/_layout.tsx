import { Stack } from 'expo-router';
import { colors } from '../../../src/theme/tokens';

export default function CommuniquesLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerTintColor: colors.encre }}>
      <Stack.Screen name="index" options={{ title: 'Communiqués' }} />
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </Stack>
  );
}