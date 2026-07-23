export interface MoyenneMatiere {
  matiere: string;
  coefficient: number;
  moyenne: number;
  pourcentage: number;
  rang_matiere: number | null;
}

export interface ClassementGeneral {
  moyenne_generale: number;
  pourcentage_general: number;
  rang_general: number;
}

export interface EleveResultats {
  eleve: { nom: string; prenom: string; matricule: string };
  moyennes: MoyenneMatiere[];
  classement: ClassementGeneral | null;
}