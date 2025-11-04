import { useState, useMemo } from 'react';

function Archives({ role = 'admin' }) {
  // Charger les commandes depuis localStorage
  const [commandes] = useState(() => {
    const saved = localStorage.getItem('commandes');
    const data = saved ? JSON.parse(saved) : [];
    console.log('📚 Archives - Commandes chargées:', data.length);
    return data;
  });

  // Filtres
  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterDateDebut, setFilterDateDebut] = useState('');
  const [filterDateFin, setFilterDateFin] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMembre, setFilterMembre] = useState('');
  const [filterPoint, setFilterPoint] = useState('');

  // Extraire les membres et points uniques pour les filtres
  const membresUniques = useMemo(() => {
    return [...new Set(commandes.map(c => c.membre))].sort();
  }, [commandes]);

  const pointsUniques = useMemo(() => {
    return [...new Set(commandes.map(c => c.pointCollecte))].sort();
  }, [commandes]);

  // Filtrage des commandes
  const commandesFiltrees = useMemo(() => {
    return commandes.filter(c => {
      // Filtre statut
      if (filterStatut !== 'tous' && c.statut !== filterStatut) return false;

      // Filtre date
      if (filterDateDebut && new Date(c.date) < new Date(filterDateDebut)) return false;
      if (filterDateFin && new Date(c.date) > new Date(filterDateFin)) return false;

      // Filtre membre
      if (filterMembre && c.membre !== filterMembre) return false;

      // Filtre point
      if (filterPoint && c.pointCollecte !== filterPoint) return false;

      // Recherche textuelle
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchNumero = c.numero?.toLowerCase().includes(query);
        const matchMembre = c.membre?.toLowerCase().includes(query);
        const matchEmail = c.email?.toLowerCase().includes(query);
        const matchPoint = c.pointCollecte?.toLowerCase().includes(query);
        
        if (!matchNumero && !matchMembre && !matchEmail && !matchPoint) return false;
      }

      return true;
    });
  }, [commandes, filterStatut, filterDateDebut, filterDateFin, searchQuery, filterMembre, filterPoint]);

  // Statistiques
  const stats = useMemo(() => {
    const total = commandesFiltrees.length;
    const montantTotal = commandesFiltrees.reduce((sum, c) => sum + (c.montant || 0), 0);
    const parStatut = commandesFiltrees.reduce((acc, c) => {
      acc[c.statut] = (acc[c.statut] || 0) + 1;
      return acc;
    }, {});

    return { total, montantTotal, parStatut };
  }, [commandesFiltrees]);

  const getStatutBadge = (statut) => {
    const badges = {
      'DRAFT': { icon: '📝', text: 'Brouillon', class: 'badge-secondary' },
      'CONFIRMED': { icon: '✅', text: 'Confirmée', class: 'badge-success' },
      'IN_PREP': { icon: '🔧', text: 'En préparation', class: 'badge-info' },
      'READY': { icon: '📦', text: 'Prête', class: 'badge-primary' },
      'DISTRIBUTED': { icon: '🎉', text: 'Distribuée', class: 'badge-success' },
      'CANCELLED': { icon: '❌', text: 'Annulée', class: 'badge-danger' }
    };
    const badge = badges[statut] || { icon: '', text: statut, class: 'badge-secondary' };
    return <span className={`badge ${badge.class}`}>{badge.icon} {badge.text}</span>;
  };

  const resetFilters = () => {
    setFilterStatut('tous');
    setFilterDateDebut('');
    setFilterDateFin('');
    setSearchQuery('');
    setFilterMembre('');
    setFilterPoint('');
  };

  const exporterCSV = () => {
    let csv = 'Numéro;Date commande;Membre;Email;Point de collecte;Date retrait;Créneau;Statut;Montant;Produits\n';
    
    commandesFiltrees.forEach(c => {
      csv += `${c.numero};`;
      csv += `${new Date(c.date).toLocaleDateString('fr-FR')};`;
      csv += `${c.membre};`;
      csv += `${c.email || ''};`;
      csv += `${c.pointCollecte};`;
      csv += `${new Date(c.dateRetrait).toLocaleDateString('fr-FR')};`;
      csv += `${c.creneauRetrait};`;
      csv += `${c.statut};`;
      csv += `${c.montant.toFixed(2)}€;`;
      csv += `${c.produits || c.articles?.length || 0}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archives-commandes-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const [commandeSelectionnee, setCommandeSelectionnee] = useState(null);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>📚 Archives des commandes</h1>
        <p>Consultation et recherche dans l'historique complet</p>
      </div>

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Commandes</div>
          </div>
        </div>
        <div className="stat-card stat-primary">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-value">{stats.montantTotal.toFixed(2)}€</div>
            <div className="stat-label">Montant total</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎉</div>
          <div className="stat-info">
            <div className="stat-value">{stats.parStatut['DISTRIBUTED'] || 0}</div>
            <div className="stat-label">Distribuées</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <div className="stat-value">{stats.parStatut['CANCELLED'] || 0}</div>
            <div className="stat-label">Annulées</div>
          </div>
        </div>
      </div>

      {/* Filtres avancés */}
      <div className="card">
        <h2>🔍 Recherche et filtres</h2>
        
        <div className="filters-advanced">
          <div className="filter-row">
            <div className="filter-group">
              <label>Recherche textuelle</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="N° commande, membre, email, point..."
                className="form-control"
              />
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Statut</label>
              <select 
                value={filterStatut} 
                onChange={(e) => setFilterStatut(e.target.value)}
                className="form-control"
              >
                <option value="tous">Tous les statuts</option>
                <option value="DRAFT">Brouillon</option>
                <option value="CONFIRMED">Confirmée</option>
                <option value="IN_PREP">En préparation</option>
                <option value="READY">Prête</option>
                <option value="DISTRIBUTED">Distribuée</option>
                <option value="CANCELLED">Annulée</option>
              </select>
            </div>

            {role === 'admin' && (
              <div className="filter-group">
                <label>Membre</label>
                <select 
                  value={filterMembre} 
                  onChange={(e) => setFilterMembre(e.target.value)}
                  className="form-control"
                >
                  <option value="">Tous les membres</option>
                  {membresUniques.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="filter-group">
              <label>Point de collecte</label>
              <select 
                value={filterPoint} 
                onChange={(e) => setFilterPoint(e.target.value)}
                className="form-control"
              >
                <option value="">Tous les points</option>
                {pointsUniques.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Date de début</label>
              <input
                type="date"
                value={filterDateDebut}
                onChange={(e) => setFilterDateDebut(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="filter-group">
              <label>Date de fin</label>
              <input
                type="date"
                value={filterDateFin}
                onChange={(e) => setFilterDateFin(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={resetFilters} className="btn btn-outline">
              🔄 Réinitialiser
            </button>
            <button onClick={exporterCSV} className="btn btn-secondary">
              📥 Exporter CSV
            </button>
          </div>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="card">
        <h2>Résultats ({commandesFiltrees.length})</h2>
        
        {commandesFiltrees.length === 0 ? (
          <div className="empty-state">
            <p>Aucune commande ne correspond à vos critères de recherche.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>N° Commande</th>
                  <th>Date</th>
                  {role === 'admin' && <th>Membre</th>}
                  <th>Point de collecte</th>
                  <th>Retrait prévu</th>
                  <th>Statut</th>
                  <th>Montant</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {commandesFiltrees.map(c => (
                  <tr key={c.id || c.numero}>
                    <td><strong>{c.numero}</strong></td>
                    <td>{new Date(c.date).toLocaleDateString('fr-FR')} {new Date(c.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</td>
                    {role === 'admin' && <td>{c.membre}<br/><small>{c.email}</small></td>}
                    <td>{c.pointCollecte}</td>
                    <td>{new Date(c.dateRetrait).toLocaleDateString('fr-FR')}<br/>{c.creneauRetrait}</td>
                    <td>{getStatutBadge(c.statut)}</td>
                    <td><strong>{c.montant.toFixed(2)}€</strong></td>
                    <td>
                      <button 
                        onClick={() => setCommandeSelectionnee(c)}
                        className="btn btn-sm btn-outline"
                      >
                        👁️ Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal détail commande */}
      {commandeSelectionnee && (
        <div className="modal-overlay" onClick={() => setCommandeSelectionnee(null)}>
          <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Détail de la commande {commandeSelectionnee.numero}</h2>
              <button onClick={() => setCommandeSelectionnee(null)} className="close-btn">&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="commande-detail">
                <div className="detail-section">
                  <h3>Informations générales</h3>
                  <p><strong>Statut :</strong> {getStatutBadge(commandeSelectionnee.statut)}</p>
                  <p><strong>Date de commande :</strong> {new Date(commandeSelectionnee.date).toLocaleString('fr-FR')}</p>
                  {role === 'admin' && (
                    <>
                      <p><strong>Membre :</strong> {commandeSelectionnee.membre}</p>
                      <p><strong>Email :</strong> {commandeSelectionnee.email}</p>
                    </>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Retrait</h3>
                  <p><strong>Point de collecte :</strong> {commandeSelectionnee.pointCollecte}</p>
                  <p><strong>Date :</strong> {new Date(commandeSelectionnee.dateRetrait).toLocaleDateString('fr-FR')}</p>
                  <p><strong>Créneau :</strong> {commandeSelectionnee.creneauRetrait}</p>
                </div>

                {commandeSelectionnee.paiement && (
                  <div className="detail-section">
                    <h3>Paiement</h3>
                    <p><strong>Mode :</strong> {commandeSelectionnee.paiement.modePaiement === 'carte' ? '💳 Carte bancaire' : '💵 Espèces'}</p>
                    <p><strong>Montant encaissé :</strong> {commandeSelectionnee.paiement.montantEncaisse}€</p>
                    <p><strong>Date :</strong> {new Date(commandeSelectionnee.paiement.dateEncaissement).toLocaleString('fr-FR')}</p>
                    {commandeSelectionnee.paiement.notes && (
                      <p><strong>Notes :</strong> {commandeSelectionnee.paiement.notes}</p>
                    )}
                  </div>
                )}

                <div className="detail-section">
                  <h3>Produits commandés</h3>
                  {commandeSelectionnee.articles && commandeSelectionnee.articles.length > 0 ? (
                    <table className="ticket-table">
                      <thead>
                        <tr>
                          <th>Produit</th>
                          <th>Quantité</th>
                          <th>Prix unitaire</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commandeSelectionnee.articles.map((article, index) => (
                          <tr key={index}>
                            <td>{article.nom}</td>
                            <td>{article.quantite}</td>
                            <td>{article.prixUnitaire.toFixed(2)}€</td>
                            <td>{(article.quantite * article.prixUnitaire).toFixed(2)}€</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3"><strong>Total TVAC</strong></td>
                          <td><strong>{commandeSelectionnee.montant.toFixed(2)}€</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  ) : (
                    <p>{commandeSelectionnee.produits || 0} produit(s)</p>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setCommandeSelectionnee(null)} className="btn btn-outline">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Archives;
