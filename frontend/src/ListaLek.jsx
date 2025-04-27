import React, { useState, useEffect } from "react";
import "./ListaLek.css";

const ListaLek = ({ userToken, navigateTo, onLogout }) => {
  const [leki, setLeki] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState([]);
  const [filterForm, setFilterForm] = useState({
    field: 'name',
    value: ''
  });
  const [showQuantityPopup, setShowQuantityPopup] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const fetchDrugs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/listDrugs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userToken
        },
        body: JSON.stringify({
          page: currentPage,
          limit: 10,
          filter: filters,
          orderBy: 'name',
          descending: false
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setLeki(data.data);
        setTotalPages(data.metadata.pageCount);
      } else {
        setError(data.data || 'Nie udało się pobrać leków');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrugs();
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
    setFilterForm({ field: 'name', value: '' });
  };

  const removeFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const resetFilters = () => {
    setFilters([]);
    setFilterForm({ field: 'name', value: '' });
  };
  const showAddToCartPopup = (drug) => {
    setSelectedDrug(drug);
    setQuantity(1); // Reset quantity to 1
    setShowQuantityPopup(true);
  };

  const hideAddToCartPopup = () => {
    setShowQuantityPopup(false);
    setSelectedDrug(null);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && selectedDrug && value <= selectedDrug.amount) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!selectedDrug) return;
    addToCart(selectedDrug, quantity);
    hideAddToCartPopup();
  };

  const addToCart = () => {
    if (!selectedDrug) return;
    const cartFromStorage = localStorage.getItem('cart');
    let cart = [];
    
    if (cartFromStorage) {
      cart = JSON.parse(cartFromStorage);
    }
    const existingItemIndex = cart.findIndex(item => item.idDrug === selectedDrug.idDrug);
    
    if (existingItemIndex >= 0) {
      const newQuantity = cart[existingItemIndex].quantity + quantity;
      if (newQuantity > selectedDrug.amount) {
        cart[existingItemIndex].quantity = selectedDrug.amount;
      } else {
        cart[existingItemIndex].quantity = newQuantity;
      }
    } else {
      cart.push({
        ...selectedDrug,
        quantity: quantity
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    hideAddToCartPopup();
  };
  

  return (
    <div className="llcontainer">
      <header className="llnav-bar">
        <h1 className="llh1">Witamy w Zielonej Aptece</h1>
        <div className="llnav-buttons">
          <button onClick={() => navigateTo("koszyk")}>Koszyk</button>
          <button onClick={() => navigateTo("historia")}>Historia zamówień</button>
          <button onClick={() => navigateTo("konto")}>Konto</button>
          <button onClick={onLogout}>Wyloguj</button>
        </div>
      </header>
      
      <div className="llprzyciski">
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
                <option value="name">Nazwa</option>
                <option value="type">Typ</option>
                <option value="companyName">Firma</option>
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
      
      {loading && <p>Ładowanie leków...</p>}
      {error && <p className="error-message">Błąd: {error}</p>}
      
      <section className="lista-lekow">
        <h2>Lista dostępnych leków</h2>
        <table className="lltable">
          <thead>
            <tr>
              <th className='llth'>ID</th>
              <th className='llth'>Nazwa</th>
              <th className='llth'>Typ</th>
              <th className='llth'>Firma</th>
              <th className='llth'>Cena</th>
              <th className='llth'>Dawka</th>
              <th className='llth'>Ilość w magazynie</th>
              <th className='llth'>Dodaj do koszyka</th>
            </tr>
          </thead>
          <tbody>
            {leki.length > 0 ? (
              leki.map(lek => (
                <tr key={lek.idDrug}>
                  <td>{lek.idDrug}</td>
                  <td>{lek.name}</td>
                  <td>{lek.type}</td>
                  <td>{lek.companyName}</td>
                  <td>{lek.price.toFixed(2)} zł</td>
                  <td>{lek.dose} mg</td>
                  <td>{lek.amount} szt.</td>
                  <td>
                    <button 
                      onClick={() => showAddToCartPopup(lek)}
                      disabled={lek.amount <= 0}
                    >
                      {lek.amount <= 0 ? 'Brak w magazynie' : 'Dodaj'}
                    </button>
                  </td>
                </tr>
              ))
            ) : !loading && (
              <tr>
                <td colSpan="8">Brak leków do wyświetlenia</td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="llprzyciski">
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
      </section>

      {showQuantityPopup && selectedDrug && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Dodaj do koszyka</h3>
            <p><strong>{selectedDrug.name}</strong>, {selectedDrug.dose} mg</p>
            <p>Cena: {selectedDrug.price.toFixed(2)} zł</p>
            <p>Dostępna ilość: {selectedDrug.amount} szt.</p>
            
            <div className="quantity-selector">
              <label htmlFor="quantity">Ilość:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="number" 
                  id="quantity" 
                  min="1" 
                  max={selectedDrug.amount}
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <button 
                  onClick={() => setQuantity(prev => Math.min(selectedDrug.amount, prev + 1))}
                  disabled={quantity >= selectedDrug.amount}
                >
                  +
                </button>
              </div>
            </div>
            
            <p><strong>Suma: {(selectedDrug.price * quantity).toFixed(2)} zł</strong></p>
            
            <div className="popup-buttons">
            <button onClick={handleAddToCart}>Dodaj do koszyka</button>
            <button onClick={hideAddToCartPopup}>Anuluj</button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaLek;
