import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { EvenementCalendrier } from '../types/calendrier';

async function fetchCalendrier(): Promise<EvenementCalendrier[]> {
  const res = await apiClient.get<{ data: EvenementCalendrier[] }>('/evenements-calendrier');
  return res.data.data;
}

export function useEleveCalendrier() {
  return useQuery({ queryKey: ['evenements-calendrier'], queryFn: fetchCalendrier });
}