import React, { useState, useEffect } from 'react';
import "./AdminPanel.css";

const AdminPanel = ({userToken, navigateTo, onLogout}) => {
    const [drugs, setDrugs] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [currentDrug, setCurrentDrug] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState([]);
    const [filterForm, setFilterForm] = useState({
        field: 'name',
        value: ''
    });
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
    
    const [drugForm, setDrugForm] = useState({
        name: '',
        dose: 0,
        price: 0,
        type: '',
        companyName: '',
        amount: 0
    });

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
                    limit: 5,
                    filter: filters,
                    orderBy: 'idDrug',
                    descending: false
                })
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                setDrugs(data.data);
                setTotalPages(data.metadata.pageCount);
            } else {
                setError(data.data || 'Failed to fetch drugs');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrugs();
    }, [currentPage, userToken, filters]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDrugForm(prevForm => ({
            ...prevForm,
            [name]: name === 'dose' || name === 'price' || name === 'amount' 
                ? parseFloat(value) 
                : value
        }));
    };

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

    const handleAddDrug = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/v1/addDrug', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userToken
                },
                body: JSON.stringify(drugForm)
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                setDrugForm({
                    name: '',
                    dose: 0,
                    price: 0,
                    type: '',
                    companyName: '',
                    amount: 0
                });
                setShowAddForm(false);
                fetchDrugs();
                console.log('Lek został dodany pomyślnie!');
            } else {
                console.log(`Błąd: ${data.data}`);
            }
        } catch (err) {
            console.log('Błąd połączenia z serwerem');
            console.error(err);
        }
    };

    const handleEditClick = (drug) => {
        setCurrentDrug(drug);
        setDrugForm({
            name: drug.name,
            dose: drug.dose,
            price: drug.price,
            type: drug.type,
            companyName: drug.companyName,
            amount: drug.amount
        });
        setShowEditForm(true);
        setShowAddForm(false);
    };

    const handleUpdateDrug = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/v1/updateDrug', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userToken
                },
                body: JSON.stringify({
                    drugId: currentDrug.idDrug,
                    ...drugForm
                })
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                setShowEditForm(false);
                setCurrentDrug(null);
                fetchDrugs();
                console.log('Lek został zaktualizowany!');
            } else {
                console.log(`Błąd: ${data.data}`);
            }
        } catch (err) {
            console.log('Błąd połączenia z serwerem');
            console.error(err);
        }
    };

    const handleDeleteClick = async (drugId) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten lek?')) {
            try {
                const response = await fetch('/api/v1/removeDrug', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': userToken
                    },
                    body: JSON.stringify({ drugId })
                });

                const data = await response.json();
                
                if (data.status === 'success') {
                    fetchDrugs();
                    console.log('Lek został usunięty!');
                } else {
                    console.log(`Błąd: ${data.data}`);
                }
            } catch (err) {
                console.log('Błąd połączenia z serwerem');
                console.error(err);
            }
        }
    };

    
    return (
        <div className="admin-panel">
            <h1 className='aph1'>Zielona Apteka - panel administratora</h1>
            
            <div className="apprzyciski">
                <button onClick={() => {
                    setShowFilters(!showFilters);
                    setShowAddForm(false);
                    setShowEditForm(false);
                }}>
                    {showFilters ? 'Ukryj filtry' : 'Filtruj'}
                </button>
                <button onClick={() => {
                    setShowAddForm(!showAddForm);
                    setShowEditForm(false);
                    setShowFilters(false);
                }}>
                    {showAddForm ? 'Anuluj dodawanie' : 'Dodaj lek'}
                </button>
                <button onClick={() => navigateTo('nawigacja')}>Menu główne</button>
                <button onClick={() => navigateTo('raporty')}>Raporty</button>
                <button onClick={() => navigateTo('konto')}>Konto</button>
                <button onClick={onLogout}>Wyloguj</button>
            </div>
            
            {showAddForm && (
                <div className="dodawanie">
                    <h3>Dodaj nowy lek</h3>
                    <form onSubmit={handleAddDrug}>
                        <div className="form-group">
                            <label htmlFor="name">Nazwa:</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                value={drugForm.name} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="dose">Dawka:</label>
                            <input 
                                type="number" 
                                id="dose" 
                                name="dose" 
                                step="0.1" 
                                value={drugForm.dose} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="price">Cena:</label>
                            <input 
                                type="number" 
                                id="price" 
                                name="price" 
                                step="0.01" 
                                value={drugForm.price} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="type">Typ:</label>
                            <input 
                                type="text" 
                                id="type" 
                                name="type" 
                                value={drugForm.type} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="companyName">Firma:</label>
                            <input 
                                type="text" 
                                id="companyName" 
                                name="companyName" 
                                value={drugForm.companyName} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="amount">Ilość w magazynie:</label>
                            <input 
                                type="number" 
                                id="amount" 
                                name="amount" 
                                value={drugForm.amount} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        
                        <button type="submit">Dodaj lek</button>
                        <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>
                            Anuluj
                        </button>
                    </form>
                </div>
            )}
            
            {showEditForm && currentDrug && (
                <div className="edytowanie">
                    <h3>Edytuj lek: {currentDrug.name}</h3>
                    <form onSubmit={handleUpdateDrug}>
                        <div className="form-group">
                            <label htmlFor="edit-name">Nazwa:</label>
                            <input 
                                type="text" 
                                id="edit-name" 
                                name="name" 
                                value={drugForm.name} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="edit-dose">Dawka:</label>
                            <input 
                                type="number" 
                                id="edit-dose" 
                                name="dose" 
                                step="0.1" 
                                value={drugForm.dose} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="edit-price">Cena:</label>
                            <input 
                                type="number" 
                                id="edit-price" 
                                name="price" 
                                step="0.01" 
                                value={drugForm.price} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="edit-type">Typ:</label>
                            <input 
                                type="text" 
                                id="edit-type" 
                                name="type" 
                                value={drugForm.type} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="edit-companyName">Firma:</label>
                            <input 
                                type="text" 
                                id="edit-companyName" 
                                name="companyName" 
                                value={drugForm.companyName} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="edit-amount">Ilość w magazynie:</label>
                            <input 
                                type="number" 
                                id="edit-amount" 
                                name="amount" 
                                value={drugForm.amount} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        
                        <button type="submit">Zapisz zmiany</button>
                        <button 
                            type="button" 
                            className="btn-secondary" 
                            onClick={() => {
                                setShowEditForm(false);
                                setCurrentDrug(null);
                            }}
                        >
                            Anuluj
                        </button>
                    </form>
                </div>
            )}
            
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
            
            {loading && <p>Ładowanie danych...</p>}
            {error && <p className="error-message">Błąd: {error}</p>}
            
            <h2>Lista leków</h2>
            <table className='aptab'>
                <thead className='apthead'>
                    <tr>
                        <th className='apth'>ID</th>
                        <th className='apth'>Nazwa</th>
                        <th className='apth'>Typ</th>
                        <th className='apth'>Firma</th>
                        <th className='apth'>Cena</th>
                        <th className='apth'>Dawka</th>
                        <th className='apth'>Ilość w magazynie</th>
                        <th className='apth'>Edytuj</th>
                        <th className='apth'>Usuń</th>
                    </tr>
                </thead>
                <tbody>
                    {drugs.length > 0 ? (
                        drugs.map(drug => (
                            <tr key={drug.idDrug}>
                                <td className="aptd">{drug.idDrug}</td>
                                <td className="aptd">{drug.name}</td>
                                <td className="aptd">{drug.type}</td>
                                <td className="aptd">{drug.companyName}</td>
                                <td className="aptd">{drug.price.toFixed(2)} zł</td>
                                <td className="aptd">{drug.dose} mg.</td>
                                <td className="aptd">{drug.amount} szt.</td>
                                <td className="aptd">
                                    <button className="btn-edytuj" onClick={() => handleEditClick(drug)}>Edytuj</button>
                                </td>
                                <td className="aptd">
                                    <button className="btn-edytuj btn-usun" onClick={() => handleDeleteClick(drug.idDrug)}>Usuń</button>
                                </td>
                            </tr>
                        ))
                    ) : !loading && (
                        <tr>
                            <td colSpan="9" className="aptd">Brak danych do wyświetlenia</td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            <div className="apprzyciski">
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

export default AdminPanel;