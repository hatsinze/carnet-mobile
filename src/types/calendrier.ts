export interface EvenementCalendrier {
  id: number;
  titre: string;
  description: string | null;
  type: 'cours' | 'examen' | 'reunion' | 'vacances' | 'sortie' | 'echeance_paiement';
  date_debut: string;
  date_fin: string;
  classe: string | null;
}