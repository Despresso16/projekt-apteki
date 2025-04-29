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
  const slogans = [
    "Naturalne wsparcie dla Twojego zdrowia",
    "Zielona moc roślin w każdej kapsułce",
    "Twoje zdrowie – nasza pasja",
    "Rośnij w zdrowie z nami",
    "Apteka, której możesz zaufać",
    "W zgodzie z naturą, w trosce o Ciebie",
    "Bezpieczne zakupy, zdrowe wybory",
    "Z miłości do natury i zdrowia",
    "Zielona Apteka – bliżej natury",
    "Od natury dla Ciebie – codziennie"
  ];
  
  const [currentSlogan, setCurrentSlogan] = useState(0);
  
  useEffect(() => {
    const sloganInterval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length);
    }, 4000);
    return () => clearInterval(sloganInterval);
  }, []);
  

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
      <div className="nwelcome-banner">
      <h2>{slogans[currentSlogan]}</h2>
      </div>


        <ul>
          {!isEmployee && (
            <li onClick={() => navigateTo("lista-lekow")}>Zamów leki</li>
          )}
          {!isEmployee && (
            <li onClick={() => navigateTo("koszyk")}>Koszyk</li>
          )}
          {!isEmployee && (
            <li onClick={() => navigateTo("historia")}>Historia zamówień</li>
          )}
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
