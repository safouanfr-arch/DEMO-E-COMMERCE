# 🛒 Coopérative de Produits Locaux - Interface de démonstration

Interface web complète pour la gestion d'une coopérative de produits locaux avec système de commandes, gestion des membres, stocks et points de collecte.

## 🚀 Démarrage rapide

### Installation

```bash
npm install
```

### Lancement du serveur de développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build pour production

```bash
npm run build
```

---

## 👥 Comptes de test

### Visiteur (non connecté)
- Accès : Demande d'adhésion, Connexion, Réinitialisation mot de passe

### Membre
- **Email** : `membre@test.com`
- **Mot de passe** : `membre123`
- **Accès** : Catalogue, Panier, Commandes, Profil, Archives

### Administrateur
- **Email** : `admin@test.com`
- **Mot de passe** : `admin123`
- **Accès** : Tous les modules d'administration

---

## 📋 Fonctionnalités principales

### 🔐 Espace Visiteur
- ✅ Demande d'adhésion avec validation des champs
- ✅ Création de mot de passe via lien d'invitation
- ✅ Connexion avec authentification
- ✅ Réinitialisation de mot de passe

### 👤 Espace Membre
- ✅ **Catalogue de produits**
  - Recherche textuelle
  - Filtres : catégorie, origine, labels (bio/végé/végan)
  - Tri : nom, prix, nouveautés
  - Affichage grille avec images
  
- ✅ **Fiche produit détaillée**
  - Photos, description, origine, producteur
  - Date de péremption
  - Prix HT/TVAC avec taux TVA
  - Badges labels (bio, végétarien, végan)
  - Stock disponible
  - Ajout au panier
  
- ✅ **Panier**
  - Modification des quantités
  - Suppression d'articles
  - Calculs HT/TVA/TVAC par ligne et totaux
  - Persistance localStorage
  
- ✅ **Commande en 3 étapes**
  - Étape 1 : Choix du point de collecte
  - Étape 2 : Choix du créneau (avec capacité visible)
  - Étape 3 : Récapitulatif et confirmation
  - Numéro de commande : CMD-YYYYMMDD-HHMMSS-RND
  - Réservation automatique du stock
  
- ✅ **Mes commandes**
  - Historique complet
  - Statuts : Brouillon, Confirmée, En préparation, Prête, Distribuée, Annulée
  - Annulation possible (>24h, statut confirmée/brouillon)
  - Détail par commande
  
- ✅ **Archives**
  - Consultation de l'historique complet
  - Recherche avancée
  - Filtres multiples
  
- ✅ **Mon profil**
  - Modification des informations personnelles
  - Changement de mot de passe

### 👨‍💼 Espace Administrateur

#### 📊 Dashboard
- Vue d'ensemble des statistiques
- Accès rapide aux 12 modules de gestion

#### 1️⃣ Gestion des demandes d'adhésion
- Liste des demandes en attente
- Validation ou refus avec raison
- Historique des décisions

#### 2️⃣ Gestion des membres
- Liste complète avec statut
- Suspension/Réactivation avec raison obligatoire
- **Historique des sanctions** par membre
- Suppression avec confirmation

#### 3️⃣ Gestion des produits
- CRUD complet
- Statut actif/suspendu
- Prix, TVA (6% ou 21% par produit)
- Promotions
- Étiquettes (bio, végétarien, végan)
- Date de péremption
- Stock disponible

#### 4️⃣ Gestion des catégories
- CRUD complet
- Association aux produits

#### 5️⃣ Gestion des points de collecte
- CRUD complet
- Adresse complète
- Créneaux horaires configurables
- **Capacité par créneau**
- Réservations en temps réel

#### 6️⃣ Gestion des commandes
- **Filtrage avancé** :
  - Par statut (6 statuts)
  - Par point de collecte
  - Par date de retrait
  - Par membre (recherche textuelle)
  
- **Regroupement dynamique** :
  - Par membre (préparation)
  - Par point de collecte
  - Par date
  
- **Actions** :
  - Changement de statut
  - Enregistrement du paiement
  - Impression des listes
  
- **Statistiques** en temps réel

#### 7️⃣ Gestion des stocks
- Vue d'ensemble avec alertes
- Quantité disponible en temps réel
- Réservations en cours
- Ajustements manuels
- **Journal des mouvements** (traçabilité complète)

#### 8️⃣ Gestion des promotions
- CRUD complet
- Type : pourcentage ou montant fixe
- Période de validité
- Association aux produits

#### 9️⃣ Export des ventes
- Export CSV comptable
- Tous les articles vendus
- Filtrage par période
- Détail HT/TVA/TVAC

#### 🔟 Tableaux de préparation (nouveau)
- **Pick-lists intelligentes**
- Sélection par point + date + créneau
- Totalisation automatique par produit
- Regroupement par catégorie
- Détail par commande
- **Impression optimisée** avec cases à cocher
- Export CSV

#### 1️⃣1️⃣ Archives (nouveau)
- **Recherche avancée** multi-critères
- Statistiques globales
- Vue détaillée par commande
- Informations de paiement
- Export CSV des résultats

#### 1️⃣2️⃣ Paramètres emails (nouveau)
- Configuration des informations générales (logo, coordonnées, mentions légales)
- **4 templates d'emails** :
  - Confirmation de commande
  - Rappel J-1
  - Annulation
  - Validation d'adhésion
- Variables dynamiques {{variable}}
- Prévisualisation

---

## 💳 Gestion du paiement (nouveau)

