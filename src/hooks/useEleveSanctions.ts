import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { Sanction } from '../types/sanction';

async function fetchSanctions(eleveId: number, periodeId: number): Promise<Sanction[]> {
  const res = await apiClient.get<{ data: Sanction[] }>('/sanctions', {
    params: { eleve_id: eleveId, periode_id: periodeId },
  });
  return res.data.data;
}

export function useEleveSanctions(eleveId: number | undefined, periodeId: number | undefined) {
  return useQuery({
    queryKey: ['sanctions', eleveId, periodeId],
    queryFn: () => fetchSanctions(eleveId!, periodeId!),
    enabled: !!eleveId && !!periodeId,
  });
}