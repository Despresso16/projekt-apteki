import { useState, useEffect } from "react";
import Logowanie from './Logowanie.jsx'
import Nawigacja from "./Nawigacja.jsx";
import Rejestracja from './Rejestracja.jsx'
import ListaLek from "./ListaLek.jsx";
import Koszyk from "./Koszyk.jsx";
import HistoriaZam from "./HistoriaZam.jsx";
import AdminPanel from "./AdminPanel.jsx";
import Konto from "./Konto.jsx";
import RaportZamowien from "./RaportZamowien.jsx";

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

  const [cart, setCart] = useState(() => {
    const cartFromStorage = localStorage.getItem('cart');
    if (cartFromStorage) {
      try {
        return JSON.parse(cartFromStorage);
      } catch (e) {
        console.error("Error parsing cart from localStorage:", e);
        return [];
      }
    }
    return [];
  });

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const addToCart = (drug, quantity) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.idDrug === drug.idDrug);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.idDrug === drug.idDrug 
            ? {...item, quantity: Math.min(item.quantity + quantity, drug.amount)}
            : item
        );
      } else {
        return [...prevCart, {...drug, quantity}];
      }
    });
  };
  
  const updateQuantity = (drugId, newQuantity) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.idDrug === drugId) {
          return { ...item, quantity: Math.min(Math.max(1, newQuantity), item.amount) };
        }
        return item;
      });
    });
  };
  
  const removeFromCart = (drugId) => {
    setCart(prevCart => prevCart.filter(item => item.idDrug !== drugId));
  };
  
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

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
      if (userToken == null) {
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
    setCart([]);
  };

  const handleUserLogout = () => {
    localStorage.removeItem('userToken');
    setCart([]);
    localStorage.removeItem('cart');
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
        return <ListaLek userToken={userToken} navigateTo={navigateTo} onLogout={handleUserLogout} addToCart={addToCart}/>;
      case "koszyk":
        return <Koszyk userToken={userToken} navigateTo={navigateTo} onLogout={handleUserLogout} cart={cart} totalPrice={totalPrice} updateQuantity={updateQuantity} removeFromCart={removeFromCart} clearCart={clearCart}/>;
      case "historia":
        return <HistoriaZam userToken={userToken} navigateTo={navigateTo} onLogout={handleUserLogout} />;
      case "admin":
        return <AdminPanel userToken={userToken} navigateTo={navigateTo} onLogout={handleUserLogout} />;
      case "raporty":
        console.log("Nie ma jeszcze stronki od raportów, TODO");
        return
      case "konto":
        return <Konto userToken={userToken} navigateTo={navigateTo} onLogout={handleUserLogout} />;
      default:
        return <Rejestracja onRegister={handleUserLogin} navigateTo={navigateTo} />;
    }
  };

  return (
    <>
      <Nawigacja/>
    </>
  )
}

export default App;