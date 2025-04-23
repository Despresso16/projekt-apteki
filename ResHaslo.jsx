import React, { useState } from "react";
import "./ResHaslo.css";

const ResHaslo = () => {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleReset = () => {
    if (!email) {
      alert("Proszę podać adres e-mail.");
      return;
    }

    // Tu można wysłać zapytanie do backendu

    // Pokazujemy modal
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEmail("");
  };

  return (
    <div className="reset-container">
      <h2>Resetowanie Hasła</h2>
      <input
        type="email"
        placeholder="Wpisz swój e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="reset-input"
      />
      <button onClick={handleReset} className="reset-button">
        Resetuj hasło
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Wysłano pomyślnie, sprawdź email!</p>
            <button onClick={closeModal} className="modal-close">
              Zamknij
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResHaslo;
