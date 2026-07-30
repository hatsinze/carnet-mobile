import { Stack } from 'expo-router';
import { colors } from '../../../src/theme/tokens';

export default function PlusLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerTintColor: colors.encre, headerTitleStyle: { fontFamily: 'IBMPlexSans_600SemiBold' } }}>
      <Stack.Screen name="index" options={{ title: 'Plus' }} />
      <Stack.Screen name="calendrier" options={{ title: 'Calendrier scolaire' }} />
      <Stack.Screen name="comportement" options={{ title: 'Comportement' }} />
      <Stack.Screen name="archives" options={{ title: 'Archives' }} />
      <Stack.Screen name="compte" options={{ title: 'Mon compte' }} />
    </Stack>
  );
}