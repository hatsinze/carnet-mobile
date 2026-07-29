import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { MinervalEleve, FinancialSummary } from '../types/finance';

async function fetchFinancialSummary(eleveId: number): Promise<FinancialSummary> {
  const res = await apiClient.get<{ data: MinervalEleve[] }>('/minerval-eleve', {
    params: { eleve_id: eleveId, page: 1 },
  });
  const items = res.data.data;
  const totalDue = items.reduce((sum, i) => sum + i.montant_du, 0);
  const totalPaid = items.reduce((sum, i) => sum + i.montant_paye, 0);

  return {
    totalDue,
    totalPaid,
    remaining: totalDue - totalPaid,
    enRetardCount: items.filter((i) => i.statut === 'en_retard').length,
    echeanceCount: items.length,
  };
}

export function useFinancialSummary(eleveId: number | undefined) {
  return useQuery({
    queryKey: ['minerval-eleve', 'summary', eleveId],
    queryFn: () => fetchFinancialSummary(eleveId!),
    enabled: !!eleveId,
  });
}