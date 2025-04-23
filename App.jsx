import { useState, useEffect } from "react";
import Logowanie from './Logowanie.jsx'
import Nawigacja from "./Nawigacja.jsx";
import Rejestracja from './Rejestracja.jsx'
import ListaLek from "./ListaLek.jsx";
import Koszyk from "./Koszyk.jsx";
import HistoriaZam from "./HistoriaZam.jsx";
import AdminPanel from "./AdminPanel.jsx";
import Konto from "./Konto.jsx";
import ResHaslo from "./ResHaslo.jsx";

const App = () => {
  const [currentPage, setCurrentPage] = useState("rejestracja");
  const [userToken, setUserToken] = useState(null);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const handleUserLogin = (token) => {
    setUserToken(token);
  };

  const renderPage = () => {
    switch(currentPage) {
      case "rejestracja":
        return <Rejestracja onRegister={handleUserLogin} navigateTo={navigateTo} />;
      case "logowanie":
        return <Logowanie onLogin={handleUserLogin} navigateTo={navigateTo} />;
      case "nawigacja":
        return <Nawigacja userToken={userToken} navigateTo={navigateTo} />;
      case "lista-lekow":
        return <ListaLek userToken={userToken} navigateTo={navigateTo} />;
      case "koszyk":
        return <Koszyk userToken={userToken} navigateTo={navigateTo} />;
      case "historia":
        return <HistoriaZam userToken={userToken} navigateTo={navigateTo} />;
      case "admin":
        return <AdminPanel userToken={userToken} navigateTo={navigateTo} />;
      case "konto":
        return <Konto userToken={userToken} navigateTo={navigateTo} />;
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