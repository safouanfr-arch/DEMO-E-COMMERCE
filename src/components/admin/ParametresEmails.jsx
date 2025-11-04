import { useState, useEffect } from 'react';

function ParametresEmails() {
  const [config, setConfig] = useState({
    logo: '',
    nomEntreprise: 'Coopérative de Produits Locaux',
    adresseEmail: 'contact@coop-locale.be',
    telephone: '+32 123 45 67 89',
    adressePostale: 'Rue de la Coopérative 123, 1000 Bruxelles',
    mentionsLegales: 'TVA: BE0123456789 - RC: Bruxelles 123456',
    
    // Templates emails
    confirmationCommande: {
      objet: 'Confirmation de votre commande {{numero}}',
      contenu: `Bonjour {{prenom}},

Nous vous confirmons la réception de votre commande n°{{numero}}.

📦 DÉTAIL DE VOTRE COMMANDE
{{detailProduits}}

💰 MONTANT TOTAL : {{montant}}€ TVAC

📍 RETRAIT
Point de collecte : {{pointCollecte}}
Date : {{dateRetrait}}
Créneau : {{creneauRetrait}}

⚠️ Le paiement s'effectuera à l'enlèvement (carte ou espèces).

Vous recevrez un rappel par email la veille de votre retrait.

Merci de votre confiance !`
    },
    
    rappelJ1: {
      objet: 'Rappel : Retrait de votre commande demain',
      contenu: `Bonjour {{prenom}},

🔔 Nous vous rappelons que votre commande n°{{numero}} est à retirer DEMAIN.

📍 INFORMATIONS DE RETRAIT
Point de collecte : {{pointCollecte}}
Adresse : {{adressePoint}}
Date : {{dateRetrait}}
Créneau : {{creneauRetrait}}

💰 Montant à régler : {{montant}}€ TVAC
💳 Modes de paiement acceptés : Carte bancaire ou Espèces

📦 RAPPEL DE VOTRE COMMANDE
{{detailProduits}}

N'oubliez pas d'apporter un sac réutilisable !

À demain !`
    },
    
    annulationCommande: {
      objet: 'Annulation de votre commande {{numero}}',
      contenu: `Bonjour {{prenom}},

Nous vous confirmons l'annulation de votre commande n°{{numero}}.

Les produits réservés ont été remis en stock et seront disponibles pour d'autres membres.

Si cette annulation est involontaire ou si vous avez des questions, n'hésitez pas à nous contacter.

Cordialement`
    },
    
    validationAdhesion: {
      objet: 'Bienvenue à la Coopérative !',
      contenu: `Bonjour {{prenom}},

🎉 Félicitations ! Votre demande d'adhésion a été validée.

Vous pouvez maintenant :
✅ Parcourir notre catalogue de produits locaux
✅ Passer commande
✅ Gérer votre profil

Pour vous connecter, utilisez l'adresse email : {{email}}

Si vous n'avez pas encore créé votre mot de passe, cliquez sur le lien suivant :
{{lienMotDePasse}}

Bienvenue dans notre communauté !`
    }
  });

  useEffect(() => {
    // Charger la config depuis localStorage
    const saved = localStorage.getItem('emailConfig');
    if (saved) {
      setConfig(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('emailConfig', JSON.stringify(config));
    alert('✅ Configuration des emails sauvegardée !');
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setConfig({ ...config, logo: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateTemplate = (templateName, field, value) => {
    setConfig({
      ...config,
      [templateName]: {
        ...config[templateName],
        [field]: value
      }
    });
  };

  const previsualiser = (template) => {
    const variables = {
      prenom: 'Jean',
      numero: 'CMD-20251103-143215-482',
      montant: '45.80',
      pointCollecte: 'Centre-ville',
      adressePoint: 'Place du Marché 1, 1000 Bruxelles',
      dateRetrait: '5 novembre 2025',
      creneauRetrait: '18h-19h',
      detailProduits: '• Tomates bio (1kg) - 3.50€\n• Pain complet - 2.80€\n• Fromage fermier - 8.50€',
      email: 'jean.dubois@email.com',
      lienMotDePasse: 'https://app.coop-locale.be/creer-mot-de-passe?token=xxx'
    };

    let contenu = template.contenu;
    Object.keys(variables).forEach(key => {
      contenu = contenu.replace(new RegExp(`{{${key}}}`, 'g'), variables[key]);
    });

    alert(`APERÇU EMAIL\n\nObjet: ${template.objet.replace('{{numero}}', variables.numero)}\n\n${contenu}`);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>📧 Paramétrage des emails</h1>
        <p>Configuration des modèles d'emails automatiques</p>
      </div>

      <div className="parametres-emails">
        {/* Informations générales */}
        <div className="card">
          <h2>Informations générales</h2>
          
          <div className="form-group">
            <label htmlFor="logo">Logo de l'entreprise</label>
            {config.logo && (
              <div className="logo-preview">
                <img src={config.logo} alt="Logo" style={{ maxWidth: '200px', maxHeight: '100px' }} />
              </div>
            )}
            <input
              type="file"
              id="logo"
              accept="image/*"
              onChange={handleLogoChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nomEntreprise">Nom de l'entreprise</label>
            <input
              type="text"
              id="nomEntreprise"
              value={config.nomEntreprise}
              onChange={(e) => setConfig({ ...config, nomEntreprise: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="adresseEmail">Adresse email</label>
            <input
              type="email"
              id="adresseEmail"
              value={config.adresseEmail}
              onChange={(e) => setConfig({ ...config, adresseEmail: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="telephone">Téléphone</label>
            <input
              type="tel"
              id="telephone"
              value={config.telephone}
              onChange={(e) => setConfig({ ...config, telephone: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="adressePostale">Adresse postale</label>
            <input
              type="text"
              id="adressePostale"
              value={config.adressePostale}
              onChange={(e) => setConfig({ ...config, adressePostale: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mentionsLegales">Mentions légales</label>
            <input
              type="text"
              id="mentionsLegales"
              value={config.mentionsLegales}
              onChange={(e) => setConfig({ ...config, mentionsLegales: e.target.value })}
              className="form-control"
            />
          </div>
        </div>

        {/* Templates emails */}
        {['confirmationCommande', 'rappelJ1', 'annulationCommande', 'validationAdhesion'].map(templateName => {
          const labels = {
            confirmationCommande: '✅ Email de confirmation de commande',
            rappelJ1: '🔔 Email de rappel J-1',
            annulationCommande: '❌ Email d\'annulation',
            validationAdhesion: '🎉 Email de validation d\'adhésion'
          };

          return (
            <div key={templateName} className="card">
              <h2>{labels[templateName]}</h2>
              
              <div className="form-group">
                <label>Objet de l'email</label>
                <input
                  type="text"
                  value={config[templateName].objet}
                  onChange={(e) => updateTemplate(templateName, 'objet', e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Contenu de l'email</label>
                <textarea
                  value={config[templateName].contenu}
                  onChange={(e) => updateTemplate(templateName, 'contenu', e.target.value)}
                  className="form-control"
                  rows="15"
                  style={{ fontFamily: 'monospace' }}
                />
                <small className="form-hint">
                  Variables disponibles : {'{{'}{'}'}prenom{'{{'}{'}}'}, {'{{'}{'}'}numero{'{{'}{'}}'}, {'{{'}{'}'}montant{'{{'}{'}}'}, {'{{'}{'}'}pointCollecte{'{{'}{'}}'}, 
                  {'{{'}{'}'}dateRetrait{'{{'}{'}}'}, {'{{'}{'}'}creneauRetrait{'{{'}{'}}'}, {'{{'}{'}'}detailProduits{'{{'}{'}}'}
                </small>
              </div>

              <button 
                onClick={() => previsualiser(config[templateName])} 
                className="btn btn-outline"
              >
                👁️ Prévisualiser
              </button>
            </div>
          );
        })}

        <div className="actions-bar">
          <button onClick={handleSave} className="btn btn-primary btn-lg">
            💾 Enregistrer la configuration
          </button>
        </div>
      </div>
    </div>
  );
}

export default ParametresEmails;
