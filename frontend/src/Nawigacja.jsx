import React from "react";
import "./App.css";

const Nawigacja = ({ userToken, navigateTo }) => {

  return (
    <div className="apteka-container">
      <nav className="nav-bar">
        <h1>Apteka</h1>
        <ul>
          <li onClick={() => navigateTo("lista-lekow")}>Zamów leki</li>
          <li onClick={() => navigateTo("historia")}>Konto</li>
        </ul>
      </nav>
      <div className="main-container">
        <img src="src\assets\apteka.png" alt="Leki w aptece" />
      </div>
      <footer>
        <p>© 2025 Apteka Online. Wszelkie prawa zastrzeżone.</p>
      </footer>
    </div>
  );
};
export default Nawigacja;
