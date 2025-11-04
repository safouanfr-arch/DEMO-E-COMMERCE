import { useState } from 'react';
import { Link } from 'react-router-dom';

function GestionPromotions() {
  const [promotions, setPromotions] = useState([
    { id: 1, nom: 'Été 2025', reduction: 15, type: 'pourcentage', dateDebut: '2025-06-01', dateFin: '2025-08-31', actif: false },
    { id: 2, nom: 'Fruits de saison', reduction: 10, type: 'pourcentage', dateDebut: '2025-11-01', dateFin: '2025-11-30', actif: true },
    { id: 3, nom: 'Première commande', reduction: 5, type: 'montant', dateDebut: '2025-01-01', dateFin: '2025-12-31', actif: true }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPromo, setCurrentPromo] = useState(null);
  const [formData, setFormData] = useState({ nom: '', reduction: '', type: 'pourcentage', dateDebut: '', dateFin: '', actif: true });

  const handleAdd = () => {
    setEditMode(false);
    setCurrentPromo(null);
    setFormData({ nom: '', reduction: '', type: 'pourcentage', dateDebut: '', dateFin: '', actif: true });
    setShowModal(true);
  };

  const handleEdit = (promo) => {
    setEditMode(true);
    setCurrentPromo(promo);
    setFormData(promo);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      setPromotions(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    if (editMode) {
      setPromotions(prev => prev.map(p => p.id === currentPromo.id ? { ...formData, id: p.id } : p));
    } else {
      setPromotions(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link to="/admin" className="back-link">← Retour au dashboard</Link>
          <h1>🎯 Gestion des promotions</h1>
          <p>Créer et gérer les offres promotionnelles</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>➕ Nouvelle promotion</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Réduction</th>
              <th>Période</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map(promo => (
              <tr key={promo.id}>
                <td><strong>{promo.nom}</strong></td>
                <td>
                  <span className="promo-badge">
                    {promo.type === 'pourcentage' ? `${promo.reduction}%` : `${promo.reduction}€`}
                  </span>
                </td>
                <td>
                  {new Date(promo.dateDebut).toLocaleDateString('fr-FR')} - {new Date(promo.dateFin).toLocaleDateString('fr-FR')}
                </td>
                <td>
                  <span className={`status-badge ${promo.actif ? 'success' : 'secondary'}`}>
                    {promo.actif ? '✅ Active' : '⏸️ Inactive'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="btn-icon" onClick={() => handleEdit(promo)} title="Modifier">✏️</button>
                  <button className="btn-icon btn-danger" onClick={() => handleDelete(promo.id)} title="Supprimer">🗑️</button>
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
              <h2>{editMode ? '✏️ Modifier la promotion' : '➕ Nouvelle promotion'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nom de la promotion *</label>
                <input type="text" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Type de réduction *</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="pourcentage">Pourcentage</option>
                    <option value="montant">Montant fixe</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Réduction *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={formData.reduction} 
                    onChange={(e) => setFormData({...formData, reduction: parseFloat(e.target.value)})} 
                    placeholder={formData.type === 'pourcentage' ? 'Ex: 10' : 'Ex: 5.00'}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date de début *</label>
                  <input type="date" value={formData.dateDebut} onChange={(e) => setFormData({...formData, dateDebut: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Date de fin *</label>
                  <input type="date" value={formData.dateFin} onChange={(e) => setFormData({...formData, dateFin: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={formData.actif} onChange={(e) => setFormData({...formData, actif: e.target.checked})} />
                  <span>Promotion active</span>
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

export default GestionPromotions;