import { useState } from 'react';
import { Link } from 'react-router-dom';

function GestionProduits() {
  const [produits, setProduits] = useState([
    { id: 1, nom: 'Tomates bio', categorie: 'Légumes', prix: 3.50, stock: 45, actif: true },
    { id: 2, nom: 'Pain complet', categorie: 'Boulangerie', prix: 2.80, stock: 20, actif: true },
    { id: 3, nom: 'Fromage de chèvre', categorie: 'Fromages', prix: 8.50, stock: 12, actif: true },
    { id: 4, nom: 'Pommes Golden', categorie: 'Fruits', prix: 2.90, stock: 60, actif: true },
    { id: 5, nom: 'Miel d\'acacia', categorie: 'Épicerie', prix: 12.00, stock: 5, actif: false }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduit, setCurrentProduit] = useState(null);
  const [formData, setFormData] = useState({ nom: '', categorie: '', prix: '', stock: '', actif: true });

  const handleAdd = () => {
    setEditMode(false);
    setCurrentProduit(null);
    setFormData({ nom: '', categorie: '', prix: '', stock: '', actif: true });
    setShowModal(true);
  };

  const handleEdit = (produit) => {
    setEditMode(true);
    setCurrentProduit(produit);
    setFormData(produit);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProduits(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    if (editMode) {
      setProduits(prev => prev.map(p => p.id === currentProduit.id ? { ...formData, id: p.id } : p));
    } else {
      setProduits(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link to="/admin" className="back-link">← Retour au dashboard</Link>
          <h1>📦 Gestion des produits</h1>
          <p>Créer, modifier et supprimer des produits</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          ➕ Nouveau produit
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {produits.map(produit => (
              <tr key={produit.id}>
                <td><strong>{produit.nom}</strong></td>
                <td>{produit.categorie}</td>
                <td>{produit.prix.toFixed(2)} €</td>
                <td className={produit.stock < 10 ? 'text-warning' : ''}>{produit.stock}</td>
                <td>
                  <span className={`status-badge ${produit.actif ? 'success' : 'secondary'}`}>
                    {produit.actif ? '✅ Actif' : '⏸️ Inactif'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="btn-icon" onClick={() => handleEdit(produit)} title="Modifier">✏️</button>
                  <button className="btn-icon btn-danger" onClick={() => handleDelete(produit.id)} title="Supprimer">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? '✏️ Modifier le produit' : '➕ Nouveau produit'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nom du produit *</label>
                <input type="text" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Catégorie *</label>
                <input type="text" value={formData.categorie} onChange={(e) => setFormData({...formData, categorie: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Prix (€) *</label>
                  <input type="number" step="0.01" value={formData.prix} onChange={(e) => setFormData({...formData, prix: parseFloat(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={formData.actif} onChange={(e) => setFormData({...formData, actif: e.target.checked})} />
                  <span>Produit actif</span>
                </label>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleSave}>Enregistrer</button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionProduits;