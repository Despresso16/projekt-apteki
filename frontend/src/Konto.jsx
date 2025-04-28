import React, { useState, useEffect } from 'react';
import './Konto.css';

const Konto = ({userToken, navigateTo, onLogout}) => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    permission: ""
  });
  const [currentImage, setCurrentImage] = useState(0);
    const [isEmployee, setIsEmployee] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
  
    useEffect(() => {
      console.log("userToken: " + userToken);
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/v1/me', {
            headers: {
              'Authorization': userToken
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setIsEmployee(false)
            setIsAdmin(false)
            if(userData.email === "admin@zielonaApteka.pl"){
              setIsEmployee(true)
              setIsAdmin(true)
            }
            else if(userData.email == "pracownik1@zielonaApteka.pl") setIsEmployee(true);
          }
        } catch (error) {
          console.error("Błąd pobierania danych użytkownika:", error);
        }
      };
      
      if (userToken) {
        fetchUserData();
      }
    }, [userToken]);

   useEffect(() => {
      console.log("userToken: " + userToken);
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/v1/me', {
            headers: {
              'Authorization': userToken
            }
          });
          
          if (response.ok) {
            const user = await response.json();
            let perm = "";
            if(user.email === "admin@zielonaApteka.pl"){
              perm = "admin"
            }
            else if(user.email == "pracownik1@zielonaApteka.pl") perm = "Pracownik";
            else perm = "Użytkownik";
            setUserData({
              firstName: user.name,
              lastName: user.surname,
              email: user.email,
              permission: perm
            })
          }
        } catch (error) {
          console.error("Błąd pobierania danych użytkownika:", error);
        }
      };
      
      if (userToken) {
        fetchUserData();
      }
    }, [userToken]);

  return (
    <div className="konto">
      <h1 className="koh1">Twoje konto</h1>
      
      <div className="koprzyciski">
      <ul className='konav'>
          <li onClick={() => navigateTo("nawigacja")}>Główne menu</li>
          {!isEmployee && (
            <li onClick={() => navigateTo("lista-lekow")}>Zamów leki</li>
          )}
          {!isEmployee && (
            <li onClick={() => navigateTo("koszyk")}>Koszyk</li>
          )}
          {!isEmployee && (
            <li onClick={() => navigateTo("historia")}>Historia zamówień</li>
          )}
          {isEmployee && (
            <li onClick={() => navigateTo("raporty")}>Raporty zamówień</li>
          )}
          {isAdmin && (
            <li onClick={() => navigateTo("admin")}>Panel administratora</li>
          )}
          <li onClick={() => onLogout()}>Wyloguj się</li>
        </ul>
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
            <th className="koth">Poziom dostępu</th>
            <td className="kotd">{userData.permission}</td>
          </tr>
        </tbody>
      </table>
      
    </div>
  );
};

export default Konto;