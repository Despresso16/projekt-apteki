import React, { useState } from "react";
import "./App.css";

const LogowanieUser = ({ onRegister, navigateTo }) => {
  const [formData, setFormData] = useState({
      email: "",
      haslo: "" 
    });
    const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container">
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
          <button className="btn-secondary" onClick={() => navigateTo("rejestracja")}>
            Zarejestruj się
          </button>
          <p className="link">Nie pamiętam hasła</p>
        </div>
      </div>
    </div>
  );
};

export default LogowanieUser;
