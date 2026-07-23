import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { Periode } from '../types/periode';

async function fetchPeriodes(): Promise<Periode[]> {
  const res = await apiClient.get<{ data: Periode[] }>('/periodes');
  return res.data.data;
}

export function usePeriodes() {
  return useQuery({ queryKey: ['periodes'], queryFn: fetchPeriodes });
}