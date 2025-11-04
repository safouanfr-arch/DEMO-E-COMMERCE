export const categories = [
  { id: 1, nom: 'Fruits', description: 'Fruits frais de saison' },
  { id: 2, nom: 'Légumes', description: 'Légumes bio locaux' },
  { id: 3, nom: 'Fromages', description: 'Fromages artisanaux' },
  { id: 4, nom: 'Boulangerie', description: 'Pain et viennoiseries' },
  { id: 5, nom: 'Épicerie', description: 'Produits d\'épicerie fine' },
  { id: 6, nom: 'Viandes', description: 'Viandes de qualité' },
  { id: 7, nom: 'Boissons', description: 'Jus, vins, et boissons' }
];

export const produits = [
  { id: 1, nom: 'Tomates bio', categorie: 'Légumes', categorieId: 2, prix: 3.50, stock: 45, unite: 'kg', image: '🍅', description: 'Tomates cultivées localement, goût authentique', origine: 'France', producteur: 'Ferme du Soleil', datePeremption: '2025-11-10', etiquettes: ['bio', 'végan'], tauxTVA: 6 },
  { id: 2, nom: 'Pain complet', categorie: 'Boulangerie', categorieId: 4, prix: 2.80, stock: 20, unite: 'pièce', image: '🍞', description: 'Pain complet au levain naturel', origine: 'France', producteur: 'Boulangerie Martin', datePeremption: '2025-11-05', etiquettes: ['végétarien', 'végan'], tauxTVA: 6 },
  { id: 3, nom: 'Fromage de chèvre', categorie: 'Fromages', categorieId: 3, prix: 8.50, stock: 12, unite: 'pièce', image: '🧀', description: 'Fromage de chèvre affiné 3 semaines', origine: 'France', producteur: 'Chèvrerie des Collines', datePeremption: '2025-11-20', etiquettes: ['végétarien'], tauxTVA: 6 },
  { id: 4, nom: 'Pommes Golden', categorie: 'Fruits', categorieId: 1, prix: 2.90, stock: 60, unite: 'kg', image: '🍎', description: 'Pommes Golden croquantes et sucrées', origine: 'France', producteur: 'Verger Dubois', datePeremption: '2025-11-25', etiquettes: ['bio', 'végan'], tauxTVA: 6 },
  { id: 5, nom: 'Miel d\'acacia', categorie: 'Épicerie', categorieId: 5, prix: 12.00, stock: 25, unite: 'pot 500g', image: '🍯', description: 'Miel d\'acacia pur, récolte locale', origine: 'France', producteur: 'Rucher des Prés', datePeremption: '2026-11-03', etiquettes: ['végétarien'], tauxTVA: 6 },
  { id: 6, nom: 'Carottes bio', categorie: 'Légumes', categorieId: 2, prix: 2.20, stock: 38, unite: 'kg', image: '🥕', description: 'Carottes biologiques fraîchement récoltées', origine: 'France', producteur: 'Ferme du Soleil', datePeremption: '2025-11-15', etiquettes: ['bio', 'végan'], tauxTVA: 6 },
  { id: 7, nom: 'Œufs bio', categorie: 'Épicerie', categorieId: 5, prix: 4.50, stock: 30, unite: 'douzaine', image: '🥚', description: 'Œufs de poules élevées en plein air', origine: 'France', producteur: 'Ferme Leblanc', datePeremption: '2025-11-12', etiquettes: ['bio', 'végétarien'], tauxTVA: 6 },
  { id: 8, nom: 'Poulet fermier', categorie: 'Viandes', categorieId: 6, prix: 15.90, stock: 8, unite: 'kg', image: '🍗', description: 'Poulet fermier élevé en liberté', origine: 'France', producteur: 'Élevage Dupont', datePeremption: '2025-11-08', etiquettes: [], tauxTVA: 6 },
  { id: 9, nom: 'Jus de pomme', categorie: 'Boissons', categorieId: 7, prix: 3.80, stock: 42, unite: 'litre', image: '🧃', description: 'Jus de pomme artisanal 100% pur fruit', origine: 'France', producteur: 'Verger Dubois', datePeremption: '2026-05-03', etiquettes: ['bio', 'végan'], tauxTVA: 6 },
  { id: 10, nom: 'Courgettes bio', categorie: 'Légumes', categorieId: 2, prix: 2.80, stock: 28, unite: 'kg', image: '🥒', description: 'Courgettes fraîches de saison', origine: 'France', producteur: 'Ferme du Soleil', datePeremption: '2025-11-10', etiquettes: ['bio', 'végan'], tauxTVA: 6 },
  { id: 11, nom: 'Baguette tradition', categorie: 'Boulangerie', categorieId: 4, prix: 1.20, stock: 35, unite: 'pièce', image: '🥖', description: 'Baguette tradition à l\'ancienne', origine: 'France', producteur: 'Boulangerie Martin', datePeremption: '2025-11-04', etiquettes: ['végétarien', 'végan'], tauxTVA: 6 },
  { id: 12, nom: 'Camembert AOP', categorie: 'Fromages', categorieId: 3, prix: 6.90, stock: 15, unite: 'pièce', image: '🧀', description: 'Camembert de Normandie AOP', origine: 'France', producteur: 'Fromagerie Durand', datePeremption: '2025-11-18', etiquettes: ['végétarien'], tauxTVA: 6 },
  { id: 13, nom: 'Fraises', categorie: 'Fruits', categorieId: 1, prix: 5.50, stock: 18, unite: 'barquette 500g', image: '🍓', description: 'Fraises fraîches et parfumées', origine: 'France', producteur: 'Ferme des Vergers', datePeremption: '2025-11-06', etiquettes: ['végan'], tauxTVA: 6 },
  { id: 14, nom: 'Salade verte', categorie: 'Légumes', categorieId: 2, prix: 1.80, stock: 25, unite: 'pièce', image: '🥬', description: 'Salade fraîche du jour', origine: 'France', producteur: 'Maraîcher Local', datePeremption: '2025-11-05', etiquettes: ['bio', 'végan'], tauxTVA: 6 },
  { id: 15, nom: 'Confiture fraise', categorie: 'Épicerie', categorieId: 5, prix: 5.20, stock: 32, unite: 'pot 350g', image: '🍓', description: 'Confiture artisanale 70% de fruits', origine: 'France', producteur: 'Conserverie Artisanale', datePeremption: '2026-08-03', etiquettes: ['végan'], tauxTVA: 21 }
];

