export interface ContactableStaff {
  id: number;
  user_id: number;
  nom: string;
  prenom: string;
  telephone: string | null;
  email: string | null;
  matiere: string; // subject taught, or "Direction"
}