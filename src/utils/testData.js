// Utilitaire pour initialiser des données de test dans localStorage
// Exécuter cette fonction depuis la console du navigateur pour peupler les données

export function initialiserDonneesTest() {
  // Générer quelques commandes avec détails complets
  const commandesTest = [
    {
      id: 1,
      numero: 'CMD-20251101-143215-482',
      membre: 'Jean Dubois',
      email: 'jean.dubois@email.com',
      date: '2025-11-01T14:32:15',
      dateRetrait: '2025-11-05',
      creneauRetrait: '18h-19h',
      pointCollecte: 'Centre-ville',
      statut: 'CONFIRMED',
      montant: 45.80,
      produits: 5,
      articles: [
        { id: 1, nom: 'Tomates bio', quantite: 2, prixUnitaire: 3.50, tauxTVA: 6, unite: 'kg', categorie: 'Fruits et légumes' },
        { id: 2, nom: 'Pain complet', quantite: 3, prixUnitaire: 2.80, tauxTVA: 6, unite: 'pce', categorie: 'Boulangerie' },
        { id: 3, nom: 'Fromage fermier', quantite: 1, prixUnitaire: 8.50, tauxTVA: 6, unite: 'kg', categorie: 'Produits laitiers' },
        { id: 4, nom: 'Miel local', quantite: 2, prixUnitaire: 6.90, tauxTVA: 6, unite: 'pot', categorie: 'Épicerie sucrée' },
        { id: 5, nom: 'Œufs bio', quantite: 1, prixUnitaire: 4.20, tauxTVA: 6, unite: 'boîte', categorie: 'Produits laitiers' }
      ]
    },
    {
      id: 2,
      numero: 'CMD-20251103-091542-738',
      membre: 'Anne Lefebvre',
      email: 'anne.lefebvre@email.com',
      date: '2025-11-03T09:15:42',
      dateRetrait: '2025-11-06',
      creneauRetrait: '17h-18h',
      pointCollecte: 'Marché Nord',
      statut: 'IN_PREP',
      montant: 32.50,
      produits: 3,
      articles: [
        { id: 6, nom: 'Carottes bio', quantite: 3, prixUnitaire: 2.50, tauxTVA: 6, unite: 'kg', categorie: 'Fruits et légumes' },
        { id: 7, nom: 'Pommes de terre', quantite: 5, prixUnitaire: 1.80, tauxTVA: 6, unite: 'kg', categorie: 'Fruits et légumes' },
        { id: 8, nom: 'Confiture artisanale', quantite: 2, prixUnitaire: 5.90, tauxTVA: 6, unite: 'pot', categorie: 'Épicerie sucrée' }
      ]
    },
    {
      id: 3,
      numero: 'CMD-20251102-164523-921',
      membre: 'Claire Simon',
      email: 'claire.simon@email.com',
      date: '2025-11-02T16:45:23',
      dateRetrait: '2025-11-04',
      creneauRetrait: '18h-19h',
      pointCollecte: 'Centre-ville',
      statut: 'READY',
      montant: 67.20,
      produits: 8,
      articles: [
        { id: 1, nom: 'Tomates bio', quantite: 4, prixUnitaire: 3.50, tauxTVA: 6, unite: 'kg', categorie: 'Fruits et légumes' },
        { id: 2, nom: 'Pain complet', quantite: 6, prixUnitaire: 2.80, tauxTVA: 6, unite: 'pce', categorie: 'Boulangerie' },
        { id: 9, nom: 'Yaourts fermiers', quantite: 8, prixUnitaire: 1.20, tauxTVA: 6, unite: 'pce', categorie: 'Produits laitiers' },
        { id: 3, nom: 'Fromage fermier', quantite: 2, prixUnitaire: 8.50, tauxTVA: 6, unite: 'kg', categorie: 'Produits laitiers' },
        { id: 10, nom: 'Jus de pomme', quantite: 3, prixUnitaire: 3.80, tauxTVA: 6, unite: 'L', categorie: 'Boissons' }
      ]
    },
    {
      id: 4,
      numero: 'CMD-20251102-112010-456',
      membre: 'Marc Laurent',
      email: 'marc.laurent@email.com',
      date: '2025-11-02T11:20:10',
      dateRetrait: '2025-11-04',
      creneauRetrait: '19h-20h',
      pointCollecte: 'Quartier Sud',
      statut: 'CANCELLED',
      montant: 28.90,
      produits: 4,
      articles: [
        { id: 4, nom: 'Miel local', quantite: 3, prixUnitaire: 6.90, tauxTVA: 6, unite: 'pot', categorie: 'Épicerie sucrée' },
        { id: 11, nom: 'Beurre fermier', quantite: 2, prixUnitaire: 3.50, tauxTVA: 6, unite: 'plaquette', categorie: 'Produits laitiers' }
      ]
    },
    {
      id: 5,
      numero: 'CMD-20251103-100533-193',
      membre: 'Jean Dubois',
      email: 'jean.dubois@email.com',
      date: '2025-11-03T10:05:33',
      dateRetrait: '2025-11-08',
      creneauRetrait: '10h-11h',
      pointCollecte: 'Centre-ville',
      statut: 'CONFIRMED',
      montant: 55.30,
      produits: 6,
      articles: [
        { id: 12, nom: 'Poulet fermier', quantite: 1, prixUnitaire: 18.90, tauxTVA: 6, unite: 'kg', categorie: 'Viandes' },
        { id: 6, nom: 'Carottes bio', quantite: 4, prixUnitaire: 2.50, tauxTVA: 6, unite: 'kg', categorie: 'Fruits et légumes' },
        { id: 7, nom: 'Pommes de terre', quantite: 6, prixUnitaire: 1.80, tauxTVA: 6, unite: 'kg', categorie: 'Fruits et légumes' },
        { id: 5, nom: 'Œufs bio', quantite: 2, prixUnitaire: 4.20, tauxTVA: 6, unite: 'boîte', categorie: 'Produits laitiers' }
      ]
    },
    {
      id: 6,
      numero: 'CMD-20251101-153000-847',
      membre: 'Anne Lefebvre',
      email: 'anne.lefebvre@email.com',
      date: '2025-11-01T15:30:00',
      dateRetrait: '2025-11-03',
      creneauRetrait: '17h-18h',
      pointCollecte: 'Marché Nord',
      statut: 'DISTRIBUTED',
      montant: 89.40,
      produits: 10,
      articles: [
        { id: 1, nom: 'Tomates bio', quantite: 5, prixUnitaire: 3.50, tauxTVA: 6, unite: 'kg', categorie: 'Fruits et légumes' },
        { id: 2, nom: 'Pain complet', quantite: 10, prixUnitaire: 2.80, tauxTVA: 6, unite: 'pce', categorie: 'Boulangerie' },
        { id: 3, nom: 'Fromage fermier', quantite: 3, prixUnitaire: 8.50, tauxTVA: 6, unite: 'kg', categorie: 'Produits laitiers' },
        { id: 8, nom: 'Confiture artisanale', quantite: 4, prixUnitaire: 5.90, tauxTVA: 6, unite: 'pot', categorie: 'Épicerie sucrée' },
        { id: 9, nom: 'Yaourts fermiers', quantite: 12, prixUnitaire: 1.20, tauxTVA: 6, unite: 'pce', categorie: 'Produits laitiers' }
      ],
      paiement: {
        modePaiement: 'carte',
        montantEncaisse: 89.40,
        dateEncaissement: '2025-11-03T17:35:00',
        operateur: 'Admin'
      }
    }
  ];

  // Sauvegarder dans localStorage
  localStorage.setItem('commandes', JSON.stringify(commandesTest));
  console.log('✅ Données de test initialisées !');
  console.log(`${commandesTest.length} commandes créées`);
  
  return commandesTest;
}

// Fonction à exécuter depuis la console pour effacer les données
export function effacerDonneesTest() {
  localStorage.removeItem('commandes');
  console.log('🗑️ Données de test effacées');
}

// Auto-initialisation si aucune donnée n'existe
const initData = () => {
  if (typeof window !== 'undefined' && !localStorage.getItem('commandes')) {
    console.log('🔄 Initialisation automatique des données de test...');
    initialiserDonneesTest();
  }
};

// Exécuter l'initialisation
initData();
