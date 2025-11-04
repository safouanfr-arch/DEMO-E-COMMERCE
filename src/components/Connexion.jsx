import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Connexion({ onLogin }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.motDePasse) {
      newErrors.motDePasse = 'Le mot de passe est requis';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    // Simulation de la connexion
    setTimeout(() => {
      // Simulation: connexion admin si email contient "admin", membre si contient "membre"
      const isAdmin = formData.email.toLowerCase().includes('admin');
      const isMembre = formData.email.toLowerCase().includes('membre');
      
      if (isAdmin || isMembre) {
        const userData = {
          email: formData.email,
          nom: isAdmin ? 'Administrateur' : 'Utilisateur',
          prenom: 'Test',
          role: isAdmin ? 'admin' : 'membre'
        };
        
        onLogin(userData);
        navigate(isAdmin ? '/admin' : '/');
      } else {
        setErrors({
          general: 'Email ou mot de passe incorrect. Vérifiez vos identifiants.'
        });
      }
      
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="page-container">
      <div className="form-header">
        <h1>Connexion</h1>
        <p>Accédez à votre espace membre</p>
      </div>

      <div className="auth-container">
        <form onSubmit={handleSubmit} className="login-form">
          {errors.general && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              {errors.general}
            </div>
          )}

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="votre.email@exemple.com"
                disabled={loading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="motDePasse">Mot de passe</label>
              <input
                type="password"
                id="motDePasse"
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleChange}
                className={errors.motDePasse ? 'error' : ''}
                placeholder="Votre mot de passe"
                disabled={loading}
              />
              {errors.motDePasse && <span className="error-message">{errors.motDePasse}</span>}
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span className="checkmark"></span>
                Se souvenir de moi
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner small"></span>
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>

          <div className="auth-links">
            <Link to="/reinitialisation-mot-de-passe" className="link">
              Mot de passe oublié ?
            </Link>
          </div>
        </form>

        <div className="auth-divider">
          <span>ou</span>
        </div>

        <div className="auth-alternative">
          <h3>Pas encore membre ?</h3>
          <p>Rejoignez notre communauté en soumettant une demande d'adhésion.</p>
          <Link to="/demande-adhesion" className="btn btn-secondary">
            Demande d'adhésion
          </Link>
        </div>
      </div>

      <div className="demo-info">
        <div className="info-card">
          <h4>🔧 Information de démonstration</h4>
          <p>
            <strong>Connexion Admin :</strong> Utilisez un email contenant "admin" (ex: admin@exemple.com)<br/>
            <strong>Connexion Membre :</strong> Utilisez un email contenant "membre" (ex: membre@exemple.com)<br/>
            Le mot de passe peut être n'importe quoi.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Connexion;