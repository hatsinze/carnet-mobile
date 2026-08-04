export interface MatiereMoyenne {
  id: number;
  matiere: string;
  coefficient: number;
  moyenne: number | null;
  pourcentage: number | null;
  rang_matiere: number | null;
}