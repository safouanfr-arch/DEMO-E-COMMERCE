import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { annulerReservation } from '../../utils/stockJournal';

function MesCommandes({ user }) {
  const location = useLocation();
  const [commandes, setCommandes] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newCommande, setNewCommande] = useState(null);

  useEffect(() => {
    // Charger les commandes depuis localStorage
    const savedCommandes = JSON.parse(localStorage.getItem('commandes') || '[]');
    setCommandes(savedCommandes);

    // Si une nouvelle commande vient d'être créée
    if (location.state?.newCommande) {
      setNewCommande(location.state.newCommande);
      setShowSuccess(true);
      // Effacer le state pour éviter qu'il se réaffiche
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const canCancel = (commande) => {
    // Seules les commandes CONFIRMED ou DRAFT peuvent être annulées
    if (!['CONFIRMED', 'DRAFT'].includes(commande.statut)) return false;
    
    const dateRetrait = new Date(commande.dateRetrait);
    const now = new Date();
    const diffHours = (dateRetrait - now) / (1000 * 60 * 60);
    
    // Annulation possible si > 24h avant le retrait
    return diffHours > 24;
  };

  const handleCancelCommande = (commandeId) => {
    const commande = commandes.find(c => c.numero === commandeId);
    if (!commande) return;

    const heuresRestantes = Math.floor((new Date(commande.dateRetrait) - new Date()) / (1000 * 60 * 60));
    
    if (!confirm(`Êtes-vous sûr de vouloir annuler cette commande ?\n\nLes stocks seront remis à disposition.\nTemps disponible avant le retrait: ${heuresRestantes}h`)) {
      return;
    }

    // Remettre en stock et enregistrer l'annulation
    try {
      const mouvements = annulerReservation(commande);
      console.log('✅ Stock remis à disposition:', mouvements.length, 'produits');
    } catch (error) {
      console.error('❌ Erreur lors de l\'annulation:', error);
    }

    // Annuler la commande
    const updatedCommandes = commandes.map(c =>
      c.numero === commandeId ? { ...c, statut: 'CANCELLED', dateAnnulation: new Date().toISOString() } : c
    );
    
    setCommandes(updatedCommandes);
    localStorage.setItem('commandes', JSON.stringify(updatedCommandes));
  };

  const getStatutBadge = (statut) => {
    const statuts = {
      'DRAFT': { label: '📝 Brouillon', class: 'secondary' },
      'CONFIRMED': { label: '✅ Confirmée', class: 'success' },
      'IN_PREP': { label: '🔧 En préparation', class: 'info' },
      'READY': { label: '📦 Prête', class: 'primary' },
      'DISTRIBUTED': { label: '🎉 Distribuée', class: 'success' },
      'CANCELLED': { label: '❌ Annulée', class: 'danger' },
      // Anciens statuts pour compatibilité
      'en_attente': { label: '⏳ En attente', class: 'warning' },
      'preparee': { label: '📦 Préparée', class: 'info' },
      'retiree': { label: '✅ Retirée', class: 'success' },
      'annulee': { label: '❌ Annulée', class: 'danger' }
    };
    return statuts[statut] || statuts['CONFIRMED'];
  };

  if (showSuccess && newCommande) {
    return (
      <div className="page-container">
        <div className="success-message">
          <div className="success-icon">🎉</div>
          <h2>Commande validée avec succès !</h2>
          <p>Votre commande <strong>{newCommande.numero}</strong> a été enregistrée.</p>
          
          <div className="success-details">
            <h3>📦 Détails de retrait</h3>
            <div className="detail-card">
              <p><strong>Point de collecte:</strong> {newCommande.pointCollecte.nom}</p>
              <p><strong>Adresse:</strong> {newCommande.pointCollecte.adresse}</p>
              <p><strong>Date:</strong> {new Date(newCommande.dateRetrait).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p><strong>Créneau:</strong> {newCommande.creneauRetrait.horaire}</p>
            </div>

            <div className="alert alert-info">
              <span className="alert-icon">ℹ️</span>
              <div>
                <p><strong>Important:</strong></p>
                <ul>
                  <li>Vous recevrez un email de confirmation</li>
                  <li>Paiement à effectuer lors du retrait</li>
                  <li>Pensez à apporter des sacs réutilisables</li>
                  <li>Vous pouvez annuler jusqu'à 24h avant le retrait</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="actions">
            <button className="btn btn-primary" onClick={() => setShowSuccess(false)}>
              Voir toutes mes commandes
            </button>
            <Link to="/catalogue" className="btn btn-secondary">
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mes-commandes-page">
      <div className="commandes-header">
        <div>
          <h1>📦 Mes commandes</h1>
          <p>Consultez l'historique de vos commandes</p>
        </div>
        <Link to="/catalogue" className="btn btn-primary">
          ➕ Nouvelle commande
        </Link>
      </div>

      {commandes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>Aucune commande</h3>
          <p>Vous n'avez pas encore passé de commande.</p>
          <Link to="/catalogue" className="btn btn-primary">
            Parcourir le catalogue
          </Link>
        </div>
      ) : (
        <div className="commandes-list">
          {commandes.map(commande => {
            const statut = getStatutBadge(commande.statut);
            const peutAnnuler = canCancel(commande);
            
            return (
              <div key={commande.numero} className="commande-card">
                <div className="commande-header">
                  <div>
                    <h3>Commande {commande.numero}</h3>
                    <span className="commande-date">
                      📅 Passée le {new Date(commande.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <span className={`status-badge ${statut.class}`}>{statut.label}</span>
                </div>

                <div className="commande-body">
                  <div className="commande-section">
                    <h4>📍 Point de retrait</h4>
                    <p><strong>{commande.pointCollecte.nom}</strong></p>
                    <p>{commande.pointCollecte.adresse}</p>
                    <p className="retrait-info">
                      🕐 {new Date(commande.dateRetrait).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} 
                      {' '}- {commande.creneauRetrait.horaire}
                    </p>
                  </div>

                  <div className="commande-section">
                    <h4>🛒 Articles ({commande.produits.length})</h4>
                    <div className="articles-list">
                      {commande.produits.map(item => (
                        <div key={item.id} className="article-item">
                          <span>{item.image} {item.nom}</span>
                          <span>x{item.quantite}</span>
                          <span>{(item.prix * item.quantite).toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {commande.commentaire && (
                    <div className="commande-section">
                      <h4>💬 Commentaire</h4>
                      <p>{commande.commentaire}</p>
                    </div>
                  )}
                </div>

                <div className="commande-footer">
                  <div className="commande-total">
                    <div className="total-ligne">
                      <span>Total HT:</span>
                      <span>{commande.totalHT.toFixed(2)} €</span>
                    </div>
                    <div className="total-ligne">
                      <span>TVA (5,5%):</span>
                      <span>{commande.totalTVA.toFixed(2)} €</span>
                    </div>
                    <div className="total-ligne total-ttc">
                      <span>Total TTC:</span>
                      <span className="total-amount">{(commande.totalTVAC || commande.totalTTC).toFixed(2)} €</span>
                    </div>
                  </div>

                  {peutAnnuler && (
                    <div className="commande-actions">
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleCancelCommande(commande.numero)}
                      >
                        ❌ Annuler la commande
                      </button>
                      <p className="cancel-info">
                        Annulation possible jusqu'à 24h avant le retrait
                      </p>
                    </div>
                  )}

                  {!peutAnnuler && ['CONFIRMED', 'DRAFT'].includes(commande.statut) && (
                    <div className="alert alert-warning">
                      <span className="alert-icon">⚠️</span>
                      <span>Délai d'annulation dépassé (moins de 24h avant le retrait)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MesCommandes;