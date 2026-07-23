export interface MinervalEleve {
  id: number;
  eleve: { id: number; nom: string; prenom: string; matricule: string };
  echeance: { id: number; libelle: string; date_echeance: string };
  montant_du: number;
  montant_paye: number;
  statut: 'a_jour' | 'en_retard' | 'paye' | 'exonere';
  jours_de_retard: number;
}

export interface PaiementHistorique {
  id: number;
  montant: number;
  mode_paiement: 'especes' | 'virement' | 'mobile_money' | 'cheque';
  paye_le: string; // pre-formatted d/m/Y from the backend
  reference_transaction: string | null;
  recu: { numero_recu: string; url_telechargement: string } | null;
}