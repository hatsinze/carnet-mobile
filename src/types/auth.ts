export type Role = 'direction' | 'enseignant' | 'personnel_administratif' | 'parent' | 'eleve';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  roles: Role[];
  etablissement_id: number;

  eleve?: {
    id: number;
    matricule: string;
    nom: string;
    prenom: string;
  };
  parent?: {
    id: number;
    nom: string;
    prenom: string;
    telephone: string;
    eleves?: { id: number; matricule: string; nom: string; prenom: string }[];
  };
}