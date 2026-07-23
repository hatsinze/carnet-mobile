export interface Communique {
  id: number;
  titre: string;
  contenu: string;
  cible_type: 'toute_ecole' | 'classe' | 'eleve';
  est_reunion: boolean;
  date_heure_reunion: string | null;
  lieu: string | null;
  publie_le: string | null;
  auteur: string | null;
  lu: boolean | null;
  confirmation: 'oui' | 'non' | null;
}