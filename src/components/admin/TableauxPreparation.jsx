import { useState, useMemo } from 'react';

function TableauxPreparation() {
  const [commandes] = useState(() => {
    // En production, charger depuis localStorage ou API
    const saved = localStorage.getItem('commandes');
    const data = saved ? JSON.parse(saved) : [];
    console.log('📋 Tableaux Préparation - Commandes chargées:', data.length);
    return data;
  });

  const [filterPoint, setFilterPoint] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterCreneau, setFilterCreneau] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');

  // Extraire les options uniques pour les filtres
  const pointsUniques = useMemo(() => {
    return [...new Set(commandes.map(c => c.pointCollecte))].sort();
  }, [commandes]);

  const datesUniques = useMemo(() => {
    return [...new Set(commandes.map(c => c.dateRetrait))].sort();
  }, [commandes]);

  const creneauxUniques = useMemo(() => {
    return [...new Set(commandes.map(c => c.creneauRetrait))].sort();
  }, [commandes]);

  // Filtrer les commandes à préparer (non distribuées, non annulées)
  const commandesAPrearer = useMemo(() => {
    return commandes.filter(c => {
      // Exclure les distribuées et annulées par défaut
      if (filterStatut === 'tous' && ['DISTRIBUTED', 'CANCELLED'].includes(c.statut)) {
        return false;
      }
      
      // Filtre statut personnalisé
      if (filterStatut !== 'tous' && c.statut !== filterStatut) {
        return false;
      }

      // Autres filtres
      if (filterPoint && c.pointCollecte !== filterPoint) return false;
      if (filterDate && c.dateRetrait !== filterDate) return false;
      if (filterCreneau && c.creneauRetrait !== filterCreneau) return false;

      return true;
    });
  }, [commandes, filterPoint, filterDate, filterCreneau, filterStatut]);

  // Créer la pick-list : totaliser les produits par référence
  const pickList = useMemo(() => {
    const produits = {};

    commandesAPrearer.forEach(commande => {
      if (commande.articles && commande.articles.length > 0) {
        commande.articles.forEach(article => {
          const key = article.id || article.nom;
          
          if (!produits[key]) {
            produits[key] = {
              nom: article.nom,
              categorie: article.categorie || 'Autre',
              unite: article.unite || 'pce',
              quantiteTotale: 0,
              commandes: []
            };
          }

          produits[key].quantiteTotale += article.quantite;
          produits[key].commandes.push({
            numero: commande.numero,
            membre: commande.membre,
            quantite: article.quantite
          });
        });
      }
    });

    // Convertir en tableau et trier par catégorie puis nom
    return Object.values(produits).sort((a, b) => {
      if (a.categorie !== b.categorie) {
        return a.categorie.localeCompare(b.categorie);
      }
      return a.nom.localeCompare(b.nom);
    });
  }, [commandesAPrearer]);

  // Regrouper par catégorie
  const pickListParCategorie = useMemo(() => {
    const groupes = {};
    pickList.forEach(produit => {
      if (!groupes[produit.categorie]) {
        groupes[produit.categorie] = [];
      }
      groupes[produit.categorie].push(produit);
    });
    return groupes;
  }, [pickList]);

  const imprimerPickList = () => {
    const contenu = document.getElementById('pick-list-content');
    if (!contenu) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Pick-List - Préparation des commandes</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
            h2 { background: #f0f0f0; padding: 8px; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f9f9f9; font-weight: bold; }
            .total-row { background-color: #fffacd; font-weight: bold; }
            .info-box { background: #e8f4fd; padding: 15px; margin-bottom: 20px; border-left: 4px solid #2196F3; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${contenu.innerHTML}
          <div class="footer">
            <p>Document généré le ${new Date().toLocaleString('fr-FR')}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const exporterCSV = () => {
    let csv = 'Catégorie;Produit;Unité;Quantité totale;Nb commandes\n';
    
    pickList.forEach(p => {
      csv += `${p.categorie};`;
      csv += `${p.nom};`;
      csv += `${p.unite};`;
      csv += `${p.quantiteTotale};`;
      csv += `${p.commandes.length}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pick-list-${filterDate || 'all'}-${filterPoint || 'all'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const [produitSelectionne, setProduitSelectionne] = useState(null);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>📋 Tableaux de préparation</h1>
        <p>Pick-lists et totalisations par produit</p>
      </div>

      {/* Filtres */}
      <div className="card">
        <h2>🔍 Sélectionner la préparation</h2>
        
        <div className="filters-advanced">
          <div className="filter-row">
            <div className="filter-group">
              <label>Point de collecte *</label>
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

            <div className="filter-group">
              <label>Date de retrait *</label>
              <select 
                value={filterDate} 
                onChange={(e) => setFilterDate(e.target.value)}
                className="form-control"
              >
                <option value="">Toutes les dates</option>
                {datesUniques.map(d => (
                  <option key={d} value={d}>
                    {new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Créneau</label>
              <select 
                value={filterCreneau} 
                onChange={(e) => setFilterCreneau(e.target.value)}
                className="form-control"
              >
                <option value="">Tous les créneaux</option>
                {creneauxUniques.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Statut</label>
              <select 
                value={filterStatut} 
                onChange={(e) => setFilterStatut(e.target.value)}
                className="form-control"
              >
                <option value="tous">À préparer (excl. distribuées/annulées)</option>
                <option value="CONFIRMED">Confirmées uniquement</option>
                <option value="IN_PREP">En préparation uniquement</option>
                <option value="READY">Prêtes uniquement</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button 
              onClick={imprimerPickList} 
              className="btn btn-primary"
              disabled={pickList.length === 0}
            >
              🖨️ Imprimer la pick-list
            </button>
            <button 
              onClick={exporterCSV} 
              className="btn btn-secondary"
              disabled={pickList.length === 0}
            >
              📥 Exporter CSV
            </button>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      {commandesAPrearer.length > 0 && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <div className="stat-value">{commandesAPrearer.length}</div>
              <div className="stat-label">Commandes à préparer</div>
            </div>
          </div>
          <div className="stat-card stat-primary">
            <div className="stat-icon">🥬</div>
            <div className="stat-info">
              <div className="stat-value">{pickList.length}</div>
              <div className="stat-label">Références produits</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-value">{pickList.reduce((sum, p) => sum + p.quantiteTotale, 0)}</div>
              <div className="stat-label">Unités totales</div>
            </div>
          </div>
        </div>
      )}

      {/* Pick-List */}
      <div className="card" id="pick-list-content">
        {pickList.length === 0 ? (
          <div className="empty-state">
            <h3>Aucune commande à préparer</h3>
            <p>Sélectionnez un point de collecte et une date pour voir la pick-list.</p>
          </div>
        ) : (
          <>
            <div className="info-box no-print">
              <h3>📍 {filterPoint || 'Tous les points'} - {filterDate ? new Date(filterDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Toutes les dates'}</h3>
              {filterCreneau && <p><strong>Créneau :</strong> {filterCreneau}</p>}
              <p><strong>Commandes concernées :</strong> {commandesAPrearer.length}</p>
            </div>

            <h1 style={{ textAlign: 'center', marginBottom: '30px', display: 'none' }} className="print-only">
              📋 PICK-LIST DE PRÉPARATION
            </h1>

            <div className="info-box print-only" style={{ display: 'none' }}>
              <h3>📍 {filterPoint || 'Tous les points'} - {filterDate ? new Date(filterDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Toutes les dates'}</h3>
              {filterCreneau && <p><strong>Créneau :</strong> {filterCreneau}</p>}
              <p><strong>Commandes concernées :</strong> {commandesAPrearer.length}</p>
              <p><strong>Références produits :</strong> {pickList.length}</p>
            </div>

            {Object.keys(pickListParCategorie).map(categorie => (
              <div key={categorie} style={{ marginBottom: '30px' }}>
                <h2>{categorie}</h2>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th style={{ textAlign: 'center' }}>Unité</th>
                      <th style={{ textAlign: 'center' }}>Quantité totale</th>
                      <th style={{ textAlign: 'center' }}>Nb commandes</th>
                      <th className="no-print">Actions</th>
                      <th className="print-only" style={{ width: '100px' }}>✓</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pickListParCategorie[categorie].map((produit, index) => (
                      <tr key={index}>
                        <td><strong>{produit.nom}</strong></td>
                        <td style={{ textAlign: 'center' }}>{produit.unite}</td>
                        <td style={{ textAlign: 'center' }}><strong style={{ fontSize: '1.2em', color: '#2196F3' }}>{produit.quantiteTotale}</strong></td>
                        <td style={{ textAlign: 'center' }}>{produit.commandes.length}</td>
                        <td className="no-print">
                          <button 
                            onClick={() => setProduitSelectionne(produit)}
                            className="btn btn-sm btn-outline"
                          >
                            👁️ Détail
                          </button>
                        </td>
                        <td className="print-only" style={{ background: '#f0f0f0' }}></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            <div className="total-row" style={{ padding: '15px', background: '#fffacd', border: '2px solid #ffd700', marginTop: '20px' }}>
              <h3>📊 TOTAUX</h3>
              <p><strong>Total références :</strong> {pickList.length} produits différents</p>
              <p><strong>Total unités :</strong> {pickList.reduce((sum, p) => sum + p.quantiteTotale, 0)} unités à préparer</p>
              <p><strong>Total commandes :</strong> {commandesAPrearer.length} commandes</p>
            </div>
          </>
        )}
      </div>

      {/* Liste des commandes concernées */}
      {commandesAPrearer.length > 0 && (
        <div className="card no-print">
          <h2>📦 Commandes concernées</h2>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>N° Commande</th>
                  <th>Membre</th>
                  <th>Retrait</th>
                  <th>Statut</th>
                  <th>Produits</th>
                </tr>
              </thead>
              <tbody>
                {commandesAPrearer.map(c => (
                  <tr key={c.id || c.numero}>
                    <td><strong>{c.numero}</strong></td>
                    <td>{c.membre}</td>
                    <td>{new Date(c.dateRetrait).toLocaleDateString('fr-FR')}<br/>{c.creneauRetrait}</td>
                    <td>
                      <span className={`badge badge-${c.statut === 'READY' ? 'success' : c.statut === 'IN_PREP' ? 'info' : 'warning'}`}>
                        {c.statut}
                      </span>
                    </td>
                    <td>{c.articles?.length || c.produits || 0} article(s)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal détail produit */}
      {produitSelectionne && (
        <div className="modal-overlay" onClick={() => setProduitSelectionne(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Détail : {produitSelectionne.nom}</h2>
              <button onClick={() => setProduitSelectionne(null)} className="close-btn">&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="produit-detail">
                <p><strong>Catégorie :</strong> {produitSelectionne.categorie}</p>
                <p><strong>Quantité totale :</strong> {produitSelectionne.quantiteTotale} {produitSelectionne.unite}</p>
                <p><strong>Nombre de commandes :</strong> {produitSelectionne.commandes.length}</p>

                <h3 style={{ marginTop: '20px' }}>Répartition par commande</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>N° Commande</th>
                      <th>Membre</th>
                      <th>Quantité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produitSelectionne.commandes.map((cmd, index) => (
                      <tr key={index}>
                        <td>{cmd.numero}</td>
                        <td>{cmd.membre}</td>
                        <td><strong>{cmd.quantite} {produitSelectionne.unite}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setProduitSelectionne(null)} className="btn btn-outline">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableauxPreparation;
