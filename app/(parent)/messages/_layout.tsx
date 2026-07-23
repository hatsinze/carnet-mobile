import { Stack } from 'expo-router';
import { colors } from '../../../src/theme/tokens';

export default function MessagesLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerTintColor: colors.encre }}>
      <Stack.Screen name="index" options={{ title: 'Messages' }} />
      <Stack.Screen name="[id]" options={{ title: '' }} />
      <Stack.Screen name="new" options={{ title: 'Nouveau message', presentation: 'modal' }} />
    </Stack>
  );
}