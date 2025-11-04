import { createContext, useState, useContext, useEffect } from 'react';

const PanierContext = createContext();

export const usePanier = () => {
  const context = useContext(PanierContext);
  if (!context) {
    throw new Error('usePanier doit être utilisé dans un PanierProvider');
  }
  return context;
};

export const PanierProvider = ({ children }) => {
  const [panier, setPanier] = useState(() => {
    const saved = localStorage.getItem('panier');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('panier', JSON.stringify(panier));
  }, [panier]);

  const ajouterAuPanier = (produit, quantite = 1) => {
    setPanier(prev => {
      const existant = prev.find(item => item.id === produit.id);
      if (existant) {
        return prev.map(item =>
          item.id === produit.id
            ? { ...item, quantite: item.quantite + quantite }
            : item
        );
      }
      return [...prev, { ...produit, quantite }];
    });
  };

  const retirerDuPanier = (produitId) => {
    setPanier(prev => prev.filter(item => item.id !== produitId));
  };

  const modifierQuantite = (produitId, quantite) => {
    if (quantite <= 0) {
      retirerDuPanier(produitId);
      return;
    }
    setPanier(prev =>
      prev.map(item =>
        item.id === produitId ? { ...item, quantite } : item
      )
    );
  };

  const viderPanier = () => {
    setPanier([]);
  };

  const getTotalArticles = () => {
    return panier.reduce((total, item) => total + item.quantite, 0);
  };

  const getTotalPrix = () => {
    return panier.reduce((total, item) => total + (item.prix * item.quantite), 0);
  };

  const value = {
    panier,
    ajouterAuPanier,
    retirerDuPanier,
    modifierQuantite,
    viderPanier,
    getTotalArticles,
    getTotalPrix
  };

  return (
    <PanierContext.Provider value={value}>
      {children}
    </PanierContext.Provider>
  );
};