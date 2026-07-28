import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { MinervalEleve } from '../types/finance';
import type { PaginatedResponse } from '../types/pagination';

async function fetchMinervalPage(eleveId: number, page: number): Promise<PaginatedResponse<MinervalEleve>> {
  const res = await apiClient.get<PaginatedResponse<MinervalEleve>>('/minerval-eleve', {
    params: { eleve_id: eleveId, page },
  });
  return res.data;
}

export function useMinervalEleves(eleveId: number | undefined) {
  return useInfiniteQuery({
    queryKey: ['minerval-eleve', eleveId],
    queryFn: ({ pageParam }) => fetchMinervalPage(eleveId!, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page ? lastPage.meta.current_page + 1 : undefined,
    enabled: !!eleveId,
  });
}