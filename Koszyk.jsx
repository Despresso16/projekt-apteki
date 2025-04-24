import React from 'react';
import "./Koszyk.css";

const Koszyk = ({navigateTo}) => {
    return (
        <div className="koszyk">
            <h1 className='kh1'>Historia zamówień</h1>
            <div className="kprzyciski">
                <button onClick={() => navigateTo("lista-lekow")}>Lista Leków</button>
                <button onClick={() => navigateTo("historia")}>Historia Zamówień</button>
                <button onClick={() => navigateTo("konto")}>Konto</button>
            </div>
            <h2 className='kh2'>Leki w koszyku:</h2>
            <table className='ktable'>
                <thead>
                    <tr>
                        <th className='kth'>Lek</th>
                        <th className='kth'>Ilość</th>
                        <th className='kth'>Cena</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='ktd'>Przykładowy Lek</td>
                        <td className='ktd'>1</td>
                        <td className='ktd'>10 zł</td>
                    </tr>
                </tbody>
            </table>
            <div className="kprzyciski-dol">
                <button>Zamów</button>
                <button>Pobierz potwierdzenie</button>
            </div>
        </div>
    );
};

export default Koszyk;