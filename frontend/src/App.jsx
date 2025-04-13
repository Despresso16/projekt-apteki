import { useState, useEffect } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [drugs, setDrugs] = useState([]);

  const handleRegister = async () => {
    try {
      console.log("Wysyłam dane rejestracji:", { name, surname, email, password });
      
      const res = await fetch("/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          surname: surname,
          email: email,
          password: password
        })
      });
      
      console.log("Status odpowiedzi:", res.status);
      
      // Spróbuj odczytać treść odpowiedzi nawet w przypadku błędu
      const responseText = await res.text();
      console.log("Surowa odpowiedź:", responseText);
      
      // Spróbuj sparsować jako JSON
      let response;
      try {
        response = JSON.parse(responseText);
        console.log("Odpowiedź JSON:", response);
      } catch (e) {
        console.error("Nie udało się sparsować odpowiedzi jako JSON:", e);
      }
      
      if (res.ok) {
        localStorage.setItem("token", response.data);
        setLoggedIn(true);
        alert("Zarejestrowano i zalogowano");
        fetchDrugs();
      } else {
        alert(`Błąd rejestracji (${res.status}): ${response?.data || response?.error || "Nieznany błąd"}`);
      }
    } catch (err) {
      console.error("Szczegóły błędu:", err);
      alert("Błąd połączenia: " + err.message);
    }
  };

  const handleLogin = async () => {
    try {
      console.log("Wysyłam dane logowania:", { email, password });
      
      const res = await fetch("/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      
      console.log("Status odpowiedzi:", res.status);
      
      // Spróbuj odczytać treść odpowiedzi nawet w przypadku błędu
      const responseText = await res.text();
      console.log("Surowa odpowiedź:", responseText);
      
      // Spróbuj sparsować jako JSON
      let response;
      try {
        response = JSON.parse(responseText);
        console.log("Odpowiedź JSON:", response);
      } catch (e) {
        console.error("Nie udało się sparsować odpowiedzi jako JSON:", e);
      }
      
      if (res.ok) {
        localStorage.setItem("token", response.data);
        setLoggedIn(true);
        alert("Zalogowano");
        fetchDrugs();
      } else {
        alert(`Błąd logowania (${res.status}): ${response?.data || response?.error || "Nieznany błąd"}`);
      }
    } catch (err) {
      console.error("Szczegóły błędu:", err);
      alert("Błąd połączenia: " + err.message);
    }
  };

  const fetchDrugs = async () => {
    try {
      console.log("Pobieranie listy leków, token:", localStorage.getItem("token"));
      
      const res = await fetch("/api/v1/listDrugs", {
        method: "POST", // Zmiana z GET na POST
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        },
        body: JSON.stringify({
          page: 0,
          limit: 15,
          filter: [],
          orderBy: "idDrug",
          descending: false
        })
      });
      
      console.log("Status odpowiedzi listDrugs:", res.status);
      
      const responseText = await res.text();
      console.log("Surowa odpowiedź listDrugs:", responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Odpowiedź JSON listDrugs:", data);
      } catch (e) {
        console.error("Nie udało się sparsować odpowiedzi listDrugs jako JSON:", e);
        return;
      }
      
      if (data.status === "success") {
        setDrugs(data.data);
        console.log("Leki z bazy:", data.data);
      } else {
        console.error("Błąd listDrugs:", data.error || data.data);
      }
    } catch (err) {
      console.error("Błąd połączenia z backendem:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
      fetchDrugs();
    }
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Apteka – React + Backend</h1>

      {!loggedIn && (
        <div>
          <h2>Rejestracja</h2>
          <input
            placeholder="Imię"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <input
            placeholder="Nazwisko"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
          <br />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            placeholder="Hasło"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button onClick={handleRegister}>Zarejestruj</button>
          <br />
          <h2>LUB zaloguj się</h2>
          <button onClick={handleLogin}>Zaloguj</button>
        </div>
      )}

      {loggedIn && (
        <>
          <h2>Leki z bazy:</h2>
          <ul>
            {drugs.map((drug) => (
              <li key={drug.idDrug}>
                <strong>{drug.name}</strong> – {drug.dose} mg – {drug.price} zł
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;