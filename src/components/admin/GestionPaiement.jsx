import { useState } from 'react';

function GestionPaiement({ commande, onClose, onSave }) {
  const [modePaiement, setModePaiement] = useState('');
  const [montantEncaisse, setMontantEncaisse] = useState(commande.montant);
  const [notes, setNotes] = useState('');

  // Calculer le détail HT/TVA/TVAC par ligne
  const calculerDetailProduits = () => {
    return commande.articles.map(article => {
      const prixTVAC = article.prixUnitaire;
      const tauxTVA = article.tauxTVA;
      const prixHT = prixTVAC / (1 + tauxTVA / 100);
      const montantTVA = prixTVAC - prixHT;
      const totalLigneHT = prixHT * article.quantite;
      const totalLigneTVA = montantTVA * article.quantite;
      const totalLigneTVAC = prixTVAC * article.quantite;

      return {
        ...article,
        prixHT: prixHT,
        montantTVA: montantTVA,
        totalLigneHT: totalLigneHT,
        totalLigneTVA: totalLigneTVA,
        totalLigneTVAC: totalLigneTVAC
      };
    });
  };

  const calculerTotaux = () => {
    const details = calculerDetailProduits();
    const totalHT = details.reduce((sum, d) => sum + d.totalLigneHT, 0);
    const totalTVA = details.reduce((sum, d) => sum + d.totalLigneTVA, 0);
    const totalTVAC = details.reduce((sum, d) => sum + d.totalLigneTVAC, 0);

    return { totalHT, totalTVA, totalTVAC, details };
  };

  const handleConfirmer = () => {
    if (!modePaiement) {
      alert('Veuillez sélectionner un mode de paiement');
      return;
    }

    const paiementInfo = {
      modePaiement,
      montantEncaisse: parseFloat(montantEncaisse),
      dateEncaissement: new Date().toISOString(),
      notes,
      operateur: 'Admin' // En production: récupérer l'utilisateur connecté
    };

    onSave(paiementInfo);
  };

  const genererTicket = () => {
    const { totalHT, totalTVA, totalTVAC, details } = calculerTotaux();
    
    let ticket = `
═══════════════════════════════════════════════
           REÇU DE CAISSE / JUSTIFICATIF
═══════════════════════════════════════════════

Numéro de commande : ${commande.numero}
Date : ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR')}
Client : ${commande.membre}
Point de collecte : ${commande.pointCollecte}

───────────────────────────────────────────────
DÉTAIL DE LA COMMANDE
───────────────────────────────────────────────

`;

    details.forEach(item => {
      ticket += `${item.nom}\n`;
      ticket += `  ${item.quantite} x ${item.prixTVAC.toFixed(2)}€ TVAC (TVA ${item.tauxTVA}%)\n`;
      ticket += `  HT: ${item.totalLigneHT.toFixed(2)}€ | TVA: ${item.totalLigneTVA.toFixed(2)}€ | TVAC: ${item.totalLigneTVAC.toFixed(2)}€\n\n`;
    });

    ticket += `───────────────────────────────────────────────
TOTAUX
───────────────────────────────────────────────

Total HT          ${totalHT.toFixed(2)}€
Total TVA         ${totalTVA.toFixed(2)}€
Total TVAC        ${totalTVAC.toFixed(2)}€

───────────────────────────────────────────────
PAIEMENT
───────────────────────────────────────────────

Mode : ${modePaiement === 'carte' ? 'Carte bancaire' : 'Espèces'}
Montant encaissé : ${montantEncaisse}€
${modePaiement === 'cash' && parseFloat(montantEncaisse) > totalTVAC ? 
  `Rendu : ${(parseFloat(montantEncaisse) - totalTVAC).toFixed(2)}€` : ''}

═══════════════════════════════════════════════
Merci de votre visite !
Produits locaux de qualité
═══════════════════════════════════════════════
`;

    // Créer un blob et télécharger
    const blob = new Blob([ticket], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${commande.numero}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const { totalHT, totalTVA, totalTVAC, details } = calculerTotaux();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>💳 Enregistrement du paiement</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="commande-info">
            <p><strong>Commande :</strong> {commande.numero}</p>
            <p><strong>Client :</strong> {commande.membre}</p>
            <p><strong>Date de retrait :</strong> {new Date(commande.dateRetrait).toLocaleDateString('fr-FR')} - {commande.creneauRetrait}</p>
          </div>

          <div className="ticket-preview">
            <h3>Détail de la commande</h3>
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Qté</th>
                  <th>P.U. TVAC</th>
                  <th>TVA</th>
                  <th>Total HT</th>
                  <th>Total TVA</th>
                  <th>Total TVAC</th>
                </tr>
              </thead>
              <tbody>
                {details.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nom}</td>
                    <td>{item.quantite}</td>
                    <td>{item.prixTVAC.toFixed(2)}€</td>
                    <td>{item.tauxTVA}%</td>
                    <td>{item.totalLigneHT.toFixed(2)}€</td>
                    <td>{item.totalLigneTVA.toFixed(2)}€</td>
                    <td>{item.totalLigneTVAC.toFixed(2)}€</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="totaux-row">
                  <td colSpan="4"><strong>TOTAUX</strong></td>
                  <td><strong>{totalHT.toFixed(2)}€</strong></td>
                  <td><strong>{totalTVA.toFixed(2)}€</strong></td>
                  <td><strong>{totalTVAC.toFixed(2)}€</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="paiement-form">
            <h3>Informations de paiement</h3>
            
            <div className="form-group">
              <label>Mode de paiement *</label>
              <div className="paiement-modes">
                <button
                  type="button"
                  className={`mode-btn ${modePaiement === 'carte' ? 'active' : ''}`}
                  onClick={() => setModePaiement('carte')}
                >
                  💳 Carte bancaire
                </button>
                <button
                  type="button"
                  className={`mode-btn ${modePaiement === 'cash' ? 'active' : ''}`}
                  onClick={() => setModePaiement('cash')}
                >
                  💵 Espèces
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="montant">Montant encaissé *</label>
              <input
                id="montant"
                type="number"
                step="0.01"
                value={montantEncaisse}
                onChange={(e) => setMontantEncaisse(e.target.value)}
                className="form-control"
              />
              {modePaiement === 'cash' && parseFloat(montantEncaisse) > totalTVAC && (
                <small className="form-hint success">
                  💰 Rendu à effectuer : {(parseFloat(montantEncaisse) - totalTVAC).toFixed(2)}€
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes (optionnel)</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-control"
                rows="3"
                placeholder="Remarques particulières..."
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={genererTicket} className="btn btn-secondary">
            🖨️ Générer le ticket
          </button>
          <button onClick={onClose} className="btn btn-outline">
            Annuler
          </button>
          <button onClick={handleConfirmer} className="btn btn-primary">
            ✅ Confirmer le paiement
          </button>
        </div>
      </div>
    </div>
  );
}

export default GestionPaiement;
