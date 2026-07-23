export type SanctionType = 'avertissement' | 'retenue' | 'exclusion_temporaire' | 'exclusion_definitive';

export interface Sanction {
  id: number;
  type: SanctionType;
  motif: string;
  date_debut: string;
  date_fin: string | null;
}