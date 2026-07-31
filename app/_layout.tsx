import { QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from "../src/components/ErrorBoundary";
import { AuthProvider, useAuth } from "../src/features/auth/AuthContext";
import { queryClient } from "../src/lib/query-client";
import { colors } from "../src/theme/tokens";
import { OfflineBanner } from '../src/components/OfflineBanner';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../src/features/theme/ThemeContext';

import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Fraunces_300Light,
  Fraunces_400Regular,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  Fraunces_900Black,
} from '@expo-google-fonts/fraunces';
import {
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
  IBMPlexSans_700Bold,
} from '@expo-google-fonts/ibm-plex-sans';
import {
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
  IBMPlexMono_700Bold,
} from '@expo-google-fonts/ibm-plex-mono';

SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "login";

    if (!user && !inAuthGroup) {
      router.replace("/login");
    } else if (user && inAuthGroup) {
      const isParent = user.roles.includes("parent");
      router.replace(isParent ? "/(parent)" : "/(eleve)");
    }
  }, [user, isLoading, segments, router]);

  // Notification tap → deep link. Fires when the user taps a push notification,
  // whether the app was backgrounded or fully closed.
  useEffect(() => {
    if (!user) return;

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as Record<
          string,
          unknown
        >;
        const isParent = user.roles.includes("parent");
        const base = isParent ? "/(parent)" : "/(eleve)";

        switch (data.type) {
          case "note":
            router.push(isParent ? "/resultats" : "/");
            break;
          case "sanction":
            router.push(isParent ? "/" : "/comportement");
            break;
          case "communique":
            if (
              typeof data.communique_id === "string" ||
              typeof data.communique_id === "number"
            ) {
              router.push({
                pathname: "/communiques/[id]",
                params: { id: String(data.communique_id) },
              });
            }
            break;
          case "paiement":
            if (isParent) router.push("/paiements");
            break;
          case "message":
            if (isParent) router.push(`${base}/messages/${data.conversation_id}`);
            break;
        }
      },
    );

    return () => subscription.remove();
  }, [user, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.encre} />
      </View>
    );
  }

  return <Slot />;
}

function RootNavigationWithStatusBar() {
  const { isDark } = useTheme();
  const backgroundColor = isDark ? '#0A0A0A' : colors.brume;
  
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={backgroundColor} translucent={false} />
      <RootNavigation />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_300Light, Fraunces_400Regular, Fraunces_600SemiBold, Fraunces_700Bold, Fraunces_900Black,
    IBMPlexSans_400Regular, IBMPlexSans_500Medium, IBMPlexSans_600SemiBold, IBMPlexSans_700Bold,
    IBMPlexMono_500Medium, IBMPlexMono_600SemiBold, IBMPlexMono_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <OfflineBanner />
              <RootNavigationWithStatusBar />
            </AuthProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}