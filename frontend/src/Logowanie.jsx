import React, { useState } from "react";
import "./App.css";

const Logowanie = ({ onLogin, navigateTo }) => {
  const [formData, setFormData] = useState({
    email: "",
    haslo: "" 
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

    const requestData = {
      email: formData.email,
      password: formData.haslo
    };

    try {
      const response = await fetch("/api/v1/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const data = await response.json();

      if (response.status === 403){
        setError("Błędny login lub hasło!")
        setIsLoading(false);
        console.error("Błąd logowania:", error);
        return;
      }
      if (data.status === "success") {
        console.log("Logowanie udane!");
        onLogin(data.data);
        navigateTo("nawigacja");
      } else {
        setError("Wystąpił błąd podczas logowania!");
      }
    } catch (error) {
      setError("Wystąpił błąd podczas łączenia z serwerem");
      console.error("Błąd logowania:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="registration-container">
        <h2>Witamy ponownie!</h2>
        <div className="error-message">{error}</div>
        <form onSubmit={handleSubmit}>
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

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>
        <div className="login-prompt">
          <button className="btn-secondary" onClick={() => navigateTo("rejestracja")}>
            Zarejestruj się
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logowanie;