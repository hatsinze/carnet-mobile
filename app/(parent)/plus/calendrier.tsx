import { useState, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MonthCalendar } from '../../../src/components/MonthCalendar';
import { SegmentedControl } from '../../../src/components/SegmentedControl';
import { FadeInUp } from '../../../src/components/Motion';
import { LoadingState } from '../../../src/components/LoadingState';
import { ErrorState } from '../../../src/components/ErrorState';
import { useTheme } from '../../../src/features/theme/ThemeContext';
import { useEleveCalendrier } from '../../../src/hooks/useEleveCalendrier';
import { eventOccursOnDay, TYPE_COLORS, TYPE_LABELS, TYPE_ICONS } from '../../../src/lib/calendar-utils';
import type { EvenementCalendrier } from '../../../src/types/calendrier';
import { fonts, radius, spacing } from '../../../src/theme/tokens';

function EventRow({ event, muted, colors }: { event: EvenementCalendrier; muted?: boolean; colors: any }) {
  const start = new Date(event.date_debut);
  const end = new Date(event.date_fin);
  const isMulti = start.toDateString() !== end.toDateString();
  const durationDays = isMulti ? Math.round((end.getTime() - start.getTime()) / 86400000) + 1 : null;
  const color = TYPE_COLORS[event.type];

  return (
    <View style={[styles.eventRow, muted && { opacity: 0.5 }]}>
      <View style={[styles.eventIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={TYPE_ICONS[event.type] as any} size={17} color={color} />
      </View>
      <View style={styles.eventInfo}>
        <Text style={[styles.eventTitle, { color: colors.ardoise }]} numberOfLines={1}>{event.titre}</Text>
        <Text style={[styles.eventDate, { color: colors.ardoiseMuted }]}>
          {isMulti
            ? `${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} → ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} · ${durationDays} jours`
            : `${start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
          {event.classe ? ` · ${event.classe}` : ''}
        </Text>
      </View>
      <View style={[styles.typeChip, { backgroundColor: `${color}20` }]}>
        <Text style={[styles.typeChipText, { color }]}>{TYPE_LABELS[event.type]}</Text>
      </View>
    </View>
  );
}

export default function CalendrierScreen() {
  const { colors } = useTheme();
  const { data, isLoading, isError, refetch, isRefetching } = useEleveCalendrier();
  const [viewMode, setViewMode] = useState<'mois' | 'liste'>('mois');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dayEvents = useMemo(() => (data ?? []).filter((e) => eventOccursOnDay(e, selectedDate)), [data, selectedDate]);
  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const up = (data ?? []).filter((e) => new Date(e.date_fin) >= now).sort((a, b) => +new Date(a.date_debut) - +new Date(b.date_debut));
    const pa = (data ?? []).filter((e) => new Date(e.date_fin) < now).sort((a, b) => +new Date(b.date_debut) - +new Date(a.date_debut)).slice(0, 8);
    return { upcoming: up, past: pa };
  }, [data]);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.blanc }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.encre} />}
    >
      <SegmentedControl options={[{ value: 'mois', label: 'Mois' }, { value: 'liste', label: 'Liste' }]} value={viewMode} onChange={setViewMode} />
      <View style={{ height: spacing.lg }} />

      {viewMode === 'mois' ? (
        <FadeInUp key="mois">
          <View style={[styles.calendarBox, { borderColor: colors.ligne }]}>
            <MonthCalendar currentMonth={currentMonth} onChangeMonth={setCurrentMonth} selectedDate={selectedDate} onSelectDate={setSelectedDate} events={data ?? []} />
          </View>
          <Text style={[styles.sectionTitle, { color: colors.ardoise }]}>{selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
          {dayEvents.length === 0 ? (
            <View style={styles.emptyDay}>
              <Ionicons name="calendar-clear-outline" size={20} color={colors.ardoiseMuted} />
              <Text style={[styles.emptyDayText, { color: colors.ardoiseMuted }]}>Aucun événement ce jour-là</Text>
            </View>
          ) : (
            dayEvents.map((ev, i) => (
              <View key={ev.id}>
                <EventRow event={ev} colors={colors} />
                {i < dayEvents.length - 1 && <View style={[styles.divider, { backgroundColor: colors.ligne }]} />}
              </View>
            ))
          )}
        </FadeInUp>
      ) : (
        <FadeInUp key="liste">
          {upcoming.length === 0 && past.length === 0 && (
            <View style={styles.emptyDay}>
              <Ionicons name="calendar-outline" size={22} color={colors.ardoiseMuted} />
              <Text style={[styles.emptyDayText, { color: colors.ardoiseMuted }]}>Aucun événement à venir</Text>
            </View>
          )}
          {upcoming.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.ardoise }]}>À venir</Text>
              {upcoming.map((ev, i) => (
                <View key={ev.id}>
                  <EventRow event={ev} colors={colors} />
                  {i < upcoming.length - 1 && <View style={[styles.divider, { backgroundColor: colors.ligne }]} />}
                </View>
              ))}
            </>
          )}
          {past.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.ardoise, marginTop: spacing.xl }]}>Récemment passés</Text>
              {past.map((ev, i) => (
                <View key={ev.id}>
                  <EventRow event={ev} muted colors={colors} />
                  {i < past.length - 1 && <View style={[styles.divider, { backgroundColor: colors.ligne }]} />}
                </View>
              ))}
            </>
          )}
        </FadeInUp>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  calendarBox: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl },
  sectionTitle: { fontFamily: fonts.displaySemiBold, fontSize: 16, marginBottom: spacing.md, textTransform: 'capitalize' },
  emptyDay: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.sm },
  emptyDayText: { fontFamily: fonts.body, fontSize: 13 },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  eventIcon: { width: 38, height: 38, borderRadius: radius.sm, justifyContent: 'center', alignItems: 'center' },
  eventInfo: { flex: 1, minWidth: 0 },
  eventTitle: { fontFamily: fonts.bodySemiBold, fontSize: 14 },
  eventDate: { fontFamily: fonts.body, fontSize: 12, marginTop: 2 },
  typeChip: { borderRadius: radius.sm, paddingVertical: 4, paddingHorizontal: spacing.sm },
  typeChipText: { fontFamily: fonts.bodySemiBold, fontSize: 10 },
  divider: { height: 1 },
});