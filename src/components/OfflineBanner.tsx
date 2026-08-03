import { useEffect, useRef, useState } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useIsOnline } from '../hooks/useIsOnline';
import { useTheme } from '../features/theme/ThemeContext';
import { fonts, spacing } from '../theme/tokens';

export function OfflineBanner() {
  const isOnline = useIsOnline();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const wasOffline = useRef(false);
  const [showBackOnline, setShowBackOnline] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true;
      return;
    }
    if (wasOffline.current) {
      wasOffline.current = false;
      setShowBackOnline(true);
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(1800),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => setShowBackOnline(false));
    }
  }, [isOnline, opacity]);

  if (!isOnline) {
    return (
      <Animated.View style={[styles.banner, { backgroundColor: colors.ardoise, paddingTop: insets.top + spacing.xs }]}>
        <Ionicons name="cloud-offline-outline" size={16} color="#FFFFFF" />
        <Text style={styles.text}>Hors ligne — dernières données affichées</Text>
      </Animated.View>
    );
  }

  if (showBackOnline) {
    return (
      <Animated.View style={[styles.banner, { backgroundColor: '#4C7A66', paddingTop: insets.top + spacing.xs, opacity }]}>
        <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />
        <Text style={styles.text}>De retour en ligne</Text>
      </Animated.View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  banner: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingBottom: spacing.sm },
  text: { color: '#FFFFFF', fontFamily: fonts.bodyMedium, fontSize: 13 },
});