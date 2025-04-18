import React from 'react';
import "./Koszyk.css";

const Koszyk = () => {
    return (
        <div className="koszyk">
            <h1>Historia zamówień</h1>
            <div className="przyciski">
                <button>Lista Leków</button>
                <button>Historia Zamówień</button>
                <button>Wyloguj</button>
            </div>
            <h2>Leki w koszyku:</h2>
            <table>
                <thead>
                    <tr>
                        <th>Lek</th>
                        <th>Ilość</th>
                        <th>Cena</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Przykładowy Lek</td>
                        <td>1</td>
                        <td>10 zł</td>
                    </tr>
                </tbody>
            </table>
            <div className="przyciski-dol">
                <button>Zamów</button>
                <button>Pobierz potwierdzenie</button>
            </div>
        </div>
    );
};

export default Koszyk;