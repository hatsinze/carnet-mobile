import { QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { ErrorBoundary } from "../src/components/ErrorBoundary";
import { AuthProvider, useAuth } from "../src/features/auth/AuthContext";
import { queryClient } from "../src/lib/query-client";
import { colors } from "../src/theme/tokens";

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

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RootNavigation />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
