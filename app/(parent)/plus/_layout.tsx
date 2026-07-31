import { Stack } from 'expo-router';
import { useTheme } from '../../../src/features/theme/ThemeContext';
import { fonts } from '../../../src/theme/tokens';

export default function PlusLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.blanc },
        headerTintColor: colors.encre,
        headerTitleStyle: { fontFamily: fonts.bodySemiBold, color: colors.ardoise },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Plus' }} />
      <Stack.Screen name="calendrier" options={{ title: 'Calendrier scolaire' }} />
      <Stack.Screen name="comportement" options={{ title: 'Comportement' }} />
      <Stack.Screen name="communiques" options={{ headerShown: false }} />
      <Stack.Screen name="compte" options={{ title: 'Mon compte' }} />
    </Stack>
  );
}