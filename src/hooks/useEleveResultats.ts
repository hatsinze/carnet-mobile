import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { EleveResultats } from '../types/eleve-resultats';

async function fetchResultats(periodeId: number): Promise<EleveResultats> {
  const res = await apiClient.get<{ data: EleveResultats }>('/eleve/resultats', {
    params: { periode_id: periodeId },
  });
  return res.data.data;
}

export function useEleveResultats(periodeId: number | undefined) {
  return useQuery({
    queryKey: ['eleve', 'resultats', periodeId],
    queryFn: () => fetchResultats(periodeId!),
    enabled: !!periodeId,
  });
}