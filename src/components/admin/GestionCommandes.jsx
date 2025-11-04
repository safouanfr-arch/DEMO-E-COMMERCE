import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

function GestionCommandes() {
  const [commandes] = useState([
    { id: 1, numero: 'CMD-2025-1101-001', membre: 'Jean Dubois', email: 'jean.dubois@email.com', date: '2025-11-03T14:32:15', dateRetrait: '2025-11-05', creneauRetrait: '18h-19h', montant: 45.80, statut: 'CONFIRMED', pointCollecte: 'Centre-ville', produits: 5 },
    { id: 2, numero: 'CMD-2025-1103-002', membre: 'Anne Lefebvre', email: 'anne.lefebvre@email.com', date: '2025-11-03T09:15:42', dateRetrait: '2025-11-06', creneauRetrait: '17h-18h', montant: 32.50, statut: 'IN_PREP', pointCollecte: 'Marché Nord', produits: 3 },
    { id: 3, numero: 'CMD-2025-1102-003', membre: 'Claire Simon', email: 'claire.simon@email.com', date: '2025-11-02T16:45:23', dateRetrait: '2025-11-04', creneauRetrait: '18h-19h', montant: 67.20, statut: 'READY', pointCollecte: 'Centre-ville', produits: 8 },
    { id: 4, numero: 'CMD-2025-1102-004', membre: 'Marc Laurent', email: 'marc.laurent@email.com', date: '2025-11-02T11:20:10', dateRetrait: '2025-11-04', creneauRetrait: '19h-20h', montant: 28.90, statut: 'CANCELLED', pointCollecte: 'Quartier Sud', produits: 4 },
    { id: 5, numero: 'CMD-2025-1103-005', membre: 'Jean Dubois', email: 'jean.dubois@email.com', date: '2025-11-03T10:05:33', dateRetrait: '2025-11-08', creneauRetrait: '10h-11h', montant: 55.30, statut: 'CONFIRMED', pointCollecte: 'Centre-ville', produits: 6 },
    { id: 6, numero: 'CMD-2025-1101-006', membre: 'Anne Lefebvre', email: 'anne.lefebvre@email.com', date: '2025-11-01T15:30:00', dateRetrait: '2025-11-03', creneauRetrait: '17h-18h', montant: 89.40, statut: 'DISTRIBUTED', pointCollecte: 'Marché Nord', produits: 10 }
  ]);

  const [filterStatut, setFilterStatut] = useState('tous');
  const [filterPoint, setFilterPoint] = useState('tous');
  const [filterDate, setFilterDate] = useState('');
  const [searchMembre, setSearchMembre] = useState('');
  const [groupBy, setGroupBy] = useState('none'); // 'none', 'membre', 'point', 'date'

  // Points de collecte uniques
  const pointsCollecte = useMemo(() => {
    return [...new Set(commandes.map(c => c.pointCollecte))];
  }, [commandes]);

  // Filtrage des commandes
  const filteredCommandes = useMemo(() => {
    return commandes.filter(c => {
      const matchStatut = filterStatut === 'tous' || c.statut === filterStatut;
      const matchPoint = filterPoint === 'tous' || c.pointCollecte === filterPoint;
      const matchDate = !filterDate || c.dateRetrait === filterDate;
      const matchMembre = !searchMembre || 
        c.membre.toLowerCase().includes(searchMembre.toLowerCase()) ||
        c.email.toLowerCase().includes(searchMembre.toLowerCase()) ||
        c.numero.toLowerCase().includes(searchMembre.toLowerCase());
      
      return matchStatut && matchPoint && matchDate && matchMembre;
    });
  }, [commandes, filterStatut, filterPoint, filterDate, searchMembre]);

  // Regroupement des commandes
  const groupedCommandes = useMemo(() => {
    if (groupBy === 'none') return { 'Toutes les commandes': filteredCommandes };
    
    const groups = {};
    filteredCommandes.forEach(c => {
      let key;
      switch (groupBy) {
        case 'membre':
          key = c.membre;
          break;
        case 'point':
          key = c.pointCollecte;
          break;
        case 'date':
          key = new Date(c.dateRetrait).toLocaleDateString('fr-FR');
          break;
        default:
          key = 'Autres';
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(c);
    });
    return groups;
  }, [filteredCommandes, groupBy]);

  const getStatutLabel = (statut) => {
    const labels = {
      'DRAFT': { text: '📝 Brouillon', class: 'secondary' },
      'CONFIRMED': { text: '✅ Confirmée', class: 'success' },
      'IN_PREP': { text: '🔧 En préparation', class: 'info' },
      'READY': { text: '📦 Prête', class: 'primary' },
      'DISTRIBUTED': { text: '🎉 Distribuée', class: 'success' },
      'CANCELLED': { text: '❌ Annulée', class: 'danger' }
    };
    return labels[statut] || { text: statut, class: 'secondary' };
  };

  const statsCommandes = useMemo(() => {
    return {
      total: commandes.length,
      CONFIRMED: commandes.filter(c => c.statut === 'CONFIRMED').length,
      IN_PREP: commandes.filter(c => c.statut === 'IN_PREP').length,
      READY: commandes.filter(c => c.statut === 'READY').length,
      DISTRIBUTED: commandes.filter(c => c.statut === 'DISTRIBUTED').length
    };
  }, [commandes]);

  const resetFilters = () => {
    setFilterStatut('tous');
    setFilterPoint('tous');
    setFilterDate('');
    setSearchMembre('');
    setGroupBy('none');
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link to="/admin" className="back-link">← Retour au dashboard</Link>
          <h1>🛒 Gestion des commandes</h1>
          <p>Consulter, filtrer et gérer les commandes des membres</p>
        </div>
        <button className="btn btn-secondary" onClick={resetFilters}>
          🔄 Réinitialiser les filtres
        </button>
      </div>

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{statsCommandes.total}</div>
          <div className="stat-label">Total commandes</div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-value">{statsCommandes.CONFIRMED}</div>
          <div className="stat-label">Confirmées</div>
        </div>
        <div className="stat-card stat-info">
          <div className="stat-value">{statsCommandes.IN_PREP}</div>
          <div className="stat-label">En préparation</div>
        </div>
        <div className="stat-card stat-primary">
          <div className="stat-value">{statsCommandes.READY}</div>
          <div className="stat-label">Prêtes</div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-value">{statsCommandes.DISTRIBUTED}</div>
          <div className="stat-label">Distribuées</div>
        </div>
      </div>

      {/* Filtres avancés */}
      <div className="filters-advanced">
        <div className="filter-row">
          <div className="filter-group">
            <label>🔍 Rechercher</label>
            <input
              type="text"
              placeholder="Membre, email ou n° commande..."
              value={searchMembre}
              onChange={(e) => setSearchMembre(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>📊 Statut</label>
            <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="filter-select">
              <option value="tous">Tous les statuts</option>
              <option value="CONFIRMED">Confirmées</option>
              <option value="IN_PREP">En préparation</option>
              <option value="READY">Prêtes</option>
              <option value="DISTRIBUTED">Distribuées</option>
              <option value="CANCELLED">Annulées</option>
            </select>
          </div>

          <div className="filter-group">
            <label>📍 Point de collecte</label>
            <select value={filterPoint} onChange={(e) => setFilterPoint(e.target.value)} className="filter-select">
              <option value="tous">Tous les points</option>
              {pointsCollecte.map(point => (
                <option key={point} value={point}>{point}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>📅 Date de retrait</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>📂 Regrouper par</label>
            <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} className="filter-select">
              <option value="none">Aucun regroupement</option>
              <option value="membre">Par membre</option>
              <option value="point">Par point de collecte</option>
              <option value="date">Par date de retrait</option>
            </select>
          </div>
        </div>
      </div>

      {/* Affichage des commandes regroupées */}
      <div className="commandes-container">
        {Object.entries(groupedCommandes).map(([groupName, commandesGroup]) => (
          <div key={groupName} className="commande-group">
            {groupBy !== 'none' && (
              <div className="group-header">
                <h3>{groupName}</h3>
                <span className="group-count">{commandesGroup.length} commande(s)</span>
                {groupBy === 'membre' && (
                  <span className="group-total">
                    Total: {commandesGroup.reduce((sum, c) => sum + c.montant, 0).toFixed(2)} €
                  </span>
                )}
              </div>
            )}

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>N° Commande</th>
                    <th>Horodatage</th>
                    {groupBy !== 'membre' && <th>Membre</th>}
                    {groupBy !== 'date' && <th>Date retrait</th>}
                    <th>Créneau</th>
                    {groupBy !== 'point' && <th>Point de collecte</th>}
                    <th>Produits</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {commandesGroup.map(commande => {
                    const statut = getStatutLabel(commande.statut);
                    return (
                      <tr key={commande.id}>
                        <td><strong>{commande.numero}</strong></td>
                        <td className="text-small">{new Date(commande.date).toLocaleString('fr-FR')}</td>
                        {groupBy !== 'membre' && <td>{commande.membre}</td>}
                        {groupBy !== 'date' && <td>{new Date(commande.dateRetrait).toLocaleDateString('fr-FR')}</td>}
                        <td>{commande.creneauRetrait}</td>
                        {groupBy !== 'point' && <td>{commande.pointCollecte}</td>}
                        <td className="text-center">{commande.produits}</td>
                        <td><strong>{commande.montant.toFixed(2)} €</strong></td>
                        <td><span className={`status-badge ${statut.class}`}>{statut.text}</span></td>
                        <td className="actions-cell">
                          <button className="btn-icon" title="Voir détails">👁️</button>
                          <button className="btn-icon" title="Imprimer">🖨️</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {filteredCommandes.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>Aucune commande trouvée</h3>
            <p>Essayez de modifier vos critères de filtrage.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GestionCommandes;