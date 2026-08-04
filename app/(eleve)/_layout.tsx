import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/features/theme/ThemeContext';
import { fonts } from '../../src/theme/tokens';

function TabIcon({ focused, color, icon }: { focused: boolean; color: string; icon: keyof typeof Ionicons.glyphMap }) {
  const { colors } = useTheme();
  return (
    <View style={{ width: 42, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: focused ? colors.encreLight : 'transparent' }}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
  );
}

export default function EleveLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.encre,
        tabBarInactiveTintColor: colors.ardoiseMuted,
        tabBarStyle: { backgroundColor: colors.blanc, borderTopColor: colors.ligne, height: 58 + insets.bottom, paddingBottom: insets.bottom + 4, paddingTop: 6 },
        tabBarLabelStyle: { fontFamily: fonts.bodyMedium, fontSize: 11 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Accueil', tabBarIcon: ({ focused, color }) => <TabIcon focused={focused} color={color} icon={focused ? 'home' : 'home-outline'} /> }} />
      <Tabs.Screen name="resultats" options={{ title: 'Résultats', tabBarIcon: ({ focused, color }) => <TabIcon focused={focused} color={color} icon={focused ? 'school' : 'school-outline'} /> }} />
      <Tabs.Screen name="emploi" options={{ title: 'Emploi', tabBarIcon: ({ focused, color }) => <TabIcon focused={focused} color={color} icon={focused ? 'calendar' : 'calendar-outline'} /> }} />
      <Tabs.Screen name="comportement" options={{ title: 'Comportement', tabBarIcon: ({ focused, color }) => <TabIcon focused={focused} color={color} icon={focused ? 'shield' : 'shield-outline'} /> }} />
      <Tabs.Screen name="plus" options={{ title: 'Plus', tabBarIcon: ({ focused, color }) => <TabIcon focused={focused} color={color} icon={focused ? 'menu' : 'menu-outline'} /> }} />
    </Tabs>
  );
}