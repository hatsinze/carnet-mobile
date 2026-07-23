import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { MinervalEleve } from '../types/finance';

async function fetchMinervalEleves(eleveId: number): Promise<MinervalEleve[]> {
  const res = await apiClient.get<{ data: MinervalEleve[] }>('/minerval-eleve', {
    params: { eleve_id: eleveId },
  });
  return res.data.data;
}

export function useMinervalEleves(eleveId: number | undefined) {
  return useQuery({
    queryKey: ['minerval-eleve', eleveId],
    queryFn: () => fetchMinervalEleves(eleveId!),
    enabled: !!eleveId,
  });
}