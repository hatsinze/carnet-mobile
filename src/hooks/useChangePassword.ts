import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';

interface ChangePasswordInput {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => apiClient.post('/account/change-password', input),
  });
}