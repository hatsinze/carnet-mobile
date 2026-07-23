import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { MatiereMoyenne } from '../types/moyenne';

async function fetchMoyennes(eleveId: number, periodeId: number): Promise<MatiereMoyenne[]> {
  const res = await apiClient.get<{ data: MatiereMoyenne[] }>(`/eleves/${eleveId}/moyennes`, {
    params: { periode_id: periodeId },
  });
  return res.data.data;
}

export function useMoyennes(eleveId: number | undefined, periodeId: number | undefined) {
  return useQuery({
    queryKey: ['eleves', eleveId, 'moyennes', periodeId],
    queryFn: () => fetchMoyennes(eleveId!, periodeId!),
    enabled: !!eleveId && !!periodeId,
  });
}