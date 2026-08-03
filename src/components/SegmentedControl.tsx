import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../features/theme/ThemeContext';
import { fonts, radius } from '../theme/tokens';

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  const { colors } = useTheme();
  return (
    <View style={[styles.track, { backgroundColor: colors.brume }]}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable key={opt.value} style={[styles.segment, active && { backgroundColor: colors.blanc, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 1 }]} onPress={() => onChange(opt.value)}>
            <Text style={[styles.label, { color: active ? colors.ardoise : colors.ardoiseMuted, fontFamily: active ? fonts.bodySemiBold : fonts.bodyMedium }]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', borderRadius: radius.sm, padding: 3 },
  segment: { flex: 1, paddingVertical: 7, alignItems: 'center', borderRadius: radius.sm - 2 },
  label: { fontSize: 13 },
});