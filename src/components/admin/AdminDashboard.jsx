import { Link } from 'react-router-dom';
import { initialiserDonneesTest } from '../../utils/testData';

function AdminDashboard({ user }) {
  const adminModules = [
    {
      id: 1,
      title: 'Demandes d\'adhésion',
      icon: '📝',
      description: 'Valider ou refuser les nouvelles demandes d\'adhésion',
      path: '/admin/demandes-adhesion',
      color: '#3b82f6',
      stats: { pending: 5 }
    },
    {
      id: 2,
      title: 'Gestion des membres',
      icon: '👥',
      description: 'Suspendre ou réactiver les comptes membres',
      path: '/admin/membres',
      color: '#8b5cf6',
      stats: { total: 42, suspended: 3 }
    },
    {
      id: 3,
      title: 'Produits',
      icon: '📦',
      description: 'Créer, modifier et supprimer des produits',
      path: '/admin/produits',
      color: '#10b981',
      stats: { total: 156 }
    },
    {
      id: 4,
      title: 'Catégories',
      icon: '🏷️',
      description: 'Gérer les catégories de produits',
      path: '/admin/categories',
      color: '#f59e0b',
      stats: { total: 12 }
    },
    {
      id: 5,
      title: 'Points de collecte',
      icon: '📍',
      description: 'Gérer les lieux de retrait des commandes',
      path: '/admin/points-collecte',
      color: '#ef4444',
      stats: { total: 8 }
    },
    {
      id: 6,
      title: 'Commandes',
      icon: '🛒',
      description: 'Consulter et gérer les commandes',
      path: '/admin/commandes',
      color: '#06b6d4',
      stats: { pending: 15, total: 234 }
    },
    {
      id: 7,
      title: 'Stocks',
      icon: '📊',
      description: 'Consulter et mettre à jour les niveaux de stock',
      path: '/admin/stocks',
      color: '#84cc16',
      stats: { lowStock: 8 }
    },
    {
      id: 8,
      title: 'Promotions',
      icon: '🎯',
      description: 'Créer et gérer les offres promotionnelles',
      path: '/admin/promotions',
      color: '#ec4899',
      stats: { active: 3 }
    },
    {
      id: 9,
      title: 'Export des ventes',
      icon: '📈',
      description: 'Exporter les données de vente en CSV',
      path: '/admin/export-ventes',
      color: '#6366f1',
      stats: null
    },
    {
      id: 10,
      title: 'Tableaux de préparation',
      icon: '📋',
      description: 'Pick-lists et totalisations par produit',
      path: '/admin/tableaux-preparation',
      color: '#14b8a6',
      stats: null
    },
    {
      id: 11,
      title: 'Archives',
      icon: '📚',
      description: 'Consultation de l\'historique complet',
      path: '/admin/archives',
      color: '#64748b',
      stats: null
    },
    {
      id: 12,
      title: 'Paramètres emails',
      icon: '📧',
      description: 'Configuration des modèles d\'emails',
      path: '/admin/parametres-emails',
      color: '#f43f5e',
      stats: null
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-welcome">
          <h1>👨‍💼 Tableau de bord Administrateur</h1>
          <p>Bienvenue, {user?.nom} {user?.prenom} ({user?.email})</p>
          <button 
            onClick={() => {
              initialiserDonneesTest();
              alert('✅ Données de test initialisées ! Vous pouvez maintenant utiliser les Archives et les Tableaux de préparation.');
              window.location.reload();
            }}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '10px' }}
          >
            🔄 Initialiser les données de test
          </button>
        </div>
        
        <div className="admin-quick-stats">
          <div className="quick-stat">
            <span className="stat-label">Demandes en attente</span>
            <span className="stat-value">5</span>
          </div>
          <div className="quick-stat">
            <span className="stat-label">Commandes du jour</span>
            <span className="stat-value">12</span>
          </div>
          <div className="quick-stat">
            <span className="stat-label">Alertes stock</span>
            <span className="stat-value warning">8</span>
          </div>
        </div>
      </div>

      <div className="admin-modules-grid">
        {adminModules.map(module => (
          <Link 
            key={module.id} 
            to={module.path} 
            className="admin-module-card"
            style={{ '--module-color': module.color }}
          >
            <div className="module-icon">{module.icon}</div>
            <div className="module-content">
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              
              {module.stats && (
                <div className="module-stats">
                  {Object.entries(module.stats).map(([key, value]) => (
                    <span key={key} className="stat-badge">
                      {key === 'pending' && '⏳ En attente: '}
                      {key === 'total' && '📊 Total: '}
                      {key === 'suspended' && '🚫 Suspendus: '}
                      {key === 'lowStock' && '⚠️ Stock bas: '}
                      {key === 'active' && '✅ Actives: '}
                      <strong>{value}</strong>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="module-arrow">→</div>
          </Link>
        ))}
      </div>

      <div className="admin-info-section">
        <div className="info-card">
          <h3>ℹ️ Informations</h3>
          <p>
            Ce tableau de bord vous permet d'accéder à toutes les fonctionnalités 
            administratives de la plateforme. Cliquez sur n'importe quel module 
            pour commencer.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;