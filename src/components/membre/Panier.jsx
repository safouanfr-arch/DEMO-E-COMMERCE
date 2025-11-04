import { Link, useNavigate } from 'react-router-dom';
import { usePanier } from '../../contexts/PanierContext';

function Panier() {
  const navigate = useNavigate();
  const { panier, modifierQuantite, retirerDuPanier, getTotalPrix, viderPanier } = usePanier();

  // Calcul des totaux avec TVA individualisée par produit
  const calculerTotaux = () => {
    let totalHT = 0;
    let totalTVA = 0;

    panier.forEach(item => {
      const prixUnitaireTVAC = item.prix;
      const tauxTVAProduit = (item.tauxTVA || 6) / 100; // 6% ou 21%
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

  const handleViderPanier = () => {
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      viderPanier();
    }
  };

  const handleValiderCommande = () => {
    navigate('/commande');
  };

  if (panier.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h2>Votre panier est vide</h2>
          <p>Découvrez nos produits et commencez vos achats !</p>
          <Link to="/catalogue" className="btn btn-primary">
            Parcourir le catalogue
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="panier-page">
      <div className="panier-header">
        <h1>🛒 Mon panier</h1>
        <p>{panier.length} article(s)</p>
      </div>

      <div className="panier-container">
        <div className="panier-items">
          <div className="panier-actions-top">
            <Link to="/catalogue" className="link">← Continuer mes achats</Link>
            <button className="btn-text btn-danger" onClick={handleViderPanier}>
              🗑️ Vider le panier
            </button>
          </div>

          {panier.map(item => (
            <div key={item.id} className="panier-item">
              <div className="item-image">{item.image}</div>
              
              <div className="item-info">
                <Link to={`/produit/${item.id}`} className="item-nom">{item.nom}</Link>
                <span className="item-categorie">{item.categorie}</span>
                <span className="item-prix-unitaire">{item.prix.toFixed(2)} € / {item.unite}</span>
              </div>

              <div className="item-quantite">
                <button 
                  className="qty-btn"
                  onClick={() => modifierQuantite(item.id, item.quantite - 1)}
                >
                  −
                </button>
                <input 
                  type="number" 
                  value={item.quantite}
                  onChange={(e) => modifierQuantite(item.id, parseInt(e.target.value) || 1)}
                  min="1"
                  max={item.stock}
                />
                <button 
                  className="qty-btn"
                  onClick={() => modifierQuantite(item.id, item.quantite + 1)}
                  disabled={item.quantite >= item.stock}
                >
                  +
                </button>
              </div>

              <div className="item-total">
                <span className="item-prix-total">{(item.prix * item.quantite).toFixed(2)} €</span>
              </div>

              <button 
                className="item-remove"
                onClick={() => retirerDuPanier(item.id)}
                title="Retirer du panier"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="panier-resume">
          <div className="resume-card">
            <h2>Récapitulatif</h2>
            
            <div className="resume-ligne">
              <span>Sous-total HT</span>
              <span>{totalHT.toFixed(2)} €</span>
            </div>
            
            <div className="resume-ligne">
              <span>TVA</span>
              <span>{totalTVA.toFixed(2)} €</span>
            </div>
            
            <div className="resume-ligne resume-total">
              <span><strong>Total TVAC</strong></span>
              <span><strong>{totalTVAC.toFixed(2)} €</strong></span>
            </div>

            <button 
              className="btn btn-primary btn-full"
              onClick={handleValiderCommande}
            >
              Valider ma commande
            </button>

            <div className="resume-info">
              <p>✅ Paiement à la livraison</p>
              <p>📦 Retrait en point de collecte</p>
              <p>🔒 Commande sécurisée</p>
            </div>
          </div>

          <div className="resume-help">
            <h3>ℹ️ Besoin d'aide ?</h3>
            <p>
              Vous pouvez modifier les quantités ou retirer des articles avant de valider votre commande.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Panier;