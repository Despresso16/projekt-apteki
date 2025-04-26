import React, { useState, useEffect } from "react";
import "./Nawigacja.css";

const images = [
  "src/assets/lek1.jpg",
  "src/assets/lek2.jpg",
  "src/assets/lek3.jpg",
  "src/assets/lek4.jpg",
  "src/assets/lek5.jpg",
  "src/assets/lek6.jpg",
];

const Nawigacja = ({ userToken, navigateTo, onLogout }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isEmployee, setIsEmployee] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log("userToken: " + userToken);
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/v1/me', {
          headers: {
            'Authorization': userToken
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setIsEmployee(false)
          setIsAdmin(false)
          if(userData.email === "admin@zielonaApteka.pl"){
            setIsEmployee(true)
            setIsAdmin(true)
          }
          else if(userData.email == "pracownik1@zielonaApteka.pl") setIsEmployee(true);
        }
      } catch (error) {
        console.error("Błąd pobierania danych użytkownika:", error);
      }
    };
    
    if (userToken) {
      fetchUserData();
    }
  }, [userToken]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="napteka-container">
      <nav className="nnav-bar">
        <h1 className="nh1"> Zielona Apteka</h1>
        <ul>
          <li onClick={() => navigateTo("lista-lekow")}>Zamów leki</li>
          <li onClick={() => navigateTo("koszyk")}>Koszyk</li>
          <li onClick={() => navigateTo("historia")}>Historia zamówień</li>
          {isEmployee && (
            <li onClick={() => navigateTo("raporty")}>Raporty zamówień</li>
          )}
          {isAdmin && (
            <li onClick={() => navigateTo("admin")}>Panel administratora</li>
          )}
          <li onClick={() => navigateTo("konto")}>Konto</li>
          <li onClick={() => onLogout()}>Wyloguj się</li>
        </ul>
      </nav>

      <div className="nmain-container">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Lek ${index + 1}`}
          className={`nimg ${index === currentImage ? "active" : ""}`}
        />
        ))}
      </div>
      <footer className="nfooter">
      <p>© 2025 Apteka Online. Wszelkie prawa zastrzeżone.</p>
      </footer>
    </div>
  );
};

export default Nawigacja;
