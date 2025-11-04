import { useState } from 'react';
import { Link } from 'react-router-dom';

function GestionPointsCollecte() {
  const [points, setPoints] = useState([
    { id: 1, nom: 'Centre-ville', adresse: '15 rue de la République, 75001 Paris', horaires: 'Mer 18h-20h, Sam 10h-13h', actif: true },
    { id: 2, nom: 'Marché Nord', adresse: '28 avenue du Marché, 75018 Paris', horaires: 'Ven 17h-20h', actif: true },
    { id: 3, nom: 'Quartier Sud', adresse: '42 boulevard du Sud, 75013 Paris', horaires: 'Jeu 18h-20h', actif: true },
    { id: 4, nom: 'Ferme des Lilas', adresse: '8 chemin des Lilas, 77000 Melun', horaires: 'Sam 9h-12h', actif: false }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [formData, setFormData] = useState({ nom: '', adresse: '', horaires: '', actif: true });

  const handleAdd = () => {
    setEditMode(false);
    setCurrentPoint(null);
    setFormData({ nom: '', adresse: '', horaires: '', actif: true });
    setShowModal(true);
  };

  const handleEdit = (point) => {
    setEditMode(true);
    setCurrentPoint(point);
    setFormData(point);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce point de collecte ?')) {
      setPoints(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    if (editMode) {
      setPoints(prev => prev.map(p => p.id === currentPoint.id ? { ...formData, id: p.id } : p));
    } else {
      setPoints(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link to="/admin" className="back-link">← Retour au dashboard</Link>
          <h1>📍 Gestion des points de collecte</h1>
          <p>Gérer les lieux de retrait des commandes</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>➕ Nouveau point de collecte</button>
      </div>

      <div className="points-grid">
        {points.map(point => (
          <div key={point.id} className={`point-card ${!point.actif ? 'inactive' : ''}`}>
            <div className="point-header">
              <h3>📍 {point.nom}</h3>
              <span className={`status-badge ${point.actif ? 'success' : 'secondary'}`}>
                {point.actif ? '✅ Actif' : '⏸️ Inactif'}
              </span>
            </div>
            <div className="point-info">
              <p><strong>📫 Adresse:</strong> {point.adresse}</p>
              <p><strong>🕐 Horaires:</strong> {point.horaires}</p>
            </div>
            <div className="point-actions">
              <button className="btn-icon" onClick={() => handleEdit(point)}>✏️ Modifier</button>
              <button className="btn-icon btn-danger" onClick={() => handleDelete(point.id)}>🗑️ Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? '✏️ Modifier le point de collecte' : '➕ Nouveau point de collecte'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nom du point *</label>
                <input type="text" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Adresse complète *</label>
                <textarea rows="2" value={formData.adresse} onChange={(e) => setFormData({...formData, adresse: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Horaires d'ouverture *</label>
                <input type="text" value={formData.horaires} onChange={(e) => setFormData({...formData, horaires: e.target.value})} placeholder="Ex: Mer 18h-20h, Sam 10h-13h" />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={formData.actif} onChange={(e) => setFormData({...formData, actif: e.target.checked})} />
                  <span>Point de collecte actif</span>
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

export default GestionPointsCollecte;