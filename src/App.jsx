import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import { PanierProvider } from './contexts/PanierContext';
import './utils/testData'; // Initialise automatiquement les données de test

// Composants des différentes pages
import DemandeAdhesion from './components/DemandeAdhesion';
import CreationMotDePasse from './components/CreationMotDePasse';
import Connexion from './components/Connexion';
import ReinitialisationMotDePasse from './components/ReinitialisationMotDePasse';
import Accueil from './components/Accueil';

// Composants Admin
import AdminDashboard from './components/admin/AdminDashboard';
import GestionDemandesAdhesion from './components/admin/GestionDemandesAdhesion';
import GestionMembres from './components/admin/GestionMembres';
import GestionProduits from './components/admin/GestionProduits';
import GestionCategories from './components/admin/GestionCategories';
import GestionPointsCollecte from './components/admin/GestionPointsCollecte';
import GestionCommandes from './components/admin/GestionCommandes';
import GestionStocks from './components/admin/GestionStocks';
import GestionPromotions from './components/admin/GestionPromotions';
import ExportVentes from './components/admin/ExportVentes';
import ParametresEmails from './components/admin/ParametresEmails';
import TableauxPreparation from './components/admin/TableauxPreparation';

// Composants Membre
import MembreDashboard from './components/membre/MembreDashboard';
import Catalogue from './components/membre/Catalogue';
import FicheProduit from './components/membre/FicheProduit';
import Panier from './components/membre/Panier';
import Commande from './components/membre/Commande';
import MesCommandes from './components/membre/MesCommandes';
import MonProfil from './components/membre/MonProfil';

// Composants partagés
import Archives from './components/shared/Archives';

function Navigation({ isConnected, onLogout, user }) {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="brand-link">
          <h2>Inscription Demo</h2>
        </Link>
      </div>
      
      <div className="nav-links">
        {!isConnected ? (
          <>
            <Link 
              to="/demande-adhesion" 
              className={location.pathname === '/demande-adhesion' ? 'nav-link active' : 'nav-link'}
            >
              Demande d'adhésion
            </Link>
            <Link 
              to="/connexion" 
              className={location.pathname === '/connexion' ? 'nav-link active' : 'nav-link'}
            >
              Se connecter
            </Link>
          </>
        ) : (
          <>
            {user && user.role === 'admin' ? (
              <Link 
                to="/admin" 
                className={location.pathname.startsWith('/admin') ? 'nav-link active' : 'nav-link'}
              >
                📊 Administration
              </Link>
            ) : (
              <>
                <Link 
                  to="/catalogue" 
                  className={location.pathname.startsWith('/catalogue') || location.pathname.startsWith('/produit') ? 'nav-link active' : 'nav-link'}
                >
                  🛍️ Catalogue
                </Link>
                <Link 
                  to="/panier" 
                  className={location.pathname === '/panier' ? 'nav-link active' : 'nav-link'}
                >
                  🛒 Panier
                </Link>
                <Link 
                  to="/mes-commandes" 
                  className={location.pathname === '/mes-commandes' ? 'nav-link active' : 'nav-link'}
                >
                  📦 Mes commandes
                </Link>
                <Link 
                  to="/mes-archives" 
                  className={location.pathname === '/mes-archives' ? 'nav-link active' : 'nav-link'}
                >
                  📚 Archives
                </Link>
                <Link 
                  to="/mon-profil" 
                  className={location.pathname === '/mon-profil' ? 'nav-link active' : 'nav-link'}
                >
                  👤 Mon profil
                </Link>
              </>
            )}
            <span className="user-info">
              {user?.role === 'admin' ? '👨‍💼' : '👤'} {user?.email}
            </span>
            <button onClick={onLogout} className="logout-btn">
              Se déconnecter
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setIsConnected(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsConnected(false);
    setUser(null);
  };

  return (
    <PanierProvider>
      <Router>
        <div className="app">
          <Navigation isConnected={isConnected} onLogout={handleLogout} user={user} />
          
          <main className="main-content">
            <Routes>
              <Route 
                path="/" 
                element={<Accueil isConnected={isConnected} user={user} />} 
              />
              <Route 
                path="/demande-adhesion" 
                element={<DemandeAdhesion />} 
              />
              <Route 
                path="/creation-mot-de-passe/:token" 
                element={<CreationMotDePasse />} 
              />
              <Route 
                path="/connexion" 
                element={<Connexion onLogin={handleLogin} />} 
              />
              <Route 
                path="/reinitialisation-mot-de-passe" 
                element={<ReinitialisationMotDePasse />} 
              />
              
              {/* Routes Admin - Protégées */}
              <Route 
                path="/admin" 
                element={
                  isConnected && user?.role === 'admin' ? (
                    <AdminDashboard user={user} />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/admin/demandes-adhesion" 
                element={
                  isConnected && user?.role === 'admin' ? (
                    <GestionDemandesAdhesion />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/admin/membres" 
                element={
                  isConnected && user?.role === 'admin' ? (
                    <GestionMembres />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/admin/produits" 
                element={
                  isConnected && user?.role === 'admin' ? (
                    <GestionProduits />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/admin/categories" 
                element={
                  isConnected && user?.role === 'admin' ? (
                    <GestionCategories />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/admin/points-collecte" 
                element={
                  isConnected && user?.role === 'admin' ? (
                    <GestionPointsCollecte />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/admin/commandes" 
                element={
                  isConnected && user?.role === 'admin' ? (
                    <GestionCommandes />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/admin/stocks" 
                element={
                  isConnected && user?.role === 'admin' ? (
                    <GestionStocks />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/admin/promotions" 
                element={
                  isConnected && user?.role === 'admin' ? (
                    <GestionPromotions />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/admin/export-ventes" 
                element={
                  isConnected && user?.role === 'admin' ? (
                    <ExportVentes />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/admin/parametres-emails" 
                element={
                  isConnected && user?.role === 'admin' ? (
                    <ParametresEmails />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/admin/tableaux-preparation" 
                element={
                  isConnected && user?.role === 'admin' ? (
                    <TableauxPreparation />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/admin/archives" 
                element={
                  isConnected && user?.role === 'admin' ? (
                    <Archives role="admin" />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              
              {/* Routes Membre - Protégées */}
              <Route 
                path="/membre" 
                element={
                  isConnected && user?.role === 'membre' ? (
                    <MembreDashboard user={user} />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/catalogue" 
                element={
                  isConnected && user?.role === 'membre' ? (
                    <Catalogue />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/produit/:id" 
                element={
                  isConnected && user?.role === 'membre' ? (
                    <FicheProduit />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/panier" 
                element={
                  isConnected && user?.role === 'membre' ? (
                    <Panier />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/commande" 
                element={
                  isConnected && user?.role === 'membre' ? (
                    <Commande user={user} />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/mes-commandes" 
                element={
                  isConnected && user?.role === 'membre' ? (
                    <MesCommandes user={user} />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/mon-profil" 
                element={
                  isConnected && user?.role === 'membre' ? (
                    <MonProfil user={user} onUpdate={setUser} />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
              <Route 
                path="/mes-archives" 
                element={
                  isConnected && user?.role === 'membre' ? (
                    <Archives role="membre" />
                  ) : (
                    <Navigate to="/connexion" replace />
                  )
                } 
              />
            </Routes>
          </main>
          
          <footer className="footer">
            <p>&copy; 2025 Inscription Demo - Interface de démonstration</p>
          </footer>
        </div>
      </Router>
    </PanierProvider>
  );
}

export default App;
