import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router/js-tabs';

import { colors } from '../../theme';

// Bottom tab bar from the mock-up: Accueil, Production, Météo, Profil.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.amber,
        tabBarInactiveTintColor: colors.slate,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 10 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Accueil', tabBarIcon: ({ focused }) => <Feather name="home" size={22} color={focused ? colors.amber : colors.slate} /> }}
      />
      <Tabs.Screen
        name="production"
        options={{ title: 'Production', tabBarIcon: ({ focused }) => <Feather name="zap" size={22} color={focused ? colors.amber : colors.slate} /> }}
      />
      <Tabs.Screen
        name="meteo"
        options={{ title: 'Météo', tabBarIcon: ({ focused }) => <Feather name="sun" size={22} color={focused ? colors.amber : colors.slate} /> }}
      />
      <Tabs.Screen
        name="profil"
        options={{ title: 'Profil', tabBarIcon: ({ focused }) => <Feather name="user" size={22} color={focused ? colors.amber : colors.slate} /> }}
      />
    </Tabs>
  );
}
