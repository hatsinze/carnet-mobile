import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../features/theme/ThemeContext';
import { fonts, spacing } from '../theme/tokens';

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  fallbackRoute?: string;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, showBack = true, fallbackRoute, right }: ScreenHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  function goBack() {
    if (router.canGoBack()) router.back();
    else if (fallbackRoute) router.replace(fallbackRoute as any);
  }

  return (
    <View style={[styles.header, { backgroundColor: colors.blanc, borderBottomColor: colors.ligne, paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.side}>
        {showBack && (
          <Pressable onPress={goBack} hitSlop={10}>
            <Ionicons name="chevron-back" size={24} color={colors.encre} />
          </Pressable>
        )}
      </View>
      <Text style={[styles.title, { color: colors.ardoise }]} numberOfLines={1}>{title}</Text>
      <View style={[styles.side, { alignItems: 'flex-end' }]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth },
  side: { width: 40 },
  title: { flex: 1, textAlign: 'center', fontFamily: fonts.bodySemiBold, fontSize: 17 },
});