export const pointsCollecte = [
  { 
    id: 1, 
    nom: 'Centre-ville', 
    adresse: '15 rue de la République, 75001 Paris', 
    horaires: 'Mer 18h-20h, Sam 10h-13h',
    creneaux: [
      { jour: 'mercredi', horaire: '18h-19h', capacite: 15, reservations: 8 },
      { jour: 'mercredi', horaire: '19h-20h', capacite: 15, reservations: 12 },
      { jour: 'samedi', horaire: '10h-11h', capacite: 20, reservations: 5 },
      { jour: 'samedi', horaire: '11h-12h', capacite: 20, reservations: 18 },
      { jour: 'samedi', horaire: '12h-13h', capacite: 20, reservations: 3 }
    ]
  },
  { 
    id: 2, 
    nom: 'Marché Nord', 
    adresse: '28 avenue du Marché, 75018 Paris', 
    horaires: 'Ven 17h-20h',
    creneaux: [
      { jour: 'vendredi', horaire: '17h-18h', capacite: 12, reservations: 7 },
      { jour: 'vendredi', horaire: '18h-19h', capacite: 12, reservations: 10 },
      { jour: 'vendredi', horaire: '19h-20h', capacite: 12, reservations: 4 }
    ]
  },
  { 
    id: 3, 
    nom: 'Quartier Sud', 
    adresse: '42 boulevard du Sud, 75013 Paris', 
    horaires: 'Jeu 18h-20h',
    creneaux: [
      { jour: 'jeudi', horaire: '18h-19h', capacite: 10, reservations: 6 },
      { jour: 'jeudi', horaire: '19h-20h', capacite: 10, reservations: 2 }
    ]
  }
];