import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { Conversation, Message, ConversationType } from '../types/conversation';
import type { PaginatedResponse } from '../types/pagination';

async function fetchConversationsPage(page: number): Promise<PaginatedResponse<Conversation>> {
  const res = await apiClient.get<PaginatedResponse<Conversation>>('/conversations', { params: { page } });
  return res.data;
}

export function useConversations() {
  return useInfiniteQuery({
    queryKey: ['conversations'],
    queryFn: ({ pageParam }) => fetchConversationsPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page ? lastPage.meta.current_page + 1 : undefined,
  });
}

async function fetchConversation(id: number): Promise<Conversation> {
  const res = await apiClient.get<{ data: Conversation }>(`/conversations/${id}`);
  return res.data.data;
}

export function useConversation(id: number | undefined) {
  return useQuery({
    queryKey: ['conversations', id],
    queryFn: () => fetchConversation(id!),
    enabled: !!id,
    refetchInterval: 15000,
  });
}

export function useReplyConversation(conversationId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (contenu: string) => {
      const res = await apiClient.post<Message>(`/conversations/${conversationId}/messages`, { contenu });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

interface StartConversationInput {
  eleve_id: number;
  destinataire_user_id: number;
  type: ConversationType;
  contenu: string;
}

export function useStartConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: StartConversationInput) => {
      const res = await apiClient.post<{ data: Conversation }>('/conversations', input);
      return res.data.data ?? (res.data as unknown as Conversation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useMarkConversationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: number) => apiClient.post(`/conversations/${conversationId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}