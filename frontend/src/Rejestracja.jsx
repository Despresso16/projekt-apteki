import React, { useState } from "react";
import "./App.css";

const Rejestracja = ({ onRegister, navigateTo }) => {
  const [formData, setFormData] = useState({
    imie: "",
    nazwisko: "",
    email: "",
    haslo: "",
    powtorzHaslo: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    if (formData.haslo !== formData.powtorzHaslo) {
      setError("Hasła nie są identyczne!");
      setIsLoading(false);
      return;
    }
  
    if (formData.haslo.length < 8 || formData.haslo.length > 64) {
      setError("Hasło musi zawierać od 8 do 64 znaków");
      setIsLoading(false);
      return;
    }

    const requestData = {
      name: formData.imie,
      surname: formData.nazwisko,
      email: formData.email,
      password: formData.haslo
    };
    
    try {
      const response = await fetch('/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const data = await response.json();
      
      if (data.status === "success") {
        console.log("Rejestracja udana!");
        onRegister(data.data);
        navigateTo("nawigacja");
      } else {
        setError(data.data || "Wystąpił błąd podczas rejestracji!");
      }
    } catch (error) {
      setError("Wystąpił błąd podczas łączenia z serwerem");
      console.error("Błąd rejestracji:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="registration-container">
        <h2>Witaj w naszej aptece!</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Imię:</label>
          <input 
            type="text" 
            name="imie" 
            value={formData.imie} 
            onChange={handleChange} 
            required 
            maxLength="64"
          />

          <label>Nazwisko:</label>
          <input 
            type="text" 
            name="nazwisko" 
            value={formData.nazwisko} 
            onChange={handleChange} 
            required 
            maxLength="64" 
          />

          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            maxLength="64" 
          />

          <label>Hasło:</label>
          <input 
            type="password" 
            name="haslo" 
            value={formData.haslo} 
            onChange={handleChange} 
            required 
            minLength="8"
            maxLength="64" 
          />

          <label>Powtórz hasło:</label>
          <input 
            type="password" 
            name="powtorzHaslo" 
            value={formData.powtorzHaslo} 
            onChange={handleChange} 
            required 
            minLength="8" 
            maxLength="64" 
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Rejestracja..." : "Zarejestruj się"}
          </button>
        </form>
        <div className="login-prompt">
          <p>Masz już konto?</p>
          <button className="btn-secondary" onClick={() => navigateTo("logowanie")}>
            Zaloguj się
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rejestracja;