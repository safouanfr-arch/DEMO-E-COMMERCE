import { useState } from 'react';
import { Link } from 'react-router-dom';

function GestionCategories() {
  const [categories, setCategories] = useState([
    { id: 1, nom: 'Fruits', description: 'Fruits frais de saison', nbProduits: 15 },
    { id: 2, nom: 'Légumes', description: 'Légumes bio locaux', nbProduits: 28 },
    { id: 3, nom: 'Fromages', description: 'Fromages artisanaux', nbProduits: 12 },
    { id: 4, nom: 'Boulangerie', description: 'Pain et viennoiseries', nbProduits: 8 },
    { id: 5, nom: 'Épicerie', description: 'Produits d\'épicerie fine', nbProduits: 35 }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategorie, setCurrentCategorie] = useState(null);
  const [formData, setFormData] = useState({ nom: '', description: '' });

  const handleAdd = () => {
    setEditMode(false);
    setCurrentCategorie(null);
    setFormData({ nom: '', description: '' });
    setShowModal(true);
  };

  const handleEdit = (categorie) => {
    setEditMode(true);
    setCurrentCategorie(categorie);
    setFormData({ nom: categorie.nom, description: categorie.description });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const cat = categories.find(c => c.id === id);
    if (cat.nbProduits > 0) {
      alert(`Impossible de supprimer cette catégorie car elle contient ${cat.nbProduits} produit(s).`);
      return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleSave = () => {
    if (editMode) {
      setCategories(prev => prev.map(c => c.id === currentCategorie.id ? { ...c, ...formData } : c));
    } else {
      setCategories(prev => [...prev, { ...formData, id: Date.now(), nbProduits: 0 }]);
    }
    setShowModal(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link to="/admin" className="back-link">← Retour au dashboard</Link>
          <h1>🏷️ Gestion des catégories</h1>
          <p>Gérer les catégories de produits</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>➕ Nouvelle catégorie</button>
      </div>

      <div className="categories-grid">
        {categories.map(categorie => (
          <div key={categorie.id} className="category-card">
            <div className="category-header">
              <h3>{categorie.nom}</h3>
              <span className="category-count">{categorie.nbProduits} produits</span>
            </div>
            <p>{categorie.description}</p>
            <div className="category-actions">
              <button className="btn-icon" onClick={() => handleEdit(categorie)}>✏️ Modifier</button>
              <button className="btn-icon btn-danger" onClick={() => handleDelete(categorie.id)}>🗑️ Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? '✏️ Modifier la catégorie' : '➕ Nouvelle catégorie'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nom de la catégorie *</label>
                <input type="text" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
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

export default GestionCategories;