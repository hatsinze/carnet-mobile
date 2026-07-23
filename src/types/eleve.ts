export interface Classe {
  id: number;
  nom: string;
  niveau: string;
  section?: string | null;
}

export interface EleveSummary {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  date_naissance?: string;
  sexe?: 'm' | 'f';
  classe?: Classe | null;
  classes?: Classe[];
}

export interface EleveStats {
  moyenne_generale: number | null;
  rang: number | null;
  total_eleves: number;
  fautes: number;
  sanctions: number;
  communiques_non_lus: number;
}