export interface Periode {
  id: number;
  annee_scolaire_id: number;
  nom: string;
  type: 'mensuel' | 'trimestriel' | 'annuel';
  date_debut: string;
  date_fin: string;
  ordre: number;
}