import validateAuth from "../../utils/validateAuth.js";
import {router, db} from "../../index.js";

router.post("/api/v1/listDrugs", (req, res) => {
    // Logowanie dla celów debugowania
    console.log("Otrzymano żądanie listDrugs, body:", req.body);
    
    const validSession = validateAuth(req);
    console.log("Wynik walidacji sesji:", validSession);
    
    if (!validSession) return res.status(401).json({status: "error", data: "Invalid Authorization"});

    try {
        const page = req.body.page || 0;
        const limit = req.body.limit || 15;
        const filter = req.body.filter || [];
        
        console.log(`Pobieranie leków: strona=${page}, limit=${limit}, filtry=${JSON.stringify(filter)}`);

        // Poprawiona logika tworzenia warunku WHERE
        let filterSQL = "";
        if (filter.length > 0) {
            filterSQL = "WHERE " + filter.map(x => {
                const key = Object.keys(x)[0];
                const value = x[key];
                return `${key} LIKE '%${value}%'`;
            }).join(" AND ");
        }

        // Sprawdzanie całkowitej liczby pasujących leków
        const countQuery = `SELECT COUNT(idDrug) as total from drugs ${filterSQL}`;
        console.log("Zapytanie COUNT:", countQuery);
        
        const countTransaction = db.prepare(countQuery).get();
        console.log("Wynik COUNT:", countTransaction);
        
        const count = Math.ceil(countTransaction.total / limit);

        // Pobieranie leków z paginacją i sortowaniem
        const listQuery = `
            SELECT * FROM drugs 
            ${filterSQL} 
            ORDER BY ${req.body.orderBy || "idDrug"} ${req.body.descending === true ? "DESC" : "ASC"} 
            LIMIT @limit OFFSET @page
        `;
        console.log("Zapytanie SELECT:", listQuery);
        
        const list = db.prepare(listQuery).all({
            limit: limit,
            page: page * limit
        });
        
        console.log(`Znaleziono ${list.length} leków`);
        if (list.length > 0) {
            console.log("Przykładowe leki:", list.slice(0, 2));
        } else {
            console.log("Brak leków w bazie danych lub brak wyników dla zapytania");
        }

        // Zwracanie wyników
        res.json({
            status: "success",
            metadata: {
                currentPage: page,
                pageCount: count,
                results: list.length,
            },
            data: list,
        });

    } catch (err) {
        console.error("Błąd w listDrugs:", err);
        res.json({status: "error", error: err.toString()});
    }
});