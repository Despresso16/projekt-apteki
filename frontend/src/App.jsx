import { useState, useEffect } from "react";
import Logowanie from './Logowanie.jsx'
import Nawigacja from "./Nawigacja.jsx";
import Rejestracja from './Rejestracja.jsx'
import ListaLek from "./ListaLek.jsx";
import Koszyk from "./Koszyk.jsx";
import HistoriaZam from "./HistoriaZam.jsx";
import AdminPanel from "./AdminPanel.jsx";
import ResHaslo from "./ResHaslo.jsx";

const App = () => {
  const getInitialPage = () => {
    const path = window.location.pathname.substring(1);
    if (path && ['rejestracja', 'logowanie', 'nawigacja', 'lista-lekow', 'koszyk', 'historia', 'admin', 'res-haslo'].includes(path)) {
      return path;
    }
    
    const savedPage = localStorage.getItem("currentPage");
    return savedPage || "rejestracja";
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [userToken, setUserToken] = useState(() => {
    return localStorage.getItem('userToken') || null;
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.substring(1);
      if (path && ['rejestracja', 'logowanie', 'nawigacja', 'lista-lekow', 'koszyk', 'historia', 'admin', 'res-haslo'].includes(path)) {
        setCurrentPage(path);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  useEffect(() => {
    const validateToken = async () => {
      if (!userToken) {
        if (['nawigacja', 'lista-lekow', 'koszyk', 'historia', 'admin'].includes(currentPage)) {
          navigateTo("logowanie");
        }
        return;
      }
      
      try {
        const response = await fetch('/api/v1/me', {
          headers: {
            'Authorization': userToken
          }
        });
        
        if (!response.ok) {
          localStorage.removeItem('userToken');
          setUserToken(null);
          
          if (['nawigacja', 'lista-lekow', 'koszyk', 'historia', 'admin'].includes(currentPage)) {
            navigateTo("logowanie");
          }
        }
      } catch (error) {
        console.error("Błąd weryfikacji tokenu:", error);
      }
    };
    
    validateToken();
  }, [userToken, currentPage]);

  const navigateTo = (page) => {
    setCurrentPage(page);
    const url = `/${page}`;
    window.history.pushState(null, '', url);
  };

  const handleUserLogin = (token) => {
    localStorage.setItem('userToken', token);
    setUserToken(token);
  };

  const handleUserLogout = () => {
    localStorage.removeItem('userToken');
    setUserToken(null);
    navigateTo("logowanie");
  };

  const renderPage = () => {
    switch(currentPage) {
      case "rejestracja":
        return <Rejestracja onRegister={handleUserLogin} navigateTo={navigateTo} />;
      case "logowanie":
        return <Logowanie onLogin={handleUserLogin} navigateTo={navigateTo} />;
      case "nawigacja":
        return <Nawigacja userToken={userToken} navigateTo={navigateTo} onLogout={handleUserLogout} />;
      case "lista-lekow":
        return <ListaLek userToken={userToken} navigateTo={navigateTo} />;
      case "koszyk":
        return <Koszyk userToken={userToken} navigateTo={navigateTo} />;
      case "historia":
        return <HistoriaZam userToken={userToken} navigateTo={navigateTo} />;
      case "admin":
        return <AdminPanel userToken={userToken} navigateTo={navigateTo} />;
      case "res-haslo":
        return <ResHaslo userToken={userToken} navigateTo={navigateTo} />
      default:
        return <Rejestracja onRegister={handleUserLogin} navigateTo={navigateTo} />;
    }
  };

  return (
    <>
      {renderPage()}
    </>
  )
}

export default App;