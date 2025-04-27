import React, { useState, useEffect } from "react";
import "./HistoriaZam.css";


const HistoriaZam = ({ userToken, navigateTo, onLogout }) => {

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

    return (
        <div className="historia-zam">
            <h1 className='hzh1'>Historia zamówień</h1>
            <div className="hzprzyciski">
            <ul className='hznav'>
          {!isEmployee && (
            <li onClick={() => navigateTo("lista-lekow")}>Zamów leki</li>
          )}
          {!isEmployee && (
            <li onClick={() => navigateTo("koszyk")}>Koszyk</li>
          )}
          {isEmployee && (
            <li onClick={() => navigateTo("raporty")}>Raporty zamówień</li>
          )}
          {isAdmin && (
            <li onClick={() => navigateTo("admin")}>Panel administratora</li>
          )}
          <li onClick={() => navigateTo("konto")}>Konto</li>
          <li onClick={() => onLogout()}>Wyloguj się</li>
        </ul>
            </div>
            <table className='hztable'>
                <thead>
                    <tr>
                        <th className='hzth'>Numer zamówienia</th>
                        <th className='hzth'>Lista zamówionych leków</th>
                        <th className='hzth'>Data zamówienia</th>
                        <th className='hzth'>Łączna cena</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='hztd'>#12345</td>
                        <td className='hztd'>Paracetamol, Ibuprofen</td>
                        <td className='hztd'>18/04/2025</td>
                        <td className='hztd'>50 zł</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default HistoriaZam;
