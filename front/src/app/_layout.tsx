import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { InstallationProvider } from '../context/InstallationContext';
import { colors } from '../theme';

// Each screen draws its own header (BackHeader), as in the Figma mock-up.
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <InstallationProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="installation/setup" />
          <Stack.Screen name="installation/index" />
        </Stack>
      </InstallationProvider>
    </SafeAreaProvider>
  );
}
