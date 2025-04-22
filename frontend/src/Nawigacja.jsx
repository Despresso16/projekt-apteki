import React from "react";
import "./App.css";

const Nawigacja = ({ userToken, navigateTo }) => {

  return (
    <div className="apteka-container">
      <nav className="nav-bar">
        <h1>Apteka</h1>
        <ul>
          <li onClick={() => navigateTo("/leki")}>Lista leków</li>
          <li onClick={() => navigateTo("/kontakt")}>Kontakt</li>
          <li onClick={() => navigateTo("/konto")}>Konto</li>
          <li onClick={() => navigateTo("/wyloguj")}>Wyloguj</li>
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
