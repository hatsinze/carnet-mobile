import { useMemo } from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LoadingState } from '../../src/components/LoadingState';
import { ErrorState } from '../../src/components/ErrorState';
import { EmptyState } from '../../src/components/EmptyState';
import { useEleveCalendrier } from '../../src/hooks/useEleveCalendrier';
import type { EvenementCalendrier } from '../../src/types/calendrier';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';

const TYPE_CONFIG: Record<EvenementCalendrier['type'], { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  cours: { label: 'Cours', color: '#3B82F6', icon: 'book-outline' },
  examen: { label: 'Examen', color: colors.brique, icon: 'document-text-outline' },
  reunion: { label: 'Réunion', color: colors.soleil, icon: 'people-outline' },
  vacances: { label: 'Vacances', color: colors.sauge, icon: 'sunny-outline' },
  sortie: { label: 'Sortie', color: '#8B5CF6', icon: 'location-outline' },
  echeance_paiement: { label: 'Échéance', color: colors.brique, icon: 'card-outline' },
};

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const t = new Date();
  return d.toDateString() === t.toDateString();
}

export default function EmploiDuTempsScreen() {
  const { data, isLoading, isError, refetch } = useEleveCalendrier();

  const sections = useMemo(() => {
    if (!data) return [];
    const grouped: Record<string, EvenementCalendrier[]> = {};
    [...data]
      .sort((a, b) => new Date(a.date_debut).getTime() - new Date(b.date_debut).getTime())
      .forEach((ev) => {
        const key = new Date(ev.date_debut).toISOString().split('T')[0];
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(ev);
      });
    return Object.entries(grouped).map(([date, events]) => ({ title: date, data: events }));
  }, [data]);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;
  if (sections.length === 0) return <EmptyState message="Aucun événement programmé pour le moment." />;

  return (
    <SectionList
      style={styles.container}
      sections={sections}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.content}
      renderSectionHeader={({ section: { title } }) => {
        const today = isToday(title);
        return (
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, today && styles.sectionTitleToday]}>
              {today
                ? "Aujourd'hui"
                : new Date(title).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
          </View>
        );
      }}
      renderItem={({ item }) => {
        const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.cours;
        const start = new Date(item.date_debut);
        const end = new Date(item.date_fin);
        return (
          <View style={[styles.eventCard, { borderLeftColor: config.color }]}>
            <View style={[styles.eventIcon, { backgroundColor: `${config.color}1A` }]}>
              <Ionicons name={config.icon} size={16} color={config.color} />
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitre}>{item.titre}</Text>
              <Text style={styles.eventMeta}>
                {start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                {' – '}
                {end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                {item.classe ? ` · ${item.classe}` : ''}
              </Text>
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brume },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  sectionHeader: { paddingVertical: spacing.sm },
  sectionTitle: { ...typography.label, color: colors.ardoiseMuted, textTransform: 'capitalize' },
  sectionTitleToday: { color: colors.encre, fontWeight: '700' },
  eventCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.blanc, borderWidth: 1, borderColor: colors.ligne, borderLeftWidth: 3, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md },
  eventIcon: { width: 32, height: 32, borderRadius: radius.sm, justifyContent: 'center', alignItems: 'center' },
  eventInfo: { flex: 1 },
  eventTitre: { ...typography.body, fontWeight: '600', color: colors.ardoise },
  eventMeta: { fontSize: 12, color: colors.ardoiseMuted, marginTop: 2 },
});