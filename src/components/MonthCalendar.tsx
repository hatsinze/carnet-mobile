import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMonthMatrix, isSameDay, eventOccursOnDay, TYPE_COLORS } from '../lib/calendar-utils';
import type { EvenementCalendrier } from '../types/calendrier';
import { useTheme } from '../features/theme/ThemeContext';
import { fonts, spacing } from '../theme/tokens';

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

interface MonthCalendarProps {
  currentMonth: Date;
  onChangeMonth: (d: Date) => void;
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  events: EvenementCalendrier[];
}

export function MonthCalendar({ currentMonth, onChangeMonth, selectedDate, onSelectDate, events }: MonthCalendarProps) {
  const { colors } = useTheme();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const weeks = getMonthMatrix(year, month);
  const today = new Date();

  function goPrev() { onChangeMonth(new Date(year, month - 1, 1)); }
  function goNext() { onChangeMonth(new Date(year, month + 1, 1)); }

  return (
    <View>
      <View style={styles.header}>
        <Pressable onPress={goPrev} hitSlop={10}><Ionicons name="chevron-back" size={20} color={colors.encre} /></Pressable>
        <Text style={[styles.monthLabel, { color: colors.ardoise }]}>{currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</Text>
        <Pressable onPress={goNext} hitSlop={10}><Ionicons name="chevron-forward" size={20} color={colors.encre} /></Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((w, i) => <Text key={i} style={[styles.weekdayLabel, { color: colors.ardoiseMuted }]}>{w}</Text>)}
      </View>

      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((day, di) => {
            if (!day) return <View key={di} style={styles.dayCell} />;
            const dayEvents = events.filter((e) => eventOccursOnDay(e, day));
            const types = [...new Set(dayEvents.map((e) => e.type))].slice(0, 3);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, today);
            return (
              <Pressable key={di} style={styles.dayCell} onPress={() => onSelectDate(day)}>
                <View style={[
                  styles.dayNumberWrap, 
                  isSelected && { backgroundColor: colors.encre }
                ]}>
                  <Text style={[
                    styles.dayNumber, 
                    { color: colors.ardoise },
                    isToday && !isSelected && { color: colors.encre, fontFamily: fonts.bodyBold },
                    isSelected && { color: colors.blanc, fontFamily: fonts.bodyBold }
                  ]}>
                    {day.getDate()}
                  </Text>
                </View>
                <View style={styles.dotsRow}>
                  {types.map((t) => <View key={t} style={[styles.dot, { backgroundColor: TYPE_COLORS[t] }]} />)}
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  monthLabel: { fontFamily: fonts.displaySemiBold, fontSize: 17, textTransform: 'capitalize' },
  weekdayRow: { flexDirection: 'row', marginBottom: spacing.xs },
  weekdayLabel: { flex: 1, textAlign: 'center', fontFamily: fonts.bodyMedium, fontSize: 11 },
  weekRow: { flexDirection: 'row' },
  dayCell: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  dayNumberWrap: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  dayNumber: { fontFamily: fonts.bodyMedium, fontSize: 13 },
  dotsRow: { flexDirection: 'row', gap: 2, marginTop: 3, height: 5 },
  dot: { width: 4, height: 4, borderRadius: 2 },
});