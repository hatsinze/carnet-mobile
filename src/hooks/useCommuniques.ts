import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { Communique } from '../types/communique';

async function fetchCommuniques(): Promise<Communique[]> {
  const res = await apiClient.get<{ data: Communique[] }>('/communiques');
  return res.data.data;
}

export function useCommuniques() {
  return useQuery({ queryKey: ['communiques'], queryFn: fetchCommuniques });
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