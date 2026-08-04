import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { MatiereMoyenne } from '../types/moyenne';

interface RawMoyenne {
  id: number;
  matiere: string;
  coefficient: number | string;
  moyenne: number | string | null;
  pourcentage: number | string | null;
  rang_matiere: number | string | null;
}

function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function fetchMoyennes(eleveId: number, periodeId: number): Promise<MatiereMoyenne[]> {
  const res = await apiClient.get<{ data: RawMoyenne[] }>(`/eleves/${eleveId}/moyennes`, {
    params: { periode_id: periodeId },
  });

  // Laravel serializes decimal-cast attributes as strings — coerce once,
  // here, so nothing downstream has to guess types or re-parse.
  return res.data.data.map((m) => ({
    id: m.id,
    matiere: m.matiere,
    coefficient: toNumberOrNull(m.coefficient) ?? 1,
    moyenne: toNumberOrNull(m.moyenne),
    pourcentage: toNumberOrNull(m.pourcentage),
    rang_matiere: toNumberOrNull(m.rang_matiere),
  }));
}

export function useMoyennes(eleveId: number | undefined, periodeId: number | undefined) {
  return useQuery({
    queryKey: ['eleves', eleveId, 'moyennes', periodeId],
    queryFn: () => fetchMoyennes(eleveId!, periodeId!),
    enabled: !!eleveId && !!periodeId,
  });
}