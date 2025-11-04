import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { produits as produitsData } from '../../data/mockData';
import { usePanier } from '../../contexts/PanierContext';

function FicheProduit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const produit = produitsData.find(p => p.id === parseInt(id));
  const { ajouterAuPanier } = usePanier();
  const [quantite, setQuantite] = useState(1);
  const [added, setAdded] = useState(false);

  if (!produit) {
    return (
      <div className="page-container">
        <div className="error-message">
          <div className="error-icon">❌</div>
          <h2>Produit non trouvé</h2>
          <p>Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
          <Link to="/catalogue" className="btn btn-primary">Retour au catalogue</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    ajouterAuPanier(produit, quantite);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    ajouterAuPanier(produit, quantite);
    navigate('/panier');
  };

  const produitsLies = produitsData
    .filter(p => p.categorieId === produit.categorieId && p.id !== produit.id && p.stock > 0)
    .slice(0, 3);

  return (
    <div className="fiche-produit-page">
      <div className="fiche-header">
        <Link to="/catalogue" className="back-link">← Retour au catalogue</Link>
      </div>

      <div className="fiche-produit">
        <div className="fiche-image-section">
          <div className="fiche-image-main">{produit.image}</div>
          <div className="fiche-badges">
            <span className="badge badge-local">🇫🇷 Local</span>
            {produit.etiquettes?.includes('bio') && <span className="badge badge-bio">🌱 Bio</span>}
            {produit.etiquettes?.includes('végétarien') && <span className="badge badge-vegetarien">🥬 Végétarien</span>}
            {produit.etiquettes?.includes('végan') && <span className="badge badge-vegan">� Végan</span>}
          </div>
        </div>

        <div className="fiche-info-section">
          <div className="fiche-category">{produit.categorie}</div>
          <h1 className="fiche-titre">{produit.nom}</h1>
          
          <div className="fiche-prix-section">
            <div className="fiche-prix">
              <span className="prix-montant">{produit.prix.toFixed(2)} €</span>
              <span className="prix-unite">/ {produit.unite}</span>
              <span className="prix-info">TVAC ({produit.tauxTVA || 6}%)</span>
            </div>
            <div className="fiche-stock">
              {produit.stock < 10 ? (
                <span className="stock-warning">⚠️ Plus que {produit.stock} disponible(s)</span>
              ) : (
                <span className="stock-ok">✅ En stock ({produit.stock} disponible(s))</span>
              )}
            </div>
          </div>

          <div className="fiche-description">
            <h3>📋 Description</h3>
            <p>{produit.description}</p>
          </div>

          <div className="fiche-details">
            <div className="detail-item">
              <span className="detail-label">🏭 Producteur:</span>
              <span className="detail-value">{produit.producteur}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">📍 Origine:</span>
              <span className="detail-value">{produit.origine}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">📦 Unité:</span>
              <span className="detail-value">{produit.unite}</span>
            </div>
            {produit.datePeremption && (
              <div className="detail-item">
                <span className="detail-label">📅 Péremption:</span>
                <span className="detail-value">{new Date(produit.datePeremption).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-label">💰 Prix HT:</span>
              <span className="detail-value">{(produit.prix / (1 + (produit.tauxTVA || 6) / 100)).toFixed(2)} €</span>
            </div>
          </div>

          <div className="fiche-actions">
            <div className="quantite-selector">
              <label>Quantité:</label>
              <div className="quantite-controls">
                <button 
                  onClick={() => setQuantite(Math.max(1, quantite - 1))}
                  disabled={quantite <= 1}
                >
                  −
                </button>
                <input 
                  type="number" 
                  value={quantite} 
                  onChange={(e) => setQuantite(Math.max(1, Math.min(produit.stock, parseInt(e.target.value) || 1)))}
                  min="1"
                  max={produit.stock}
                />
                <button 
                  onClick={() => setQuantite(Math.min(produit.stock, quantite + 1))}
                  disabled={quantite >= produit.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="total-price">
              <span className="total-label">Total TVAC:</span>
              <span className="total-montant">{(produit.prix * quantite).toFixed(2)} €</span>
            </div>
          </div>

          <div className="fiche-buttons">
            <button 
              className={`btn btn-primary ${added ? 'btn-success' : ''}`}
              onClick={handleAddToCart}
            >
              {added ? '✅ Ajouté au panier' : '🛒 Ajouter au panier'}
            </button>
            <button className="btn btn-secondary" onClick={handleBuyNow}>
              ⚡ Acheter maintenant
            </button>
          </div>
        </div>
      </div>

      {produitsLies.length > 0 && (
        <div className="produits-lies">
          <h2>Produits similaires</h2>
          <div className="produits-grid">
            {produitsLies.map(p => (
              <Link to={`/produit/${p.id}`} key={p.id} className="produit-card-mini">
                <div className="produit-image-mini">{p.image}</div>
                <div className="produit-info-mini">
                  <h4>{p.nom}</h4>
                  <span className="prix-mini">{p.prix.toFixed(2)} € / {p.unite}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FicheProduit;