### Modal d'enregistrement du paiement
- Sélection du mode : Carte bancaire / Espèces
- Saisie du montant encaissé
- Calcul automatique du rendu (espèces)
- Notes additionnelles
- **Génération de ticket/justificatif** :
  - Détail ligne par ligne : HT / TVA / TVAC
  - Totaux généraux
  - Informations de paiement
  - Téléchargement en fichier TXT

---

## 📊 Traçabilité & Stock

### Journal des mouvements (stockJournal.js)

**6 types de mouvements :**
1. **RESERVATION** : Confirmation de commande
2. **ANNULATION** : Annulation (remise en stock)
3. **VENTE** : Distribution effective
4. **AJUSTEMENT** : Correction manuelle
5. **RECEPTION** : Arrivée de stock
6. **PERTE** : Casse, péremption, vol

**Enregistrement complet :**
- ID unique
- Date/Heure
- Type
- Produit
- Quantité
- Commande associée
- Membre
- Raison
- Opérateur

**Fonctions :**
- `reserverStock(commande)` : Réservation automatique
- `annulerReservation(commande)` : Annulation avec remise en stock
- `confirmerVente(commande)` : Vente effective
- `getStatsStock(produitId)` : Statistiques
- `exporterJournalCSV()` : Export pour audit

---

## 🔄 Workflow d'une commande

```
1. MEMBRE COMMANDE
   ↓
2. Statut: CONFIRMED
   + Réservation du stock
   + Email de confirmation
   ↓
3. J-1: Email de rappel
   ↓
4. ADMIN PRÉPARE
   Statut: CONFIRMED → IN_PREP → READY
   (Via Tableaux de préparation)
   ↓
5. MEMBRE RÉCUPÈRE
   Admin enregistre le paiement
   + Génération du ticket
   Statut: READY → DISTRIBUTED
   ↓
6. ARCHIVE
   Consultation possible par membre/admin
```

**Annulation possible :**
- Membre : >24h avant retrait, statut CONFIRMED/DRAFT
- → Stock automatiquement libéré
- → Email d'annulation

---

## 📁 Structure du projet

```
inscription-demo/
├── public/               # Assets statiques
├── src/
│   ├── components/
│   │   ├── admin/       # 12 modules admin
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── GestionDemandesAdhesion.jsx
│   │   │   ├── GestionMembres.jsx
│   │   │   ├── GestionProduits.jsx
│   │   │   ├── GestionCategories.jsx
│   │   │   ├── GestionPointsCollecte.jsx
│   │   │   ├── GestionCommandes.jsx
│   │   │   ├── GestionStocks.jsx
│   │   │   ├── GestionPromotions.jsx
│   │   │   ├── ExportVentes.jsx
│   │   │   ├── GestionPaiement.jsx         (nouveau)
│   │   │   ├── ParametresEmails.jsx        (nouveau)
│   │   │   └── TableauxPreparation.jsx     (nouveau)
│   │   ├── membre/      # 7 composants membre
│   │   │   ├── MembreDashboard.jsx
│   │   │   ├── Catalogue.jsx
│   │   │   ├── FicheProduit.jsx
│   │   │   ├── Panier.jsx
│   │   │   ├── Commande.jsx
│   │   │   ├── MesCommandes.jsx
│   │   │   └── MonProfil.jsx
│   │   ├── shared/      # Composants partagés
│   │   │   └── Archives.jsx                (nouveau)
│   │   ├── DemandeAdhesion.jsx
│   │   ├── CreationMotDePasse.jsx
│   │   ├── Connexion.jsx
│   │   ├── ReinitialisationMotDePasse.jsx
│   │   └── Accueil.jsx
│   ├── contexts/
│   │   └── PanierContext.jsx    # Context global panier
│   ├── data/
│   │   └── mockData.js          # Données de démonstration
│   ├── utils/
│   │   ├── stockJournal.js      # Traçabilité stocks
│   │   └── testData.js          # Initialisation données test
│   ├── App.jsx                  # Routes et navigation
│   ├── App.css                  # Styles globaux (3200+ lignes)
│   └── main.jsx                 # Point d'entrée
├── FONCTIONNALITES.md           # Documentation détaillée
├── Lancer le site web.ps1       # Permet de lancer l'app
├── package.json
└── README.md                    # Ce fichier
```

---

## 🎨 Technologies utilisées

- **React 19.1.1** : Framework UI
- **React Router DOM 6.x** : Routing et navigation
- **Vite 7.1.7** : Build tool & dev server
- **Context API** : Gestion d'état global (panier)
- **LocalStorage** : Persistance des données
- **CSS pur** : Pas de framework CSS

---

## 🧪 Données de test

Au démarrage, l'application initialise automatiquement 6 commandes de test avec différents statuts, points de collecte et dates.

**Fonctions console disponibles :**

```javascript
// Réinitialiser les données de test
initialiserDonneesTest()

// Effacer toutes les données
effacerDonneesTest()
```

---

## 📱 Responsive

L'interface est entièrement responsive et s'adapte aux écrans :
- 📱 Mobile (< 768px)
- 📱 Tablette (768px - 1024px)
- 🖥️ Desktop (> 1024px)

---

## 🖨️ Impression

Les tableaux de préparation et tickets de caisse sont optimisés pour l'impression :
- Masquage des éléments de navigation
- Format adapté au papier A4
- Cases à cocher pour validation terrain

---

## ⚠️ Limitations (Interface de démonstration)

Cette application est une **interface de démonstration visuelle uniquement** :

❌ **Pas implémenté pour la production :**
- Pas de backend réel
- Pas de base de données
- Pas d'authentification sécurisée
- Les emails ne sont pas réellement envoyés
- Les paiements ne sont pas traités par un PSP
- Données stockées en localStorage (non sécurisé)
