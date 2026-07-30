import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';

interface UpdateAccountInput {
  name?: string;
  telephone?: string;
}

export function useUpdateAccount() {
  return useMutation({
    mutationFn: (input: UpdateAccountInput) => apiClient.put('/account', input),
  });
}