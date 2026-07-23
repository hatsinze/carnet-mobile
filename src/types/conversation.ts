export type ConversationType = 'justification_absence' | 'demande_rdv' | 'question_generale';

export interface Message {
  id: number;
  expediteur: { id: number; name: string };
  contenu: string;
  piece_jointe_path: string | null;
  envoye_le: string;
}

export interface Conversation {
  id: number;
  eleve: { id: number; nom: string; prenom: string };
  type: ConversationType;
  statut: 'ouverte' | 'fermee';
  participants?: { id: number; name: string }[];
  dernier_message: { contenu: string; envoye_le: string } | null;
  messages?: Message[];
  updated_at: string;
}