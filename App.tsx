import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
  NavigationContainer,
  type Theme as NavTheme,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastProvider } from './src/components/ToastProvider';
import { RootNavigator } from './src/navigation/RootNavigator';
import { StoreProvider, useStore } from './src/store/StoreProvider';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';

function NavTree() {
  const { mode, colors } = useTheme();
  const { state } = useStore();

  const navTheme = useMemo<NavTheme>(() => {
    const base = mode === 'dark' ? NavDarkTheme : NavLightTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.blue,
        background: colors.background,
        card: colors.surface,
        text: colors.ink,
        border: colors.line,
        notification: colors.danger,
      },
    };
  }, [mode, colors]);

  if (!state.hydrated) {
    return (
      <View style={[styles.splash, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.blue} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StoreProvider>
            <ToastProvider>
              <NavTree />
            </ToastProvider>
          </StoreProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
