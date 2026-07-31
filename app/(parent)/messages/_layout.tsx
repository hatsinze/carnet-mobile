import { Stack } from 'expo-router';
import { useTheme } from '../../../src/features/theme/ThemeContext';
import { fonts } from '../../../src/theme/tokens';

export default function MessagesLayout() {
  const { colors } = useTheme();
  return (
    <Stack screenOptions={{ headerShown: true, headerStyle: { backgroundColor: colors.blanc }, headerTintColor: colors.encre, headerTitleStyle: { fontFamily: fonts.bodySemiBold, color: colors.ardoise } }}>
      <Stack.Screen name="index" options={{ title: 'Messages' }} />
      <Stack.Screen name="[id]" options={{ title: '' }} />
      <Stack.Screen name="new" options={{ title: 'Nouveau message', presentation: 'modal' }} />
    </Stack>
  );
}