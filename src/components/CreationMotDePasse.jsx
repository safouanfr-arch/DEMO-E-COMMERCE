import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function CreationMotDePasse() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    motDePasse: '',
    confirmMotDePasse: ''
  });

  const [errors, setErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  // Simulation de validation du token
  useEffect(() => {
    const validateToken = () => {
      setTimeout(() => {
        // Simulation: le token est valide si il fait plus de 10 caractères
        const isValid = token && token.length > 10;
        setTokenValid(isValid);
        setLoading(false);
      }, 1000);
    };

    validateToken();
  }, [token]);

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

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Au moins 8 caractères');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Au moins une majuscule');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Au moins une minuscule');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Au moins un chiffre');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Au moins un caractère spécial');
    }
    
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.motDePasse) {
      newErrors.motDePasse = 'Le mot de passe est requis';
    } else {
      const passwordErrors = validatePassword(formData.motDePasse);
      if (passwordErrors.length > 0) {
        newErrors.motDePasse = passwordErrors;
      }
    }
    
    if (!formData.confirmMotDePasse) {
      newErrors.confirmMotDePasse = 'La confirmation est requise';
    } else if (formData.motDePasse !== formData.confirmMotDePasse) {
      newErrors.confirmMotDePasse = 'Les mots de passe ne correspondent pas';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Simulation de création du mot de passe
    console.log('Mot de passe créé pour le token:', token);
    setSuccess(true);
    
    // Redirection automatique vers la connexion après 3 secondes
    setTimeout(() => {
      navigate('/connexion');
    }, 3000);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-message">
          <div className="spinner"></div>
          <h2>Validation de votre invitation...</h2>
          <p>Veuillez patienter pendant que nous vérifions votre lien d'invitation.</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="page-container">
        <div className="error-message">
          <div className="error-icon">❌</div>
          <h2>Lien d'invitation invalide</h2>
          <p>
            Le lien que vous avez utilisé n'est pas valide ou a expiré.
          </p>
          <div className="error-details">
            <p><strong>Causes possibles :</strong></p>
            <ul>
              <li>Le lien a expiré (valide 24h après l'envoi)</li>
              <li>Le lien a déjà été utilisé</li>
              <li>Le lien est mal formé</li>
            </ul>
          </div>
          <div className="actions">
            <Link to="/demande-adhesion" className="btn btn-primary">
              Faire une nouvelle demande
            </Link>
            <Link to="/" className="btn btn-secondary">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="page-container">
        <div className="success-message">
          <div className="success-icon">🎉</div>
          <h2>Mot de passe créé avec succès !</h2>
          <p>
            Votre compte a été activé et votre mot de passe a été configuré.
          </p>
          <div className="success-details">
            <p>
              <strong>✨ Félicitations !</strong> Vous êtes maintenant membre de notre communauté.
            </p>
            <p>
              Vous allez être automatiquement redirigé vers la page de connexion dans quelques secondes...
            </p>
          </div>
          <div className="actions">
            <Link to="/connexion" className="btn btn-primary">
              Se connecter maintenant
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-header">
        <h1>Créer votre mot de passe</h1>
        <p>Définissez un mot de passe sécurisé pour accéder à votre compte</p>
      </div>

      <form onSubmit={handleSubmit} className="password-form">
        <div className="invitation-info">
          <div className="info-card">
            <h3>🔐 Activation de votre compte</h3>
            <p>
              Votre demande d'adhésion a été approuvée ! 
              Créez maintenant votre mot de passe pour finaliser votre inscription.
            </p>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="motDePasse">Nouveau mot de passe *</label>
            <input
              type="password"
              id="motDePasse"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleChange}
              className={errors.motDePasse ? 'error' : ''}
              placeholder="Votre mot de passe"
            />
            {errors.motDePasse && (
              <div className="error-message">
                {Array.isArray(errors.motDePasse) ? (
                  <div>
                    <p>Le mot de passe doit contenir :</p>
                    <ul>
                      {errors.motDePasse.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  errors.motDePasse
                )}
              </div>
            )}
          </div>

          <div className="password-requirements">
            <p><strong>Exigences du mot de passe :</strong></p>
            <div className="requirements-list">
              <div className={`requirement ${formData.motDePasse.length >= 8 ? 'met' : ''}`}>
                ✓ Au moins 8 caractères
              </div>
              <div className={`requirement ${/[A-Z]/.test(formData.motDePasse) ? 'met' : ''}`}>
                ✓ Au moins une majuscule
              </div>
              <div className={`requirement ${/[a-z]/.test(formData.motDePasse) ? 'met' : ''}`}>
                ✓ Au moins une minuscule
              </div>
              <div className={`requirement ${/[0-9]/.test(formData.motDePasse) ? 'met' : ''}`}>
                ✓ Au moins un chiffre
              </div>
              <div className={`requirement ${/[^A-Za-z0-9]/.test(formData.motDePasse) ? 'met' : ''}`}>
                ✓ Au moins un caractère spécial
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmMotDePasse">Confirmer le mot de passe *</label>
            <input
              type="password"
              id="confirmMotDePasse"
              name="confirmMotDePasse"
              value={formData.confirmMotDePasse}
              onChange={handleChange}
              className={errors.confirmMotDePasse ? 'error' : ''}
              placeholder="Confirmez votre mot de passe"
            />
            {errors.confirmMotDePasse && (
              <span className="error-message">{errors.confirmMotDePasse}</span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Créer mon compte
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreationMotDePasse;