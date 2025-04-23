import React from 'react';
import "./AdminPanel.css"

const AdminPanel = ({navigateTo}) => {
    return (
        <div className="admin-panel">
            <h1 className='aph1'>Zielona Apteka - panel administratora</h1>
            <div className="apprzyciski">
                <button onClick={() => navigateTo("lista-lekow")}>Lista Leków</button>
                <button>Dodaj lek</button>
                <button onClick={() => navigateTo("konto")}>Konto</button>
            </div>
            <h2>Lista leków</h2>
            <table className='aptab'>
                <thead className='apthead'>
                    <tr>
                        <th className='apth'>Nazwa</th>
                        <th className='apth'>Typ</th>
                        <th className='apth'>Cena</th>
                        <th className='apth'>Ilość w magazynie</th>
                        <th className='apth'>Akcja</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='aptd'>Ibuprofen</td>
                        <td className='aptd'>Przeciwbólowy</td>
                        <td className='aptd'>20 zł</td>
                        <td className='aptd'>150 szt.</td>
                        <td className='aptd'><button className="btn-edytuj">Edytuj</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
