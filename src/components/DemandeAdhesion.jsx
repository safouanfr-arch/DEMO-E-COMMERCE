import { useState } from 'react';
import { Link } from 'react-router-dom';

function DemandeAdhesion() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    accepteConcept: false,
    justification: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.accepteConcept) {
      newErrors.accepteConcept = 'Vous devez accepter le concept pour continuer';
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
    
    // Simulation de l'envoi
    console.log('Demande d\'adhésion soumise:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page-container">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>Demande d'adhésion envoyée !</h2>
          <p>
            Merci pour votre demande d'adhésion. Nous avons bien reçu vos informations.
          </p>
          <div className="success-details">
            <p>
              <strong>📧 Prochaine étape :</strong> Vous recevrez un email à l'adresse 
              <strong> {formData.email} </strong> avec un lien pour créer votre mot de passe 
              une fois votre demande approuvée.
            </p>
            <p>
              <strong>⏰ Délai de traitement :</strong> Comptez généralement 2-3 jours ouvrés 
              pour le traitement de votre demande.
            </p>
          </div>
          <div className="actions">
            <Link to="/" className="btn btn-primary">
              Retour à l'accueil
            </Link>
            <button 
              onClick={() => {setSubmitted(false); setFormData({nom: '', prenom: '', email: '', telephone: '', accepteConcept: false, justification: ''});}}
              className="btn btn-secondary"
            >
              Nouvelle demande
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-header">
        <h1>Demande d'adhésion</h1>
        <p>Remplissez ce formulaire pour devenir membre de notre communauté</p>
      </div>

      <form onSubmit={handleSubmit} className="adhesion-form">
        <div className="form-section">
          <h3>Informations personnelles</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nom">Nom *</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={errors.nom ? 'error' : ''}
                placeholder="Votre nom"
              />
              {errors.nom && <span className="error-message">{errors.nom}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="prenom">Prénom *</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className={errors.prenom ? 'error' : ''}
                placeholder="Votre prénom"
              />
              {errors.prenom && <span className="error-message">{errors.prenom}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="votre.email@exemple.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
            <small className="field-help">
              Cet email sera utilisé pour vous envoyer le lien de création de mot de passe
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="telephone">Téléphone (optionnel)</label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="06 12 34 56 78"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Motivation</h3>
          
          <div className="form-group">
            <label htmlFor="justification">
              Pourquoi souhaitez-vous adhérer ? (optionnel)
            </label>
            <textarea
              id="justification"
              name="justification"
              value={formData.justification}
              onChange={handleChange}
              rows="4"
              placeholder="Expliquez brièvement vos motivations pour rejoindre notre communauté..."
            />
            <small className="field-help">
              Cette information nous aide à mieux comprendre votre profil et vos attentes
            </small>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="accepteConcept"
                checked={formData.accepteConcept}
                onChange={handleChange}
                className={errors.accepteConcept ? 'error' : ''}
              />
              <span className="checkmark"></span>
              J'accepte le concept de la plateforme et ses conditions d'utilisation *
            </label>
            {errors.accepteConcept && <span className="error-message">{errors.accepteConcept}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Envoyer ma demande d'adhésion
          </button>
          <Link to="/" className="btn btn-secondary">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}

export default DemandeAdhesion;