import React, { useState } from "react";
import "./Rejestracja.css"; // Stylizacja ciemnoszarego motywu

const LogowanieAdm = () => {
  const [formData, setFormData] = useState({
    email: "",
    numerAdministratora: "",
    haslo: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dane administratora:", formData);
  };

  return (
    <div className="registration-container">
      <h2>Logowanie Administratora</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Numer Administratora:</label>
        <input type="text" name="numerAdministratora" value={formData.numerAdministratora} onChange={handleChange} required />

        <label>Hasło:</label>
        <input type="password" name="haslo" value={formData.haslo} onChange={handleChange} required />

        <button type="submit">Zaloguj jako administrator</button>
      </form>
    </div>
  );
};

export default LogowanieAdm;