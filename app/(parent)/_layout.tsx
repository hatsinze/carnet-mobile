import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ChildProvider } from '../../src/features/children/ChildContext';
import { ChildLoader } from '../../src/features/children/ChildLoader';

export default function ParentLayout() {
  return (
    <ChildProvider>
      <ChildLoader>
        <Tabs screenOptions={{ tabBarActiveTintColor: '#14424D', headerShown: false }}>
          <Tabs.Screen name="index" options={{ title: 'Accueil', tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
          <Tabs.Screen name="resultats" options={{ title: 'Résultats', tabBarIcon: ({ color, size }) => <Ionicons name="school-outline" size={size} color={color} /> }} />
          <Tabs.Screen name="paiements" options={{ title: 'Paiements', tabBarIcon: ({ color, size }) => <Ionicons name="card-outline" size={size} color={color} /> }} />
          <Tabs.Screen name="messages" options={{ title: 'Messages', tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-outline" size={size} color={color} /> }} />
          <Tabs.Screen name="plus" options={{ title: 'Plus', tabBarIcon: ({ color, size }) => <Ionicons name="menu-outline" size={size} color={color} /> }} />
        </Tabs>
      </ChildLoader>
    </ChildProvider>
  );
}