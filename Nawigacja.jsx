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
          <li onClick={() => navigateTo("konto")}>Konto</li>
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
