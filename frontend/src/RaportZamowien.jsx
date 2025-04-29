import React, { useEffect, useState } from "react";
import "./RaportZamowien.css";

const RaportZamowien = ({ userToken, navigateTo }) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch("/api/v1/orderReport", {
          headers: {
            Authorization: userToken,
          },
        });

        const data = await response.json();

        if (data.status === "success") {
          setReportData(data.data);
        } else {
          setError(data.data || "Nie udało się pobrać raportu.");
        }
      } catch (err) {
        console.error(err);
        setError("Błąd połączenia z serwerem.");
      } finally {
        setLoading(false);
      }
    };

    if (userToken) fetchReport();
  }, [userToken]);

  return (
    <div className="rz-container">
      <h1 className="rz-title">Raport zamówień</h1>
      <div className="rz-nav-buttons">
      <button className="rz-button" onClick={() => navigateTo("nawigacja")}>
        Powrót do menu
      </button>
   </div>

      {loading && <p className="rz-message">Ładowanie danych...</p>}
      {error && <p className="rz-error">{error}</p>}

      {!loading && !error && (
        <table className="rz-table">
          <thead>
            <tr>
              <th className="rz-th">ID leku</th>
              <th className="rz-th">Nazwa</th>
              <th className="rz-th">Firma</th>
              <th className="rz-th">Typ</th>
              <th className="rz-th">Łączna ilość</th>
              <th className="rz-th">Przychód (zł)</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item) => (
              <tr key={item.idDrug}>
                <td className="rz-td">{item.idDrug}</td>
                <td className="rz-td">{item.drug_name}</td>
                <td className="rz-td">{item.companyName}</td>
                <td className="rz-td">{item.type}</td>
                <td className="rz-td">{item.total_amount}</td>
                <td className="rz-td">{item.total_revenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RaportZamowien;
