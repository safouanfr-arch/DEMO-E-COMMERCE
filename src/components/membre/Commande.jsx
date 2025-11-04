import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePanier } from '../../contexts/PanierContext';
import { pointsCollecte } from '../../data/mockData';
import { reserverStock } from '../../utils/stockJournal';

function Commande({ user }) {
  const navigate = useNavigate();
  const { panier, getTotalPrix, viderPanier } = usePanier();
  const [step, setStep] = useState(1); // 1: point collecte, 2: créneau, 3: confirmation
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedCreneau, setSelectedCreneau] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [commentaire, setCommentaire] = useState('');

  // Calcul des totaux avec TVA individualisée par produit
  const calculerTotaux = () => {
    let totalHT = 0;
    let totalTVA = 0;

    panier.forEach(item => {
      const prixUnitaireTVAC = item.prix;
      const tauxTVAProduit = (item.tauxTVA || 6) / 100;
      const prixUnitaireHT = prixUnitaireTVAC / (1 + tauxTVAProduit);
      const montantHT = prixUnitaireHT * item.quantite;
      const montantTVA = montantHT * tauxTVAProduit;

      totalHT += montantHT;
      totalTVA += montantTVA;
    });

    return {
      totalHT: totalHT,
      totalTVA: totalTVA,
      totalTVAC: totalHT + totalTVA
    };
  };

  const { totalHT, totalTVA, totalTVAC } = calculerTotaux();

  if (panier.length === 0) {
    navigate('/panier');
    return null;
  }

  // Générer les dates disponibles (à partir de J+1)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const availableDates = getAvailableDates();

  const handleSelectPoint = (point) => {
    setSelectedPoint(point);
    setStep(2);
    setSelectedCreneau(null);
    setSelectedDate('');
  };

  const handleSelectCreneau = (date, creneau) => {
    setSelectedDate(date);
    setSelectedCreneau(creneau);
    setStep(3);
  };

  const handleConfirmCommande = () => {
    // Génération d'un numéro unique avec horodatage
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, ''); // HHMMSS
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const numeroCommande = `CMD-${dateStr}-${timeStr}-${randomSuffix}`;

    // Création de la commande
    const commande = {
      numero: numeroCommande,
      date: now.toISOString(),
      dateCreation: now.toISOString(),
      membre: user,
      produits: panier,
      pointCollecte: selectedPoint,
      dateRetrait: selectedDate,
      creneauRetrait: selectedCreneau,
      totalHT,
      totalTVA,
      totalTVAC,
      statut: 'CONFIRMED',
      commentaire
    };

    // Enregistrer les mouvements de stock pour traçabilité
    try {
      const mouvements = reserverStock(commande);
      commande.mouvementsStock = mouvements.map(m => m.id);
      console.log('✅ Stock réservé:', mouvements.length, 'produits');
    } catch (error) {
      console.error('❌ Erreur lors de la réservation du stock:', error);
      // On continue quand même (mode démo)
    }

    // Sauvegarder la commande dans localStorage
    const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
    commandes.push(commande);
    localStorage.setItem('commandes', JSON.stringify(commandes));

    // Vider le panier
    viderPanier();

    // Rediriger vers la page de confirmation
    navigate('/mes-commandes', { state: { newCommande: commande } });
  };

  return (
    <div className="commande-page">
      <div className="commande-header">
        <h1>📦 Finaliser ma commande</h1>
        <div className="steps-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Point de collecte</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Créneau</span>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Confirmation</span>
          </div>
        </div>
      </div>

      <div className="commande-container">
        <div className="commande-content">
          {/* Étape 1: Point de collecte */}
          {step === 1 && (
            <div className="step-content">
              <h2>Choisissez votre point de collecte</h2>
              <div className="points-list">
                {pointsCollecte.map(point => (
                  <div 
                    key={point.id} 
                    className={`point-card clickable ${selectedPoint?.id === point.id ? 'selected' : ''}`}
                    onClick={() => handleSelectPoint(point)}
                  >
                    <div className="point-header">
                      <h3>📍 {point.nom}</h3>
                    </div>
                    <div className="point-details">
                      <p><strong>📫 Adresse:</strong> {point.adresse}</p>
                      <p><strong>🕐 Horaires:</strong> {point.horaires}</p>
                    </div>
                    <button className="btn btn-secondary">
                      Choisir ce point
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Étape 2: Créneau de retrait */}
          {step === 2 && selectedPoint && (
            <div className="step-content">
              <div className="selected-info">
                <h3>Point de collecte sélectionné:</h3>
                <p><strong>📍 {selectedPoint.nom}</strong> - {selectedPoint.adresse}</p>
                <button className="btn-text" onClick={() => setStep(1)}>← Changer de point</button>
              </div>

              <h2>Choisissez votre créneau de retrait</h2>
              <p className="help-text">⏰ Les créneaux sont disponibles à partir de demain (J+1)</p>

              <div className="creneaux-grid">
                {availableDates.map(date => (
                  <div key={date.toISOString()} className="date-group">
                    <h3 className="date-titre">
                      {date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                    <div className="creneaux-list">
                      {selectedPoint.creneaux
                        .filter(c => c.jour === date.toLocaleDateString('fr-FR', { weekday: 'long' }))
                        .map((creneau, index) => {
                          const placesRestantes = (creneau.capacite || 20) - (creneau.reservations || 0);
                          const estComplet = placesRestantes <= 0;
                          const estQuasiComplet = placesRestantes > 0 && placesRestantes <= 3;
                          
                          return (
                            <button
                              key={index}
                              className={`creneau-btn ${
                                selectedDate === date.toISOString() && selectedCreneau?.horaire === creneau.horaire ? 'selected' : ''
                              } ${estComplet ? 'complet' : ''} ${estQuasiComplet ? 'quasi-complet' : ''}`}
                              onClick={() => !estComplet && handleSelectCreneau(date.toISOString(), creneau)}
                              disabled={estComplet}
                            >
                              <span className="creneau-horaire">🕐 {creneau.horaire}</span>
                              {creneau.capacite && (
                                <span className={`creneau-capacite ${estComplet ? 'complet' : estQuasiComplet ? 'warning' : 'ok'}`}>
                                  {estComplet ? '🔴 Complet' : `${placesRestantes}/${creneau.capacite} places`}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      {selectedPoint.creneaux.filter(c => c.jour === date.toLocaleDateString('fr-FR', { weekday: 'long' })).length === 0 && (
                        <p className="no-creneau">Aucun créneau disponible ce jour</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Étape 3: Confirmation */}
          {step === 3 && selectedPoint && selectedCreneau && (
            <div className="step-content">
              <h2>✅ Confirmer votre commande</h2>

              <div className="confirmation-details">
                <div className="detail-section">
                  <h3>📦 Informations de retrait</h3>
                  <div className="detail-card">
                    <p><strong>Point de collecte:</strong> {selectedPoint.nom}</p>
                    <p><strong>Adresse:</strong> {selectedPoint.adresse}</p>
                    <p><strong>Date de retrait:</strong> {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p><strong>Créneau:</strong> {selectedCreneau.horaire}</p>
                  </div>
                  <button className="btn-text" onClick={() => setStep(2)}>← Modifier le créneau</button>
                </div>

                <div className="detail-section">
                  <h3>🛒 Vos articles ({panier.length})</h3>
                  <div className="articles-resume">
                    {panier.map(item => (
                      <div key={item.id} className="article-ligne">
                        <span>{item.image} {item.nom}</span>
                        <span>x{item.quantite}</span>
                        <span>{(item.prix * item.quantite).toFixed(2)} €</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>💬 Commentaire (optionnel)</h3>
                  <textarea
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    placeholder="Ajoutez un commentaire à votre commande..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="confirmation-actions">
                <button className="btn btn-primary btn-large" onClick={handleConfirmCommande}>
                  ✅ Confirmer et valider la commande
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Récapitulatif toujours visible */}
        <div className="commande-resume">
          <div className="resume-card">
            <h2>Récapitulatif</h2>
            
            <div className="resume-items">
              <h4>Articles ({panier.length})</h4>
              {panier.slice(0, 3).map(item => (
                <div key={item.id} className="resume-item">
                  <span>{item.image} {item.nom} x{item.quantite}</span>
                </div>
              ))}
              {panier.length > 3 && (
                <p className="more-items">... et {panier.length - 3} autre(s) article(s)</p>
              )}
            </div>

            <div className="resume-ligne">
              <span>Sous-total HT</span>
              <span>{totalHT.toFixed(2)} €</span>
            </div>
            
            <div className="resume-ligne">
              <span>TVA</span>
              <span>{totalTVA.toFixed(2)} €</span>
            </div>
            
            <div className="resume-ligne resume-total">
              <span>Total TVAC</span>
              <span className="total-amount">{totalTVAC.toFixed(2)} €</span>
            </div>

            {selectedPoint && (
              <div className="resume-info-box">
                <p><strong>📍 {selectedPoint.nom}</strong></p>
                {selectedDate && selectedCreneau && (
                  <p>🕐 {new Date(selectedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} à {selectedCreneau.horaire}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Commande;