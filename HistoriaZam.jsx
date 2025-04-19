import React from 'react';
import "./HistoriaZam.css";

const HistoriaZam = () => {
    return (
        <div className="historia-zam">
            <h1>Historia zamówień</h1>
            <div className="przyciski">
                <button>Lista Leków</button>
                <button>Koszyk</button>
                <button>Wyloguj</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Numer zamówienia</th>
                        <th>Lista zamówionych leków</th>
                        <th>Data zamówienia</th>
                        <th>Łączna cena</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>#12345</td>
                        <td>Paracetamol, Ibuprofen</td>
                        <td>18/04/2025</td>
                        <td>50 zł</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default HistoriaZam;
