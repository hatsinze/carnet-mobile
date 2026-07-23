import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EleveLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#14424D', headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Résultats', tabBarIcon: ({ color, size }) => <Ionicons name="school-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="emploi" options={{ title: 'Emploi', tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="comportement" options={{ title: 'Comportement', tabBarIcon: ({ color, size }) => <Ionicons name="happy-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="communiques" options={{ title: 'Communiqués', tabBarIcon: ({ color, size }) => <Ionicons name="megaphone-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="devoirs" options={{ title: 'Devoirs', tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}