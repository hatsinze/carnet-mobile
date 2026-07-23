import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { EleveBilanDetail } from '../types/discipline';

async function fetchBilanEleve(eleveId: number, periodeId: number): Promise<EleveBilanDetail> {
  const res = await apiClient.get<{ data: EleveBilanDetail }>(`/discipline/bilan/eleve/${eleveId}`, {
    params: { periode_id: periodeId },
  });
  return res.data.data;
}

export function useBilanEleve(eleveId: number | undefined, periodeId: number | undefined) {
  return useQuery({
    queryKey: ['bilan-eleve', eleveId, periodeId],
    queryFn: () => fetchBilanEleve(eleveId!, periodeId!),
    enabled: !!eleveId && !!periodeId,
  });
}