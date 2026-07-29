import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { Communique } from '../types/communique';
import type { EvenementCalendrier } from '../types/calendrier';
import type { PaginatedResponse } from '../types/pagination';

async function fetchLatestCommunique(): Promise<Communique | null> {
  const res = await apiClient.get<PaginatedResponse<Communique>>('/communiques', { params: { page: 1 } });
  return res.data.data[0] ?? null;
}
export function useLatestCommunique() {
  return useQuery({ queryKey: ['communiques', 'latest'], queryFn: fetchLatestCommunique });
}

async function fetchUpcomingEvenements(limit: number): Promise<EvenementCalendrier[]> {
  const res = await apiClient.get<{ data: EvenementCalendrier[] }>('/evenements-calendrier');
  const now = Date.now();
  return res.data.data
    .filter((e) => new Date(e.date_debut).getTime() >= now)
    .sort((a, b) => new Date(a.date_debut).getTime() - new Date(b.date_debut).getTime())
    .slice(0, limit);
}
export function useUpcomingEvenements(limit = 3) {
  return useQuery({ queryKey: ['evenements-calendrier', 'upcoming', limit], queryFn: () => fetchUpcomingEvenements(limit) });
}

// ⚠️ Response shape assumed as { data: { count: number } } — NotificationController
// not yet reviewed. Falls back to 0 rather than crashing if wrong; verify once confirmed.
async function fetchUnreadNotificationsCount(): Promise<number> {
  try {
    const res = await apiClient.get('/notifications/unread-count');
    return (res.data as any)?.data?.count ?? (res.data as any)?.count ?? 0;
  } catch {
    return 0;
  }
}
export function useUnreadNotificationsCount() {
  return useQuery({ queryKey: ['notifications', 'unread-count'], queryFn: fetchUnreadNotificationsCount });
}