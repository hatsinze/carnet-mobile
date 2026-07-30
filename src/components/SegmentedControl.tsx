import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, radius } from '../theme/tokens';

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <View style={styles.track}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable key={opt.value} style={[styles.segment, active && styles.segmentActive]} onPress={() => onChange(opt.value)}>
            <Text style={[styles.label, active && styles.labelActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', backgroundColor: colors.brume, borderRadius: radius.sm, padding: 3 },
  segment: { flex: 1, paddingVertical: 7, alignItems: 'center', borderRadius: radius.sm - 2 },
  segmentActive: { backgroundColor: colors.blanc, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 1 },
  label: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.ardoiseMuted },
  labelActive: { fontFamily: fonts.bodySemiBold, color: colors.ardoise },
});