import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { Communique } from '../types/communique';
import type { PaginatedResponse } from '../types/pagination';

async function fetchCommuniquesPage(page: number): Promise<PaginatedResponse<Communique>> {
  const res = await apiClient.get<PaginatedResponse<Communique>>('/communiques', { params: { page } });
  return res.data;
}

export function useCommuniques() {
  return useInfiniteQuery({
    queryKey: ['communiques'],
    queryFn: ({ pageParam }) => fetchCommuniquesPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page ? lastPage.meta.current_page + 1 : undefined,
  });
}

async function fetchCommunique(id: number): Promise<Communique> {
  const res = await apiClient.get<{ data: Communique }>(`/communiques/${id}`);
  return res.data.data;
}

export function useCommunique(id: number | undefined) {
  return useQuery({
    queryKey: ['communiques', id],
    queryFn: () => fetchCommunique(id!),
    enabled: !!id,
  });
}

export function useConfirmerPresence(communiqueId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (confirmation: 'oui' | 'non') =>
      apiClient.post(`/communiques/${communiqueId}/confirmer-presence`, { confirmation }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communiques', communiqueId] });
      queryClient.invalidateQueries({ queryKey: ['communiques'] });
    },
  });
}