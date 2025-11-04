import { useState } from 'react';
import { Link } from 'react-router-dom';
import { produits as produitsData, categories } from '../../data/mockData';
import { usePanier } from '../../contexts/PanierContext';

function Catalogue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [sortBy, setSortBy] = useState('nom');
  const { ajouterAuPanier } = usePanier();
  const [addedToCart, setAddedToCart] = useState(null);

  const handleAddToCart = (produit, e) => {
    e.preventDefault();
    e.stopPropagation();
    ajouterAuPanier(produit, 1);
    setAddedToCart(produit.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  // Filtrage et tri
  let produitsFiltres = produitsData.filter(p => p.stock > 0);

  // Recherche
  if (searchTerm) {
    produitsFiltres = produitsFiltres.filter(p =>
      p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Filtre par catégorie
  if (selectedCategory !== 'tous') {
    produitsFiltres = produitsFiltres.filter(p => p.categorie === selectedCategory);
  }

  // Tri
  produitsFiltres = [...produitsFiltres].sort((a, b) => {
    switch (sortBy) {
      case 'nom':
        return a.nom.localeCompare(b.nom);
      case 'prix-asc':
        return a.prix - b.prix;
      case 'prix-desc':
        return b.prix - a.prix;
      default:
        return 0;
    }
  });

  return (
    <div className="catalogue-page">
      <div className="catalogue-header">
        <h1>🛍️ Catalogue des produits</h1>
        <p>Découvrez notre sélection de produits frais et locaux</p>
      </div>

      <div className="catalogue-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>Catégorie:</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="tous">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.nom}>{cat.nom}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Trier par:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="nom">Nom (A-Z)</option>
              <option value="prix-asc">Prix croissant</option>
              <option value="prix-desc">Prix décroissant</option>
            </select>
          </div>

          <div className="results-count">
            <span>{produitsFiltres.length} produit(s) trouvé(s)</span>
          </div>
        </div>
      </div>

      {produitsFiltres.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Aucun produit trouvé</h3>
          <p>Essayez de modifier vos critères de recherche.</p>
        </div>
      ) : (
        <div className="produits-grid">
          {produitsFiltres.map(produit => (
            <Link to={`/produit/${produit.id}`} key={produit.id} className="produit-card">
              <div className="produit-image">{produit.image}</div>
              <div className="produit-content">
                <div className="produit-category">{produit.categorie}</div>
                <h3 className="produit-nom">{produit.nom}</h3>
                <p className="produit-description">{produit.description}</p>
                <div className="produit-footer">
                  <div className="produit-prix">
                    <span className="prix">{produit.prix.toFixed(2)} €</span>
                    <span className="unite">/ {produit.unite}</span>
                  </div>
                  <div className="produit-stock">
                    {produit.stock < 10 ? (
                      <span className="stock-low">⚠️ Stock limité ({produit.stock})</span>
                    ) : (
                      <span className="stock-ok">✅ En stock ({produit.stock})</span>
                    )}
                  </div>
                </div>
                <button
                  className={`btn btn-add-cart ${addedToCart === produit.id ? 'added' : ''}`}
                  onClick={(e) => handleAddToCart(produit, e)}
                >
                  {addedToCart === produit.id ? '✅ Ajouté !' : '🛒 Ajouter au panier'}
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalogue;