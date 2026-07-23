export interface MatiereMoyenne {
  id: number;
  matiere: string;
  coefficient: number;
  moyenne: number;
  pourcentage: number;
  rang_matiere: number | null;
}