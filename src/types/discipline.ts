export interface DisciplineScore {
  base_points: number;
  score: number;
  pourcentage: number;
  points_retires: number;
}

export interface DisciplineRetrait {
  id: number;
  points_retires: number;
  motif: string;
  source: 'faute' | 'sanction' | 'decision_conseil';
  date: string;
  applique_par: string | null;
  status: 'applied' | 'cancelled';
  faute: { id: number; description: string; niveau_gravite: 'leger' | 'moyen' | 'grave' } | null;
}

export interface EleveBilanDetail {
  eleve: { id: number; nom: string; prenom: string };
  score: DisciplineScore;
  retraits: DisciplineRetrait[];
}