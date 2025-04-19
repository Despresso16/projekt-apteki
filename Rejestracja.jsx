import React, { useState } from "react";
import "./App.css";

const Rejestracja = () => {
  const [formData, setFormData] = useState({
    imie: "",
    nazwisko: "",
    email: "",
    haslo: "",
    powtorzHaslo: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.haslo !== formData.powtorzHaslo) {
      alert("Hasła nie są identyczne!");
      return;
    }
    console.log("Dane użytkownika:", formData);
  };

  return (
    <div className="container">
        <div className="registration-container">
        <h2>Witaj w naszej aptece!</h2>
        <form onSubmit={handleSubmit}>
          <label>Imię:</label>
          <input type="text" name="imie" value={formData.imie} onChange={handleChange} required />

          <label>Nazwisko:</label>
          <input type="text" name="nazwisko" value={formData.nazwisko} onChange={handleChange} required />

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Hasło:</label>
          <input type="password" name="haslo" value={formData.haslo} onChange={handleChange} required />

          <label>Powtórz hasło:</label>
          <input type="password" name="powtorzHaslo" value={formData.powtorzHaslo} onChange={handleChange} required />

          <button type="submit">Zarejestruj się</button>
        </form>
        <div className="login-prompt">
          <p>Masz już konto?</p>
          <button className="btn-secondary"E>Zaloguj się</button>
        </div>
      </div>
    </div>
  );
};

export default Rejestracja;

