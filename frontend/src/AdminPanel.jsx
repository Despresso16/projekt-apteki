import React from 'react';
import "./AdminPanel.css"

const AdminPanel = () => {
    return (
        <div className="admin-panel">
            <h1>Zielona Apteka - panel administratora</h1>
            <div className="przyciski">
                <button>Lista Leków</button>
                <button>Dodaj lek</button>
                <button>Wyloguj</button>
            </div>
            <h2>Lista leków</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nazwa</th>
                        <th>Typ</th>
                        <th>Cena</th>
                        <th>Ilość w magazynie</th>
                        <th>Akcja</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Ibuprofen</td>
                        <td>Przeciwbólowy</td>
                        <td>20 zł</td>
                        <td>150 szt.</td>
                        <td><button className="btn-edytuj">Edytuj</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
