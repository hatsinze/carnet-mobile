import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../features/theme/ThemeContext';

export function LoadingState() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.brume }]}>
      <ActivityIndicator size="large" color={colors.encre} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' } });