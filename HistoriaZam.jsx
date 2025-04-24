import React from 'react';
import "./HistoriaZam.css";

const HistoriaZam = ({navigateTo}) => {
    return (
        <div className="historia-zam">
            <h1 className='hzh1'>Historia zamówień</h1>
            <div className="hzprzyciski">
                <button onClick={() => navigateTo("lista-lekow")}>Lista Leków</button>
                <button onClick={() => navigateTo("koszyk")}>Koszyk</button>
                <button onClick={() => navigateTo("konto")}>Konto</button>
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
