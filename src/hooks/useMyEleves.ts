import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { EleveSummary } from '../types/eleve';

async function fetchMyEleves(): Promise<EleveSummary[]> {
  const res = await apiClient.get<{ data: EleveSummary[] }>('/parents/me/eleves');
  return res.data.data;
}

export function useMyEleves() {
  return useQuery({ queryKey: ['parents', 'me', 'eleves'], queryFn: fetchMyEleves });
}