import React, { useState, useEffect } from "react";
import "./HistoriaZam.css";

const HistoriaZam = ({ userToken, navigateTo, onLogout }) => {
  const [isEmployee, setIsEmployee] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState([]);
  const [filterForm, setFilterForm] = useState({
    field: 'drug_name',
    value: ''
  });

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
          setIsEmployee(false);
          setIsAdmin(false);
          if(userData.email === "admin@zielonaApteka.pl"){
            setIsEmployee(true);
            setIsAdmin(true);
          }
          else if(userData.email === "pracownik1@zielonaApteka.pl") setIsEmployee(true);
        }
      } catch (error) {
        console.error("Błąd pobierania danych użytkownika:", error);
      }
    };
    
    if (userToken) {
      fetchUserData();
    }
  }, [userToken]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/orderHistory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken
        },
        body: JSON.stringify({
          page: currentPage,
          limit: 20,
          filter: filters,
          orderBy: 'purchase_date',
          descending: true
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setOrders(data.data);
        setTotalPages(data.metadata.pageCount);
      } else {
        setError(data.data || 'Nie udało się pobrać historii zamówień');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, userToken, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addFilter = () => {
    if (filterForm.value.trim() === '') return;
    
    const newFilter = { [filterForm.field]: filterForm.value };
    setFilters([...filters, newFilter]);
    setFilterForm({ field: 'drug_name', value: '' });
  };

  const removeFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const resetFilters = () => {
    setFilters([]);
    setFilterForm({ field: 'drug_name', value: '' });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="historia-zam">
      <h1 className='hzh1'>Historia zamówień</h1>
      <div className="hzprzyciski">
        <ul className='hznav'>
          <li onClick={() => navigateTo("nawigacja")}>Główne menu</li>
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
      
      <div className="hzprzyciski">
        <button onClick={() => {
          setShowFilters(!showFilters);
        }}>
          {showFilters ? 'Ukryj filtry' : 'Filtruj'}
        </button>
      </div>
      
      {showFilters && (
        <div className="filtracja">
          <h3>Filtry</h3>
          <div className="active-filters">
            <h4>Aktywne filtry:</h4>
            {filters.length === 0 ? (
              <p>Brak aktywnych filtrów</p>
            ) : (
              <ul>
                {filters.map((filter, index) => {
                  const field = Object.keys(filter)[0];
                  const value = filter[field];
                  return (
                    <li key={index}>
                      {field}: {value}
                      <button onClick={() => removeFilter(index)}>Usuń</button>
                    </li>
                  );
                })}
              </ul>
            )}
            {filters.length > 0 && (
              <button onClick={resetFilters}>
                Resetuj wszystkie filtry
              </button>
            )}
          </div>
          
          <div className="add-filter">
            <h4>Dodaj filtr</h4>
            <div className="filter-form">
              <select 
                name="field" 
                value={filterForm.field}
                onChange={handleFilterChange}
              >
                <option value="drug_name">Nazwa leku</option>
                <option value="type">Typ</option>
                <option value="companyName">Firma</option>
                <option value="id">ID zamówienia</option>
              </select>
              <input 
                type="text" 
                name="value" 
                value={filterForm.value}
                onChange={handleFilterChange}
                placeholder="Wartość filtru"
              />
              <button onClick={addFilter}>Dodaj filtr</button>
            </div>
          </div>
        </div>
      )}
      
      {loading && <p>Ładowanie historii zamówień...</p>}
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
              </tr>
            ))
          ) : !loading && (
            <tr>
              <td colSpan="9">Brak zamówień do wyświetlenia</td>
            </tr>
          )}
        </tbody>
      </table>
      
      <div className="hzpagination">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0 || loading}
        >
          Poprzednia strona
        </button>
        <span>Strona {currentPage + 1} z {totalPages || 1}</span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
          disabled={currentPage >= totalPages - 1 || totalPages === 0 || loading}
        >
          Następna strona
        </button>
      </div>
    </div>
  );
};

export default HistoriaZam;