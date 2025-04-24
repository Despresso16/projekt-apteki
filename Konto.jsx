import React from 'react';
import './Konto.css';

const Account = (navigateTo) => {
  const userData = {
    firstName: "Jan",
    lastName: "Kowalski",
    email: "jan.kowalski@example.com",
    placeOfResidence: "Warszawa, ul. Marszałkowska 1"
  };

  return (
    <div className="konto">
      <h1 className="koh1">Twoje konto</h1>
      
      <div className="koprzyciski">
        <button onClick={() => navigateTo("lista-lekow")}>Lista Leków</button>
        <button onClick={() => navigateTo("historia")}>Historia Zamówień</button>
        <button onClick={() => navigateTo("koszyk")}>Koszyk</button>
        <button>Wyloguj</button>
      </div>
      
      <h2 className="koh2">Dane:</h2>
      <table className="ktable">
        <tbody>
          <tr>
            <th className="koth">Imię</th>
            <td className="kotd">{userData.firstName}</td>
          </tr>
          <tr>
            <th className="koth">Nazwisko</th>
            <td className="kotd">{userData.lastName}</td>
          </tr>
          <tr>
            <th className="koth">Email</th>
            <td className="kotd">{userData.email}</td>
          </tr>
          <tr>
            <th className="koth">Miejsce zamieszkania</th>
            <td className="kotd">{userData.placeOfResidence}</td>
          </tr>
        </tbody>
      </table>
      
      <div className="koprzyciski-dol">
        <button>Zmień dane</button>
        <button>Zmień hasło</button>
      </div>
    </div>
  );
};

export default Account;