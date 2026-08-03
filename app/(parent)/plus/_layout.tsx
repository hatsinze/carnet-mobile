import { Stack } from 'expo-router';

export default function PlusLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="calendrier" />
      <Stack.Screen name="comportement" />
      <Stack.Screen name="compte" />
      <Stack.Screen name="communiques" />
    </Stack>
  );
}