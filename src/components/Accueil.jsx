import { Link } from 'react-router-dom';

function Accueil({ isConnected, user }) {
  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>Bienvenue sur notre plateforme</h1>
        {isConnected && user ? (
          <div className="welcome-message">
            <h2>Bonjour {user.email} !</h2>
            <p>Vous êtes maintenant connecté à votre espace membre.</p>
            <div className="user-actions">
              <button className="btn btn-primary">Accéder à mon espace</button>
            </div>
          </div>
        ) : (
          <div className="visitor-section">
            <p className="intro-text">
              Vous n'êtes pas encore membre ? Découvrez comment rejoindre notre communauté !
            </p>
            
            <div className="action-cards">
              <div className="card">
                <h3>🔐 Nouvel membre</h3>
                <p>Soumettez votre demande d'adhésion et rejoignez notre communauté.</p>
                <Link to="/demande-adhesion" className="btn btn-primary">
                  Faire une demande d'adhésion
                </Link>
              </div>
              
              <div className="card">
                <h3>👤 Déjà membre</h3>
                <p>Connectez-vous à votre espace personnel pour accéder à vos services.</p>
                <Link to="/connexion" className="btn btn-secondary">
                  Se connecter
                </Link>
              </div>
            </div>
            
            <div className="help-section">
              <p>
                Problème de connexion ? 
                <Link to="/reinitialisation-mot-de-passe" className="link">
                  Réinitialisez votre mot de passe
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Accueil;