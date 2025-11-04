import { useState } from 'react';
import { Link } from 'react-router-dom';

function ExportVentes() {
  const [dateDebut, setDateDebut] = useState('2025-10-01');
  const [dateFin, setDateFin] = useState('2025-11-03');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [format, setFormat] = useState('csv');
  const [exporting, setExporting] = useState(false);

  const stats = {
    nbCommandes: 234,
    montantTotal: 12450.80,
    panierMoyen: 53.21,
    nbClients: 42
  };

  const handleExport = () => {
    setExporting(true);
    
    // Simulation de génération du CSV
    setTimeout(() => {
      const csvContent = generateCSV();
      downloadCSV(csvContent);
      setExporting(false);
    }, 2000);
  };

  const generateCSV = () => {
    let content = '';
    
    if (includeDetails) {
      content = `Numéro Commande,Date,Client,Email,Montant,Statut,Point de Collecte\n`;
      content += `CMD-2025-001,2025-11-03,Jean Dubois,jean.dubois@email.com,45.80,Livrée,Centre-ville\n`;
      content += `CMD-2025-002,2025-11-03,Anne Lefebvre,anne.lefebvre@email.com,32.50,Préparée,Marché Nord\n`;
      content += `CMD-2025-003,2025-11-02,Claire Simon,claire.simon@email.com,67.20,Livrée,Centre-ville\n`;
      content += `CMD-2025-004,2025-11-02,Marc Laurent,marc.laurent@email.com,28.90,Annulée,Quartier Sud\n`;
    } else {
      content = `Date,Nombre de commandes,Montant total\n`;
      content += `2025-11-03,15,680.50\n`;
      content += `2025-11-02,18,892.30\n`;
      content += `2025-11-01,12,456.80\n`;
    }
    
    return content;
  };

  const downloadCSV = (content) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `export_ventes_${dateDebut}_${dateFin}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link to="/admin" className="back-link">← Retour au dashboard</Link>
          <h1>📈 Export des ventes</h1>
          <p>Générer et télécharger un rapport des ventes en CSV</p>
        </div>
      </div>

      <div className="export-container">
        <div className="export-form">
          <h2>Configuration de l'export</h2>
          
          <div className="form-section">
            <h3>Période</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dateDebut">Date de début</label>
                <input
                  type="date"
                  id="dateDebut"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dateFin">Date de fin</label>
                <input
                  type="date"
                  id="dateFin"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Options</h3>
            
            <div className="form-group">
              <label htmlFor="format">Format d'export</label>
              <select id="format" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="csv">CSV (Excel)</option>
                <option value="json">JSON</option>
                <option value="xlsx">Excel (.xlsx)</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={includeDetails}
                  onChange={(e) => setIncludeDetails(e.target.checked)}
                />
                <span>Inclure les détails des commandes</span>
              </label>
              <small className="field-help">
                Si coché, chaque commande sera détaillée. Sinon, seulement les totaux par jour.
              </small>
            </div>
          </div>

          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <span className="spinner small"></span>
                  Génération en cours...
                </>
              ) : (
                <>📥 Générer et télécharger</>
              )}
            </button>
          </div>
        </div>

        <div className="export-preview">
          <h2>Aperçu des données</h2>
          
          <div className="preview-stats">
            <div className="preview-stat-card">
              <span className="stat-icon">🛒</span>
              <div className="stat-content">
                <span className="stat-label">Nombre de commandes</span>
                <span className="stat-value">{stats.nbCommandes}</span>
              </div>
            </div>

            <div className="preview-stat-card">
              <span className="stat-icon">💰</span>
              <div className="stat-content">
                <span className="stat-label">Montant total</span>
                <span className="stat-value">{stats.montantTotal.toFixed(2)} €</span>
              </div>
            </div>

            <div className="preview-stat-card">
              <span className="stat-icon">📊</span>
              <div className="stat-content">
                <span className="stat-label">Panier moyen</span>
                <span className="stat-value">{stats.panierMoyen.toFixed(2)} €</span>
              </div>
            </div>

            <div className="preview-stat-card">
              <span className="stat-icon">👥</span>
              <div className="stat-content">
                <span className="stat-label">Clients actifs</span>
                <span className="stat-value">{stats.nbClients}</span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h4>ℹ️ À propos de l'export</h4>
            <ul>
              <li>Le fichier sera téléchargé automatiquement après génération</li>
              <li>Format CSV compatible avec Excel, Google Sheets, etc.</li>
              <li>Les données sont encodées en UTF-8 pour les caractères spéciaux</li>
              <li>L'export inclut toutes les commandes validées dans la période sélectionnée</li>
            </ul>
          </div>

          <div className="preview-sample">
            <h4>Exemple de contenu {includeDetails ? '(détaillé)' : '(résumé)'}</h4>
            <pre className="csv-preview">
{includeDetails ? 
`Numéro Commande,Date,Client,Email,Montant,Statut
CMD-2025-001,2025-11-03,Jean Dubois,jean@...,45.80,Livrée
CMD-2025-002,2025-11-03,Anne Lefebvre,anne@...,32.50,Préparée
...` 
:
`Date,Nombre de commandes,Montant total
2025-11-03,15,680.50
2025-11-02,18,892.30
...`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportVentes;