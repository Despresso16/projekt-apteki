import React, { useState, useEffect } from 'react';
import "./Koszyk.css";

const Koszyk = ({
  userToken, 
  navigateTo, 
  onLogout, 
  cart, 
  totalPrice, 
  updateQuantity, 
  removeFromCart, 
  clearCart
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderInProgress, setOrderInProgress] = useState(false);

    useEffect(() => {
        if (orderSuccess) {
            const timer = setTimeout(() => {
                navigateTo("historia");
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [orderSuccess, navigateTo]);

    const placeOrder = async () => {
        if (cart.length === 0) {
            alert('Koszyk jest pusty!');
            return;
        }

        setLoading(true);
        setError(null);
        setOrderInProgress(true);

        try {
            let successCount = 0;
            let totalItems = cart.length;
            
            for (const item of cart) {
                const orderResponse = await fetch('/api/v1/orderDrug', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': userToken
                    },
                    body: JSON.stringify({
                        id: item.idDrug,
                        amount: item.quantity
                    })
                });

                const orderData = await orderResponse.json();
                
                if (orderData.status !== 'success') {
                    throw new Error(orderData.data || 'Błąd przy składaniu zamówienia');
                }
                
                successCount++;
                setOrderInProgress({ current: successCount, total: totalItems });
            }

            clearCart();
            setOrderSuccess(true);
            
        } catch (err) {
            setError(err.message || 'Wystąpił błąd podczas składania zamówienia');
            console.error(err);
        } finally {
            setLoading(false);
            setOrderInProgress(false);
        }
    };

    return (
        <div className="koszyk">
            <h1 className='kh1'>Twój koszyk</h1>
            <div className="kprzyciski">
                <button onClick={() => navigateTo("lista-lekow")}>Lista Leków</button>
                <button onClick={() => navigateTo("historia")}>Historia Zamówień</button>
                <button onClick={() => navigateTo("konto")}>Konto</button>
                <button onClick={onLogout}>Wyloguj</button>
            </div>
            
            {orderSuccess && (
                <div className="order-success">
                    <h2>Zamówienie zostało złożone pomyślnie!</h2>
                    <p>Za chwilę zostaniesz przekierowany do historii zamówień...</p>
                </div>
            )}
            
            {!orderSuccess && (
                <>
                    <h2 className='kh2'>Leki w koszyku:</h2>
                    {loading && (
                        <div className="loading-overlay">
                            <div className="loading-content">
                                <p>Przetwarzanie zamówienia...</p>
                                {typeof orderInProgress === 'object' && (
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{width: `${(orderInProgress.current / orderInProgress.total) * 100}%`}}
                                        ></div>
                                        <span>{orderInProgress.current} z {orderInProgress.total}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {error && <p className="error-message">Błąd: {error}</p>}
                    
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <p>Twój koszyk jest pusty. Przejdź do listy leków aby dodać produkty.</p>
                            <button onClick={() => navigateTo("lista-lekow")} className="empty-cart-button">
                                Przejdź do listy leków
                            </button>
                        </div>
                    ) : (
                        <>
                            <table className='ktable'>
                                <thead>
                                    <tr>
                                        <th className='kth'>ID</th>
                                        <th className='kth'>Nazwa</th>
                                        <th className='kth'>Typ</th>
                                        <th className='kth'>Firma</th>
                                        <th className='kth'>Cena</th>
                                        <th className='kth'>Dawka</th>
                                        <th className='kth'>Ilość</th>
                                        <th className='kth'>Suma</th>
                                        <th className='kth'>Edytuj zamówienie</th>
                                        <th className='kth'>Usuń z koszyka</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map(item => (
                                        <tr key={item.idDrug}>
                                            <td>{item.idDrug}</td>
                                            <td>{item.name}</td>
                                            <td>{item.type}</td>
                                            <td>{item.companyName}</td>
                                            <td>{item.price.toFixed(2)} zł</td>
                                            <td>{item.dose} mg</td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    min="1" 
                                                    max={item.amount} 
                                                    value={item.quantity} 
                                                    onChange={(e) => updateQuantity(item.idDrug, parseInt(e.target.value))}
                                                />
                                            </td>
                                            <td>{(item.price * item.quantity).toFixed(2)} zł</td>
                                            <td>
                                                <div className="quantity-buttons">
                                                    <button 
                                                        onClick={() => updateQuantity(item.idDrug, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <button 
                                                        onClick={() => updateQuantity(item.idDrug, item.quantity + 1)}
                                                        disabled={item.quantity >= item.amount}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <button 
                                                    onClick={() => removeFromCart(item.idDrug)}
                                                    className="remove-button"
                                                >
                                                    Usuń
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="7" style={{textAlign: 'right', fontWeight: 'bold'}}>
                                            Razem:
                                        </td>
                                        <td colSpan="3" style={{fontWeight: 'bold'}}>
                                            {totalPrice.toFixed(2)} zł
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                            
                            <div className="kprzyciski-dol">
                                <button 
                                    className="order-button"
                                    onClick={placeOrder} 
                                    disabled={loading || cart.length === 0}
                                >
                                    {loading ? 'Przetwarzanie...' : 'Zamów'}
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Koszyk;