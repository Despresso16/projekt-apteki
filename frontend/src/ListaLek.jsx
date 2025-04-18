import React, { useState } from "react";
import "./ListaLek.css";

const ListaLek = () => {

  const [leki] = useState([
    { id: 1, nazwa: "Paracetamol", typ: "Przeciwbólowe", cena: "12.99 zł" },
    { id: 2, nazwa: "Ibuprofen", typ: "Przeciwzapalne", cena: "15.49 zł" },
    { id: 3, nazwa: "Witamina C", typ: "Suplement", cena: "9.99 zł" },
    { id: 4, nazwa: "Witamina D", typ: "Suplement", cena: "9.99 zł" },
    { id: 5, nazwa: "Witamina E", typ: "Suplement", cena: "9.99 zł" },
    { id: 6, nazwa: "Witamina F", typ: "Suplement", cena: "9.99 zł" },
    { id: 7, nazwa: "Witamina G", typ: "Suplement", cena: "0.00 zł" }
  ]);

  return (
    <div className="container">
      <header className="nav-bar">
        <h1>Witamy w Zielonej Aptece</h1>
        <div className="nav-buttons">
          <button onClick={() => navigate("/koszyk")}>Koszyk</button>
          <button onClick={() => navigate("/historia")}>Historia zamówień</button>
          <button>Wyloguj</button>
        </div>
      </header>
      <section className="lista-lekow">
        <h2>Lista dostępnych leków</h2>
        <table>
          <thead>
            <tr>
              <th>Nazwa</th>
              <th>Typ</th>
              <th>Cena</th>
              <th>Akcja</th>
            </tr>
          </thead>
          <tbody>
            {leki.map((lek) => (
              <tr key={lek.id}>
                <td>{lek.nazwa}</td>
                <td>{lek.typ}</td>
                <td>{lek.cena}</td>
                <td>
                  <button className="btn-dodaj">Dodaj do koszyka</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {/*<footer>
        <p>© 2025 Zielona Apteka. Wszelkie prawa zastrzeżone.</p>
      </footer>*/}
    </div>
  );
};

export default ListaLek;
