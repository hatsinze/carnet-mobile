import type { EvenementCalendrier } from '../types/calendrier';

export const TYPE_COLORS: Record<EvenementCalendrier['type'], string> = {
  cours: '#3B82F6',
  examen: '#EF4444',
  reunion: '#F59E0B',
  vacances: '#10B981',
  sortie: '#8B5CF6',
  echeance_paiement: '#DC2626',
};

export const TYPE_LABELS: Record<EvenementCalendrier['type'], string> = {
  cours: 'Cours', examen: 'Examen', reunion: 'Réunion', vacances: 'Vacances', sortie: 'Sortie', echeance_paiement: 'Échéance',
};

export const TYPE_ICONS: Record<EvenementCalendrier['type'], string> = {
  cours: 'book-outline',
  examen: 'document-text-outline',
  reunion: 'people-outline',
  vacances: 'sunny-outline',
  sortie: 'location-outline',
  echeance_paiement: 'card-outline',
};

export function getMonthMatrix(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks: (Date | null)[][] = [];
  let week: (Date | null)[] = new Array(startWeekday).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) { while (week.length < 7) week.push(null); weeks.push(week); }
  return weeks;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function eventOccursOnDay(event: EvenementCalendrier, day: Date): boolean {
  const start = new Date(event.date_debut); start.setHours(0, 0, 0, 0);
  const end = new Date(event.date_fin); end.setHours(23, 59, 59, 999);
  const d = new Date(day); d.setHours(12, 0, 0, 0);
  return d >= start && d <= end;
}