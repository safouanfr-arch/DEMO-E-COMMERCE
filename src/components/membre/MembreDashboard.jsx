import { Link } from 'react-router-dom';
import { usePanier } from '../../contexts/PanierContext';

function MembreDashboard({ user }) {
  const { getTotalArticles } = usePanier();

  const quickActions = [
    { id: 1, title: 'Catalogue', icon: '🛍️', description: 'Parcourir nos produits', path: '/catalogue', color: '#3b82f6' },
    { id: 2, title: 'Mon panier', icon: '🛒', description: `${getTotalArticles()} article(s)`, path: '/panier', color: '#10b981' },
    { id: 3, title: 'Mes commandes', icon: '📦', description: 'Historique et suivi', path: '/mes-commandes', color: '#f59e0b' },
    { id: 4, title: 'Mon profil', icon: '👤', description: 'Gérer mes informations', path: '/mon-profil', color: '#8b5cf6' }
  ];

  return (
    <div className="membre-dashboard">
      <div className="membre-header">
        <div className="membre-welcome">
          <h1>🌟 Bienvenue, {user?.prenom || 'Membre'} !</h1>
          <p>Découvrez nos produits locaux et de qualité</p>
        </div>
      </div>

      <div className="quick-actions-grid">
        {quickActions.map(action => (
          <Link 
            key={action.id} 
            to={action.path} 
            className="quick-action-card"
            style={{ '--action-color': action.color }}
          >
            <div className="action-icon">{action.icon}</div>
            <div className="action-content">
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </div>
            <div className="action-arrow">→</div>
          </Link>
        ))}
      </div>

      <div className="dashboard-info">
        <div className="info-card">
          <h3>🎯 Commencer vos achats</h3>
          <p>
            Parcourez notre catalogue de produits frais et locaux. Ajoutez vos articles au panier,
            choisissez votre point de collecte préféré et validez votre commande.
          </p>
          <Link to="/catalogue" className="btn btn-primary">
            Découvrir le catalogue
          </Link>
        </div>

        <div className="info-card">
          <h3>ℹ️ Comment ça marche ?</h3>
          <ol>
            <li>Parcourez le catalogue et ajoutez des produits à votre panier</li>
            <li>Validez votre panier et choisissez un point de collecte</li>
            <li>Sélectionnez un créneau de retrait (minimum J+1)</li>
            <li>Confirmez votre commande</li>
            <li>Retirez vos produits au point et créneau choisis</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default MembreDashboard;