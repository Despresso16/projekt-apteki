import React, { useState } from "react";
import "./ListaLek.css";

const ListaLek = ({navigateTo}) => {
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
    <body className="llbod">
    <div className="llcontainer">
      <header className="llnav-bar">
        <h1 className="llh1">Witamy w Zielonej Aptece</h1>
        <div className="llnav-buttons">
          <button onClick={() => alert("Przejdź do koszyka")}>Koszyk</button>
          <button onClick={() => alert("Przejdź do historii")}>Historia zamówień</button>
          <button onClick={() => alert("Przejdź do konta")}>Konto</button>
        </div>
      </header>
      <section className="lista-lekow">
        <h2>Lista dostępnych leków</h2>
        <table className="lltable">
          <thead>
            <tr>
              <th className="llth">Nazwa</th>
              <th className="llth">Typ</th>
              <th className="llth">Cena</th>
              <th className="llth">Akcja</th>
            </tr>
          </thead>
          <tbody>
            {leki.map((lek) => (
              <tr key={lek.id}>
                <td className="lltd">{lek.nazwa}</td>
                <td className="lltd">{lek.typ}</td>
                <td className="lltd">{lek.cena}</td>
                <td className="lltd">
                  <button className="btn-dodaj">Dodaj do koszyka</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
    </body>
  );
};

export default ListaLek;
