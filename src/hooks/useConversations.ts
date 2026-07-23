import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { Conversation, ConversationType, Message } from '../types/conversation';
//import { useRouter } from 'expo-router';

async function fetchConversations(): Promise<Conversation[]> {
  const res = await apiClient.get<{ data: Conversation[] }>('/conversations');
  return res.data.data;
}

export function useConversations() {
  return useQuery({ queryKey: ['conversations'], queryFn: fetchConversations });
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
    refetchInterval: 15000, // simple polling for new replies — no websockets in this MVP
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