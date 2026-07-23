import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { ContactableStaff } from '../types/contact';

async function fetchContactableStaff(eleveId: number): Promise<ContactableStaff[]> {
  const res = await apiClient.get<{ data: ContactableStaff[] }>(`/eleves/${eleveId}/enseignants`);
  return res.data.data;
}

export function useContactableStaff(eleveId: number | undefined) {
  return useQuery({
    queryKey: ['eleves', eleveId, 'enseignants'],
    queryFn: () => fetchContactableStaff(eleveId!),
    enabled: !!eleveId,
  });
}