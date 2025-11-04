import { useState } from 'react';
import { Link } from 'react-router-dom';

function MonProfil({ user, onUpdate }) {
  const [activeTab, setActiveTab] = useState('profil'); // 'profil' ou 'password'
  
  // Formulaire profil
  const [profilData, setProfilData] = useState({
    nom: user?.nom || 'Utilisateur',
    prenom: user?.prenom || 'Test',
    email: user?.email || '',
    telephone: user?.telephone || '06 12 34 56 78'
  });
  const [profilSaved, setProfilSaved] = useState(false);

  // Formulaire mot de passe
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleProfilChange = (e) => {
    const { name, value } = e.target;
    setProfilData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilSubmit = (e) => {
    e.preventDefault();
    
    // Simuler la mise à jour
    onUpdate({ ...user, ...profilData });
    setProfilSaved(true);
    setTimeout(() => setProfilSaved(false), 3000);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('Au moins 8 caractères');
    if (!/[A-Z]/.test(password)) errors.push('Au moins une majuscule');
    if (!/[a-z]/.test(password)) errors.push('Au moins une minuscule');
    if (!/[0-9]/.test(password)) errors.push('Au moins un chiffre');
    if (!/[^A-Za-z0-9]/.test(password)) errors.push('Au moins un caractère spécial');
    return errors;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Le mot de passe actuel est requis';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'Le nouveau mot de passe est requis';
    } else {
      const validationErrors = validatePassword(passwordData.newPassword);
      if (validationErrors.length > 0) {
        errors.newPassword = validationErrors;
      }
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'La confirmation est requise';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    // Simuler le changement de mot de passe
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  return (
    <div className="profil-page">
      <div className="profil-header">
        <div>
          <h1>👤 Mon profil</h1>
          <p>Gérez vos informations personnelles et votre mot de passe</p>
        </div>
        <Link to="/catalogue" className="btn btn-secondary">
          ← Retour au catalogue
        </Link>
      </div>

      <div className="profil-container">
        <div className="profil-tabs">
          <button
            className={`tab-btn ${activeTab === 'profil' ? 'active' : ''}`}
            onClick={() => setActiveTab('profil')}
          >
            📝 Informations personnelles
          </button>
          <button
            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            🔐 Mot de passe
          </button>
        </div>

        {/* Onglet Profil */}
        {activeTab === 'profil' && (
          <div className="tab-content">
            <form onSubmit={handleProfilSubmit} className="profil-form">
              {profilSaved && (
                <div className="alert alert-success">
                  <span className="alert-icon">✅</span>
                  Vos informations ont été mises à jour avec succès !
                </div>
              )}

              <div className="form-section">
                <h3>Informations personnelles</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nom">Nom *</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={profilData.nom}
                      onChange={handleProfilChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="prenom">Prénom *</label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={profilData.prenom}
                      onChange={handleProfilChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profilData.email}
                    onChange={handleProfilChange}
                    required
                  />
                  <small className="field-help">
                    Cet email est utilisé pour la connexion et les notifications
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="telephone">Téléphone</label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={profilData.telephone}
                    onChange={handleProfilChange}
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  💾 Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Onglet Mot de passe */}
        {activeTab === 'password' && (
          <div className="tab-content">
            <form onSubmit={handlePasswordSubmit} className="password-form">
              {passwordSaved && (
                <div className="alert alert-success">
                  <span className="alert-icon">✅</span>
                  Votre mot de passe a été modifié avec succès !
                </div>
              )}

              <div className="form-section">
                <h3>Changer de mot de passe</h3>

                <div className="form-group">
                  <label htmlFor="currentPassword">Mot de passe actuel *</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.currentPassword ? 'error' : ''}
                  />
                  {passwordErrors.currentPassword && (
                    <span className="error-message">{passwordErrors.currentPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">Nouveau mot de passe *</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.newPassword ? 'error' : ''}
                  />
                  {passwordErrors.newPassword && (
                    <div className="error-message">
                      {Array.isArray(passwordErrors.newPassword) ? (
                        <div>
                          <p>Le mot de passe doit contenir :</p>
                          <ul>
                            {passwordErrors.newPassword.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        passwordErrors.newPassword
                      )}
                    </div>
                  )}
                </div>

                <div className="password-requirements">
                  <p><strong>Exigences du mot de passe :</strong></p>
                  <div className="requirements-list">
                    <div className={`requirement ${passwordData.newPassword.length >= 8 ? 'met' : ''}`}>
                      ✓ Au moins 8 caractères
                    </div>
                    <div className={`requirement ${/[A-Z]/.test(passwordData.newPassword) ? 'met' : ''}`}>
                      ✓ Au moins une majuscule
                    </div>
                    <div className={`requirement ${/[a-z]/.test(passwordData.newPassword) ? 'met' : ''}`}>
                      ✓ Au moins une minuscule
                    </div>
                    <div className={`requirement ${/[0-9]/.test(passwordData.newPassword) ? 'met' : ''}`}>
                      ✓ Au moins un chiffre
                    </div>
                    <div className={`requirement ${/[^A-Za-z0-9]/.test(passwordData.newPassword) ? 'met' : ''}`}>
                      ✓ Au moins un caractère spécial
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.confirmPassword ? 'error' : ''}
                  />
                  {passwordErrors.confirmPassword && (
                    <span className="error-message">{passwordErrors.confirmPassword}</span>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  🔐 Modifier le mot de passe
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="profil-info">
        <div className="info-card">
          <h3>ℹ️ Informations importantes</h3>
          <ul>
            <li>Vos informations personnelles sont sécurisées et ne seront jamais partagées</li>
            <li>En cas de changement d'email, vous devrez vous reconnecter</li>
            <li>Un mot de passe fort garantit la sécurité de votre compte</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MonProfil;