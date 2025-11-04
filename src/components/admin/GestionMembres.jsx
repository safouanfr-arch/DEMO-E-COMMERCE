import { useState } from 'react';
import { Link } from 'react-router-dom';

function GestionMembres() {
  const [membres, setMembres] = useState([
    {
      id: 1,
      nom: 'Dubois',
      prenom: 'Jean',
      email: 'jean.dubois@email.com',
      telephone: '06 11 22 33 44',
      dateInscription: '2025-09-15',
      statut: 'actif',
      nbCommandes: 12,
      historiqueSanctions: []
    },
    {
      id: 2,
      nom: 'Lefebvre',
      prenom: 'Anne',
      email: 'anne.lefebvre@email.com',
      telephone: '06 22 33 44 55',
      dateInscription: '2025-08-20',
      statut: 'actif',
      nbCommandes: 25,
      historiqueSanctions: []
    },
    {
      id: 3,
      nom: 'Moreau',
      prenom: 'Paul',
      email: 'paul.moreau@email.com',
      telephone: '06 33 44 55 66',
      dateInscription: '2025-10-05',
      statut: 'suspendu',
      nbCommandes: 3,
      historiqueSanctions: [
        {
          date: '2025-10-20',
          type: 'suspendre',
          raison: 'No-show sur 3 commandes consécutives',
          auteur: 'Admin'
        }
      ]
    },
    {
      id: 4,
      nom: 'Simon',
      prenom: 'Claire',
      email: 'claire.simon@email.com',
      telephone: '06 44 55 66 77',
      dateInscription: '2025-07-12',
      statut: 'actif',
      nbCommandes: 45,
      historiqueSanctions: []
    },
    {
      id: 5,
      nom: 'Laurent',
      prenom: 'Marc',
      email: 'marc.laurent@email.com',
      telephone: '06 55 66 77 88',
      dateInscription: '2025-09-28',
      statut: 'suspendu',
      nbCommandes: 8,
      historiqueSanctions: [
        {
          date: '2025-10-15',
          type: 'suspendre',
          raison: 'Abus signalé: commandes non retirées répétées',
          auteur: 'Admin'
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [selectedMembre, setSelectedMembre] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showHistorique, setShowHistorique] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [raison, setRaison] = useState('');

  const handleAction = (membre, action) => {
    setSelectedMembre(membre);
    setActionType(action);
    setShowModal(true);
    setRaison('');
  };

  const handleShowHistorique = (membre) => {
    setSelectedMembre(membre);
    setShowHistorique(true);
  };

  const confirmAction = () => {
    if (selectedMembre && raison.trim()) {
      const nouvelleEntree = {
        date: new Date().toISOString().split('T')[0],
        type: actionType,
        raison: raison.trim(),
        auteur: 'Admin'
      };

      setMembres(prev =>
        prev.map(m =>
          m.id === selectedMembre.id
            ? { 
                ...m, 
                statut: actionType === 'suspendre' ? 'suspendu' : 'actif',
                historiqueSanctions: [...(m.historiqueSanctions || []), nouvelleEntree]
              }
            : m
        )
      );

      setShowModal(false);
      setSelectedMembre(null);
      setRaison('');
    }
  };

  const filteredMembres = membres.filter(membre => {
    const matchSearch = 
      membre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatut = filterStatut === 'tous' || membre.statut === filterStatut;
    
    return matchSearch && matchStatut;
  });

  const statsActifs = membres.filter(m => m.statut === 'actif').length;
  const statsSuspendus = membres.filter(m => m.statut === 'suspendu').length;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link to="/admin" className="back-link">← Retour au dashboard</Link>
          <h1>👥 Gestion des membres</h1>
          <p>Suspendre ou réactiver les comptes membres</p>
        </div>
        <div className="header-stats">
          <span className="stat-badge success">
            ✅ Actifs: <strong>{statsActifs}</strong>
          </span>
          <span className="stat-badge danger">
            🚫 Suspendus: <strong>{statsSuspendus}</strong>
          </span>
          <span className="stat-badge">
            📊 Total: <strong>{membres.length}</strong>
          </span>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Rechercher un membre (nom, prénom, email)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatut === 'tous' ? 'active' : ''}`}
            onClick={() => setFilterStatut('tous')}
          >
            Tous ({membres.length})
          </button>
          <button
            className={`filter-btn ${filterStatut === 'actif' ? 'active' : ''}`}
            onClick={() => setFilterStatut('actif')}
          >
            Actifs ({statsActifs})
          </button>
          <button
            className={`filter-btn ${filterStatut === 'suspendu' ? 'active' : ''}`}
            onClick={() => setFilterStatut('suspendu')}
          >
            Suspendus ({statsSuspendus})
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Membre</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Inscription</th>
              <th>Commandes</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembres.map(membre => (
              <tr key={membre.id}>
                <td>
                  <strong>{membre.prenom} {membre.nom}</strong>
                </td>
                <td>{membre.email}</td>
                <td>{membre.telephone}</td>
                <td>{new Date(membre.dateInscription).toLocaleDateString('fr-FR')}</td>
                <td className="text-center">{membre.nbCommandes}</td>
                <td>
                  <span className={`status-badge ${membre.statut === 'actif' ? 'success' : 'danger'}`}>
                    {membre.statut === 'actif' ? '✅ Actif' : '🚫 Suspendu'}
                  </span>
                </td>
                <td>
                  {membre.statut === 'actif' ? (
                    <>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => handleAction(membre, 'suspendre')}
                        title="Suspendre"
                      >
                        🚫 Suspendre
                      </button>
                      {membre.historiqueSanctions?.length > 0 && (
                        <button
                          className="btn-icon btn-info"
                          onClick={() => handleShowHistorique(membre)}
                          title="Voir l'historique"
                        >
                          📋
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        className="btn-icon btn-success"
                        onClick={() => handleAction(membre, 'reactiver')}
                        title="Réactiver"
                      >
                        ✅ Réactiver
                      </button>
                      <button
                        className="btn-icon btn-info"
                        onClick={() => handleShowHistorique(membre)}
                        title="Voir l'historique"
                      >
                        📋 Historique
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMembres.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Aucun membre trouvé</h3>
            <p>Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </div>

      {/* Modal de confirmation */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {actionType === 'suspendre' ? '🚫 Suspendre le membre' : '✅ Réactiver le membre'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <p>
                Êtes-vous sûr de vouloir <strong>{actionType === 'suspendre' ? 'suspendre' : 'réactiver'}</strong> le 
                compte de <strong>{selectedMembre?.prenom} {selectedMembre?.nom}</strong> ?
              </p>

              {actionType === 'suspendre' ? (
                <div className="alert alert-warning">
                  <span className="alert-icon">⚠️</span>
                  Ce membre ne pourra plus se connecter ni passer de commandes jusqu'à la réactivation de son compte.
                </div>
              ) : (
                <div className="alert alert-info">
                  <span className="alert-icon">ℹ️</span>
                  Ce membre pourra à nouveau se connecter et passer des commandes.
                </div>
              )}

              <div className="form-group">
                <label htmlFor="raison">
                  Raison {actionType === 'suspendre' ? '(obligatoire)' : '(optionnelle)'}:
                </label>
                <textarea
                  id="raison"
                  value={raison}
                  onChange={(e) => setRaison(e.target.value)}
                  rows="3"
                  placeholder={actionType === 'suspendre' 
                    ? "Indiquez la raison de la suspension..." 
                    : "Commentaire sur la réactivation..."}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className={`btn ${actionType === 'suspendre' ? 'btn-danger' : 'btn-success'}`}
                onClick={confirmAction}
                disabled={actionType === 'suspendre' && !raison.trim()}
              >
                Confirmer
              </button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Historique des sanctions */}
      {showHistorique && selectedMembre && (
        <div className="modal-overlay" onClick={() => setShowHistorique(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Historique des sanctions - {selectedMembre.prenom} {selectedMembre.nom}</h2>
              <button className="modal-close" onClick={() => setShowHistorique(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="membre-info-box">
                <p><strong>Email:</strong> {selectedMembre.email}</p>
                <p><strong>Statut actuel:</strong> <span className={`status-badge ${selectedMembre.statut === 'actif' ? 'success' : 'danger'}`}>
                  {selectedMembre.statut === 'actif' ? '✅ Actif' : '🚫 Suspendu'}
                </span></p>
              </div>

              {selectedMembre.historiqueSanctions && selectedMembre.historiqueSanctions.length > 0 ? (
                <div className="historique-list">
                  {selectedMembre.historiqueSanctions.map((sanction, index) => (
                    <div key={index} className="historique-item">
                      <div className="historique-header">
                        <span className={`status-badge ${sanction.type === 'suspendre' ? 'danger' : 'success'}`}>
                          {sanction.type === 'suspendre' ? '🚫 Suspension' : '✅ Réactivation'}
                        </span>
                        <span className="historique-date">{new Date(sanction.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="historique-content">
                        <p><strong>Raison :</strong> {sanction.raison}</p>
                        <p className="historique-author"><em>Par {sanction.auteur}</em></p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-small">
                  <p>Aucune sanction enregistrée pour ce membre.</p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowHistorique(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionMembres;