import { useState } from 'react';
import { Link } from 'react-router-dom';

function GestionDemandesAdhesion() {
  const [demandes, setDemandes] = useState([
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie.dupont@email.com',
      telephone: '06 12 34 56 78',
      justification: 'Je souhaite rejoindre votre communauté pour bénéficier de produits locaux et de qualité.',
      date: '2025-11-01',
      statut: 'en_attente'
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Pierre',
      email: 'pierre.martin@email.com',
      telephone: '06 98 76 54 32',
      justification: 'Intéressé par les circuits courts et l\'agriculture locale.',
      date: '2025-11-02',
      statut: 'en_attente'
    },
    {
      id: 3,
      nom: 'Bernard',
      prenom: 'Sophie',
      email: 'sophie.bernard@email.com',
      telephone: '06 11 22 33 44',
      justification: '',
      date: '2025-11-02',
      statut: 'en_attente'
    },
    {
      id: 4,
      nom: 'Petit',
      prenom: 'Luc',
      email: 'luc.petit@email.com',
      telephone: '06 55 66 77 88',
      justification: 'Recommandé par un ami membre. Je souhaite soutenir les producteurs locaux.',
      date: '2025-11-03',
      statut: 'en_attente'
    },
    {
      id: 5,
      nom: 'Rousseau',
      prenom: 'Julie',
      email: 'julie.rousseau@email.com',
      telephone: '',
      justification: 'Passionnée par l\'alimentation saine et responsable.',
      date: '2025-11-03',
      statut: 'en_attente'
    }
  ]);

  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null); // 'valider' ou 'refuser'
  const [commentaire, setCommentaire] = useState('');

  const handleAction = (demande, action) => {
    setSelectedDemande(demande);
    setActionType(action);
    setShowModal(true);
    setCommentaire('');
  };

  const confirmAction = () => {
    if (selectedDemande) {
      // Simulation: traitement de la demande
      setDemandes(prev => 
        prev.map(d => 
          d.id === selectedDemande.id 
            ? { ...d, statut: actionType === 'valider' ? 'validee' : 'refusee' }
            : d
        )
      );
      
      console.log(`Demande ${actionType === 'valider' ? 'validée' : 'refusée'}:`, {
        demande: selectedDemande,
        commentaire
      });
      
      setShowModal(false);
      setSelectedDemande(null);
      setCommentaire('');
    }
  };

  const demandesEnAttente = demandes.filter(d => d.statut === 'en_attente');
  const demandesTraitees = demandes.filter(d => d.statut !== 'en_attente');

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link to="/admin" className="back-link">← Retour au dashboard</Link>
          <h1>📝 Gestion des demandes d'adhésion</h1>
          <p>Valider ou refuser les demandes d'adhésion des visiteurs</p>
        </div>
        <div className="header-stats">
          <span className="stat-badge warning">
            ⏳ En attente: <strong>{demandesEnAttente.length}</strong>
          </span>
          <span className="stat-badge">
            ✅ Traitées: <strong>{demandesTraitees.length}</strong>
          </span>
        </div>
      </div>

      {demandesEnAttente.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>Aucune demande en attente</h3>
          <p>Toutes les demandes d'adhésion ont été traitées.</p>
        </div>
      ) : (
        <div className="demandes-list">
          <h2>Demandes en attente ({demandesEnAttente.length})</h2>
          {demandesEnAttente.map(demande => (
            <div key={demande.id} className="demande-card">
              <div className="demande-header">
                <div className="demande-user">
                  <h3>{demande.prenom} {demande.nom}</h3>
                  <span className="demande-date">📅 {new Date(demande.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <span className="status-badge pending">En attente</span>
              </div>

              <div className="demande-body">
                <div className="demande-info">
                  <div className="info-row">
                    <span className="info-label">📧 Email:</span>
                    <span className="info-value">{demande.email}</span>
                  </div>
                  {demande.telephone && (
                    <div className="info-row">
                      <span className="info-label">📱 Téléphone:</span>
                      <span className="info-value">{demande.telephone}</span>
                    </div>
                  )}
                </div>

                {demande.justification && (
                  <div className="demande-justification">
                    <strong>💬 Justification:</strong>
                    <p>{demande.justification}</p>
                  </div>
                )}
              </div>

              <div className="demande-actions">
                <button 
                  className="btn btn-success"
                  onClick={() => handleAction(demande, 'valider')}
                >
                  ✅ Valider
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleAction(demande, 'refuser')}
                >
                  ❌ Refuser
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {demandesTraitees.length > 0 && (
        <div className="demandes-traitees">
          <h2>Demandes traitées ({demandesTraitees.length})</h2>
          <div className="demandes-list-compact">
            {demandesTraitees.map(demande => (
              <div key={demande.id} className="demande-compact">
                <span className="demande-name">{demande.prenom} {demande.nom}</span>
                <span className="demande-email">{demande.email}</span>
                <span className={`status-badge ${demande.statut === 'validee' ? 'success' : 'danger'}`}>
                  {demande.statut === 'validee' ? '✅ Validée' : '❌ Refusée'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de confirmation */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {actionType === 'valider' ? '✅ Valider la demande' : '❌ Refuser la demande'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <p>
                Êtes-vous sûr de vouloir <strong>{actionType === 'valider' ? 'valider' : 'refuser'}</strong> la 
                demande de <strong>{selectedDemande?.prenom} {selectedDemande?.nom}</strong> ?
              </p>

              {actionType === 'valider' && (
                <div className="alert alert-info">
                  <span className="alert-icon">ℹ️</span>
                  Un email sera envoyé à <strong>{selectedDemande?.email}</strong> avec un lien 
                  pour créer son mot de passe.
                </div>
              )}

              <div className="form-group">
                <label htmlFor="commentaire">
                  Commentaire {actionType === 'refuser' ? '(optionnel - sera envoyé par email)' : '(optionnel)'}:
                </label>
                <textarea
                  id="commentaire"
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  rows="3"
                  placeholder={actionType === 'valider' 
                    ? "Message de bienvenue personnalisé..." 
                    : "Raison du refus..."}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className={`btn ${actionType === 'valider' ? 'btn-success' : 'btn-danger'}`}
                onClick={confirmAction}
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
    </div>
  );
}

export default GestionDemandesAdhesion;