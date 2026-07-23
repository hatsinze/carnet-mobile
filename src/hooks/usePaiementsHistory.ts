import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { PaiementHistorique } from '../types/finance';

async function fetchPaiements(minervalEleveId: number): Promise<PaiementHistorique[]> {
  const res = await apiClient.get<{ data: PaiementHistorique[] }>(`/minerval-eleve/${minervalEleveId}/paiements`);
  return res.data.data;
}

export function usePaiementsHistory(minervalEleveId: number | undefined) {
  return useQuery({
    queryKey: ['minerval-eleve', minervalEleveId, 'paiements'],
    queryFn: () => fetchPaiements(minervalEleveId!),
    enabled: !!minervalEleveId,
  });
}