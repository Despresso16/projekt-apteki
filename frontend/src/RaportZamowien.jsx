import React, { useState, useEffect } from "react";
import "./HistoriaZam.css";

const RaportZamowien = ({ userToken, navigateTo, onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 

  const fetchOrderReports = async () => {
    if (!userToken) return;
    
    try {
      setLoading(true); 
      setError(null);
      
      const response = await fetch('/api/v1/orderReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken
        },
        body: JSON.stringify({
          page: currentPage,
          limit: 5,
          orderBy: 'purchase_date',
          descending: true
        })
      });

      if (!response.ok) {
        throw new Error(`Serwer zwrócił błąd ${response.status}`);
      }

      const data = await response.json();
      console.log("Otrzymane dane raportu:", data);
      
      if (data.status === 'success') {
        setOrders(data.data);
        setTotalPages(data.metadata.pageCount);
        console.log("Ustawiam totalPages na:", data.metadata.pageCount);
      } else {
        setError(data.data || 'Nie udało się pobrać raportu zamówień');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem: ' + err.message);
      console.error("Error fetching order reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderReports();
  }, [currentPage, userToken]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="historia-zam">
      <h1 className='hzh1'>Raport zamówień</h1>
      <div className="hzprzyciski">
        <ul className='hznav'>
          <li onClick={() => navigateTo("nawigacja")}>Główne menu</li>
          <li onClick={() => navigateTo("admin")}>Panel administratora</li>
          <li onClick={() => navigateTo("konto")}>Konto</li>
          <li onClick={() => onLogout()}>Wyloguj się</li>
        </ul>
      </div>
      
      {loading && <p>Ładowanie raportu zamówień...</p>}
      {error && <p className="error-message">Błąd: {error}</p>}
      
      <table className='hztable'>
        <thead>
          <tr>
            <th className='hzth'>ID zamówienia</th>
            <th className='hzth'>Data zamówienia</th>
            <th className='hzth'>Cena</th>
            <th className='hzth'>ID leku</th>
            <th className='hzth'>Nazwa leku</th>
            <th className='hzth'>Zakupiona ilość</th>
            <th className='hzth'>Dawka</th>
            <th className='hzth'>Typ</th>
            <th className='hzth'>Firma</th>
            <th className='hzth'>Email użytkownika</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{formatDate(order.purchase_date)}</td>
                <td>{(order.price * order.purchase_amount).toFixed(2)} zł</td>
                <td>{order.idDrug}</td>
                <td>{order.drug_name}</td>
                <td>{order.purchase_amount}</td>
                <td>{order.dose} mg</td>
                <td>{order.type}</td>
                <td>{order.companyName}</td>
                <td>{order.user_email}</td>
              </tr>
            ))
          ) : !loading && (
            <tr>
              <td colSpan="10">Brak zamówień do wyświetlenia</td>
            </tr>
          )}
        </tbody>
      </table>
      
      <div className="hzpagination">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0 || loading}
        >Poprzednia strona </button>
        <span>
          Strona {currentPage + 1} z {totalPages || 1}
        </span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
          disabled={currentPage >= totalPages - 1 || totalPages === 0 || loading}
        >Następna strona </button>
      </div>
    </div>
  );
};

export default RaportZamowien;