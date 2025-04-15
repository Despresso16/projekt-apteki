import React, { useState } from "react";
import "./Rejestracja.css";

const LogowanieUser = () => {
  const [formData, setFormData] = useState({ email: "", haslo: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logowanie dane:", formData);
  };

  return (
    <div className="registration-container">
      <h2>Witamy ponownie!</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Hasło:</label>
        <input type="password" name="haslo" value={formData.haslo} onChange={handleChange} required />

        <button type="submit">Zaloguj się</button>
      </form>
      <div className="login-prompt">
        <a href="" className="link">Nie pamiętam hasła</a>
        <button className="btn-secondary">
          Zarejestruj się
        </button>
      </div>
    </div>
  );
};

export default LogowanieUser;
