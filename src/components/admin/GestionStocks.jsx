import { useState } from 'react';
import { Link } from 'react-router-dom';

function GestionStocks() {
  const [stocks] = useState([
    { id: 1, produit: 'Tomates bio', categorie: 'Légumes', stockActuel: 45, stockMin: 20, stockMax: 100, unite: 'kg' },
    { id: 2, produit: 'Pain complet', categorie: 'Boulangerie', stockActuel: 20, stockMin: 15, stockMax: 50, unite: 'unités' },
    { id: 3, produit: 'Fromage de chèvre', categorie: 'Fromages', stockActuel: 12, stockMin: 10, stockMax: 30, unite: 'unités' },
    { id: 4, produit: 'Pommes Golden', categorie: 'Fruits', stockActuel: 60, stockMin: 30, stockMax: 120, unite: 'kg' },
    { id: 5, produit: 'Miel d\'acacia', categorie: 'Épicerie', stockActuel: 5, stockMin: 10, stockMax: 25, unite: 'pots' },
    { id: 6, produit: 'Œufs bio', categorie: 'Épicerie', stockActuel: 8, stockMin: 20, stockMax: 60, unite: 'douzaines' }
  ]);

  const getStockStatus = (produit) => {
    if (produit.stockActuel <= produit.stockMin) return { label: '🔴 Critique', class: 'danger' };
    if (produit.stockActuel <= produit.stockMin * 1.5) return { label: '🟠 Bas', class: 'warning' };
    return { label: '🟢 Bon', class: 'success' };
  };

  const stocksCritiques = stocks.filter(s => s.stockActuel <= s.stockMin);
  const stocksBas = stocks.filter(s => s.stockActuel > s.stockMin && s.stockActuel <= s.stockMin * 1.5);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link to="/admin" className="back-link">← Retour au dashboard</Link>
          <h1>📊 Gestion des stocks</h1>
          <p>Consulter et mettre à jour les niveaux de stock</p>
        </div>
        <div className="header-stats">
          <span className="stat-badge danger">
            🔴 Critiques: <strong>{stocksCritiques.length}</strong>
          </span>
          <span className="stat-badge warning">
            🟠 Bas: <strong>{stocksBas.length}</strong>
          </span>
        </div>
      </div>

      {stocksCritiques.length > 0 && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <div>
            <strong>Attention !</strong> {stocksCritiques.length} produit(s) en stock critique nécessite(nt) un réapprovisionnement urgent.
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Catégorie</th>
              <th>Stock actuel</th>
              <th>Stock min</th>
              <th>Stock max</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => {
              const status = getStockStatus(stock);
              return (
                <tr key={stock.id}>
                  <td><strong>{stock.produit}</strong></td>
                  <td>{stock.categorie}</td>
                  <td>
                    <strong className={status.class === 'danger' ? 'text-danger' : status.class === 'warning' ? 'text-warning' : ''}>
                      {stock.stockActuel} {stock.unite}
                    </strong>
                  </td>
                  <td>{stock.stockMin} {stock.unite}</td>
                  <td>{stock.stockMax} {stock.unite}</td>
                  <td><span className={`status-badge ${status.class}`}>{status.label}</span></td>
                  <td className="actions-cell">
                    <button className="btn-icon" title="Ajuster stock">✏️</button>
                    <button className="btn-icon btn-primary" title="Réapprovisionner">📦</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="stock-legend">
        <h3>Légende des statuts</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="status-badge danger">🔴 Critique</span>
            <p>Stock actuel ≤ stock minimum (réapprovisionnement urgent)</p>
          </div>
          <div className="legend-item">
            <span className="status-badge warning">🟠 Bas</span>
            <p>Stock actuel ≤ 150% du stock minimum (surveillance recommandée)</p>
          </div>
          <div className="legend-item">
            <span className="status-badge success">🟢 Bon</span>
            <p>Stock actuel {'>'} 150% du stock minimum (niveau normal)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GestionStocks;