/**
 * Système de traçabilité des mouvements de stock et réservations
 * Enregistre tous les événements liés au stock pour audit et traçabilité
 */

/**
 * Types de mouvements de stock
 */
export const MOUVEMENT_TYPES = {
  RESERVATION: 'RESERVATION',        // Réservation lors de la validation de commande
  ANNULATION: 'ANNULATION',          // Remise en stock lors de l'annulation
  VENTE: 'VENTE',                    // Vente confirmée (retrait effectué)
  AJUSTEMENT: 'AJUSTEMENT',          // Ajustement manuel du stock
  RECEPTION: 'RECEPTION',            // Réception de nouveaux produits
  PERTE: 'PERTE'                     // Perte/casse de produits
};

/**
 * Enregistre un mouvement de stock
 * @param {Object} mouvement - Détails du mouvement
 * @returns {Object} Le mouvement enregistré avec son ID
 */
export function enregistrerMouvement(mouvement) {
  const journal = getJournal();
  
  const mouvementComplet = {
    id: `MVT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    ...mouvement
  };

  journal.push(mouvementComplet);
  localStorage.setItem('stockJournal', JSON.stringify(journal));
  
  return mouvementComplet;
}

/**
 * Récupère le journal complet des mouvements
 * @returns {Array} Liste des mouvements
 */
export function getJournal() {
  try {
    const journal = localStorage.getItem('stockJournal');
    return journal ? JSON.parse(journal) : [];
  } catch (error) {
    console.error('Erreur lors de la lecture du journal:', error);
    return [];
  }
}

/**
 * Récupère les mouvements filtrés
 * @param {Object} filters - Critères de filtrage
 * @returns {Array} Mouvements filtrés
 */
export function getMouvementsFiltres(filters = {}) {
  const journal = getJournal();
  
  return journal.filter(mouvement => {
    if (filters.produitId && mouvement.produitId !== filters.produitId) return false;
    if (filters.type && mouvement.type !== filters.type) return false;
    if (filters.commandeId && mouvement.commandeId !== filters.commandeId) return false;
    if (filters.dateDebut && new Date(mouvement.timestamp) < new Date(filters.dateDebut)) return false;
    if (filters.dateFin && new Date(mouvement.timestamp) > new Date(filters.dateFin)) return false;
    return true;
  });
}

/**
 * Réserve du stock pour une commande
 * @param {Object} commande - La commande validée
 * @returns {Array} Les mouvements créés
 */
export function reserverStock(commande) {
  const mouvements = [];
  
  commande.produits.forEach(produit => {
    const mouvement = enregistrerMouvement({
      type: MOUVEMENT_TYPES.RESERVATION,
      produitId: produit.id,
      produitNom: produit.nom,
      quantite: -produit.quantite, // Négatif car sortie de stock
      commandeId: commande.numero,
      membre: commande.membre?.email || 'Inconnu',
      stockAvant: produit.stock,
      stockApres: produit.stock - produit.quantite,
      raison: `Réservation pour commande ${commande.numero}`
    });
    mouvements.push(mouvement);
  });
  
  return mouvements;
}

/**
 * Annule une réservation et remet en stock
 * @param {Object} commande - La commande annulée
 * @returns {Array} Les mouvements créés
 */
export function annulerReservation(commande) {
  const mouvements = [];
  
  commande.produits.forEach(produit => {
    const mouvement = enregistrerMouvement({
      type: MOUVEMENT_TYPES.ANNULATION,
      produitId: produit.id,
      produitNom: produit.nom,
      quantite: produit.quantite, // Positif car remise en stock
      commandeId: commande.numero,
      membre: commande.membre?.email || 'Inconnu',
      raison: `Annulation de commande ${commande.numero}`
    });
    mouvements.push(mouvement);
  });
  
  return mouvements;
}

/**
 * Enregistre une vente confirmée
 * @param {Object} commande - La commande distribuée
 * @returns {Array} Les mouvements créés
 */
export function confirmerVente(commande) {
  const mouvements = [];
  
  commande.produits.forEach(produit => {
    const mouvement = enregistrerMouvement({
      type: MOUVEMENT_TYPES.VENTE,
      produitId: produit.id,
      produitNom: produit.nom,
      quantite: -produit.quantite,
      commandeId: commande.numero,
      membre: commande.membre?.email || 'Inconnu',
      montant: produit.prix * produit.quantite,
      raison: `Vente confirmée - commande ${commande.numero} retirée`
    });
    mouvements.push(mouvement);
  });
  
  return mouvements;
}

/**
 * Génère un rapport de stock
 * @param {String} produitId - ID du produit
 * @returns {Object} Statistiques des mouvements
 */
export function getStatsStock(produitId) {
  const mouvements = getMouvementsFiltres({ produitId });
  
  const stats = {
    totalReservations: 0,
    totalAnnulations: 0,
    totalVentes: 0,
    totalAjustements: 0,
    solde: 0,
    dernierMouvement: null
  };

  mouvements.forEach(mvt => {
    switch (mvt.type) {
      case MOUVEMENT_TYPES.RESERVATION:
        stats.totalReservations += Math.abs(mvt.quantite);
        break;
      case MOUVEMENT_TYPES.ANNULATION:
        stats.totalAnnulations += mvt.quantite;
        break;
      case MOUVEMENT_TYPES.VENTE:
        stats.totalVentes += Math.abs(mvt.quantite);
        break;
      case MOUVEMENT_TYPES.AJUSTEMENT:
        stats.totalAjustements += mvt.quantite;
        break;
    }
    stats.solde += mvt.quantite;
  });

  stats.dernierMouvement = mouvements[mouvements.length - 1];
  
  return stats;
}

/**
 * Exporte le journal en CSV
 * @returns {String} Contenu CSV
 */
export function exporterJournalCSV() {
  const journal = getJournal();
  
  const headers = ['ID', 'Date/Heure', 'Type', 'Produit', 'Quantité', 'Commande', 'Membre', 'Raison'];
  const rows = journal.map(mvt => [
    mvt.id,
    new Date(mvt.timestamp).toLocaleString('fr-FR'),
    mvt.type,
    mvt.produitNom || mvt.produitId,
    mvt.quantite,
    mvt.commandeId || '',
    mvt.membre || '',
    mvt.raison || ''
  ]);
  
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return csv;
}
