import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type { EleveResultats, MoyenneMatiere, ClassementGeneral } from '../types/eleve-resultats';

function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

interface RawEleveResultats {
  eleve: { nom: string; prenom: string; matricule: string };
  moyennes: (Omit<MoyenneMatiere, 'moyenne' | 'pourcentage' | 'rang_matiere' | 'coefficient'> & {
    coefficient: number | string;
    moyenne: number | string | null;
    pourcentage: number | string | null;
    rang_matiere: number | string | null;
  })[];
  classement: (Omit<ClassementGeneral, 'moyenne_generale' | 'pourcentage_general' | 'rang_general'> & {
    moyenne_generale: number | string;
    pourcentage_general: number | string;
    rang_general: number | string;
  }) | null;
}

async function fetchResultats(periodeId: number): Promise<EleveResultats> {
  const res = await apiClient.get<{ data: RawEleveResultats }>('/eleve/resultats', { params: { periode_id: periodeId } });
  const raw = res.data.data;

  return {
    eleve: raw.eleve,
    moyennes: raw.moyennes.map((m) => ({
      matiere: m.matiere,
      coefficient: toNumberOrNull(m.coefficient) ?? 1,
      moyenne: toNumberOrNull(m.moyenne),
      pourcentage: toNumberOrNull(m.pourcentage),
      rang_matiere: toNumberOrNull(m.rang_matiere),
    })),
    classement: raw.classement
      ? {
          moyenne_generale: toNumberOrNull(raw.classement.moyenne_generale) ?? 0,
          pourcentage_general: toNumberOrNull(raw.classement.pourcentage_general) ?? 0,
          rang_general: toNumberOrNull(raw.classement.rang_general) ?? 0,
        }
      : null,
  };
}

export function useEleveResultats(periodeId: number | undefined) {
  return useQuery({
    queryKey: ['eleve', 'resultats', periodeId],
    queryFn: () => fetchResultats(periodeId!),
    enabled: !!periodeId,
  });
}