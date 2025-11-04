import { useState } from 'react';
import { Link } from 'react-router-dom';

function ReinitialisationMotDePasse() {
  const [step, setStep] = useState('email'); // 'email' ou 'success'
  
  const [formData, setFormData] = useState({
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const validateEmail = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateEmail();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    // Simulation de l'envoi de l'email de réinitialisation
    setTimeout(() => {
      console.log('Email de réinitialisation envoyé à:', formData.email);
      setLoading(false);
      setStep('success');
    }, 2000);
  };

  const handleNewRequest = () => {
    setStep('email');
    setFormData({ email: '' });
    setErrors({});
  };

  if (step === 'success') {
    return (
      <div className="page-container">
        <div className="success-message">
          <div className="success-icon">📧</div>
          <h2>Email de réinitialisation envoyé !</h2>
          <p>
            Nous avons envoyé un lien de réinitialisation à l'adresse :
          </p>
          <div className="email-display">
            <strong>{formData.email}</strong>
          </div>
          
          <div className="success-details">
            <h4>📋 Prochaines étapes :</h4>
            <ol>
              <li>Vérifiez votre boîte email (et vos spams)</li>
              <li>Cliquez sur le lien dans l'email reçu</li>
              <li>Définissez votre nouveau mot de passe</li>
              <li>Connectez-vous avec vos nouveaux identifiants</li>
            </ol>
            
            <div className="important-info">
              <p><strong>⏰ Important :</strong></p>
              <ul>
                <li>Le lien est valide pendant <strong>24 heures</strong></li>
                <li>Vous ne pouvez utiliser le lien qu'<strong>une seule fois</strong></li>
                <li>Si vous ne recevez pas l'email dans 5 minutes, vérifiez vos spams</li>
              </ul>
            </div>
          </div>

          <div className="actions">
            <Link to="/connexion" className="btn btn-primary">
              Retour à la connexion
            </Link>
            <button onClick={handleNewRequest} className="btn btn-secondary">
              Renvoyer un email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-header">
        <h1>Réinitialisation du mot de passe</h1>
        <p>Saisissez votre adresse email pour recevoir un lien de réinitialisation</p>
      </div>

      <form onSubmit={handleSubmit} className="reset-form">
        <div className="info-section">
          <div className="info-card">
            <h3>🔄 Comment ça marche ?</h3>
            <p>
              Nous allons vous envoyer un email sécurisé avec un lien pour créer 
              un nouveau mot de passe. Ce lien sera valide pendant 24 heures.
            </p>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="email">Votre adresse email</label>
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
            <small className="field-help">
              Saisissez l'adresse email associée à votre compte
            </small>
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
                Envoi en cours...
              </>
            ) : (
              'Envoyer le lien de réinitialisation'
            )}
          </button>
        </div>

        <div className="auth-links">
          <Link to="/connexion" className="link">
            ← Retour à la connexion
          </Link>
        </div>
      </form>

      <div className="help-section">
        <div className="help-card">
          <h4>❓ Besoin d'aide ?</h4>
          <div className="faq">
            <div className="faq-item">
              <strong>Je ne trouve pas l'email de réinitialisation</strong>
              <p>
                Vérifiez votre dossier spam/courrier indésirable. 
                L'email peut prendre jusqu'à 5 minutes pour arriver.
              </p>
            </div>
            
            <div className="faq-item">
              <strong>Je n'ai pas accès à mon email</strong>
              <p>
                Si vous n'avez plus accès à votre adresse email, 
                vous devrez créer un nouveau compte via une 
                <Link to="/demande-adhesion" className="link">
                  nouvelle demande d'adhésion
                </Link>.
              </p>
            </div>
            
            <div className="faq-item">
              <strong>Le lien a expiré</strong>
              <p>
                Les liens de réinitialisation expirent après 24 heures. 
                Vous pouvez demander un nouveau lien à tout moment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReinitialisationMotDePasse;