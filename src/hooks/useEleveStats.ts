import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { EleveStats } from '../types/eleve';

async function fetchEleveStats(eleveId: number): Promise<EleveStats> {
  const res = await apiClient.get<{ data: EleveStats }>(`/eleves/${eleveId}/stats`);
  return res.data.data;
}

export function useEleveStats(eleveId: number | undefined) {
  return useQuery({
    queryKey: ['eleves', eleveId, 'stats'],
    queryFn: () => fetchEleveStats(eleveId!),
    enabled: !!eleveId,
  });
}