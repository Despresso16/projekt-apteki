import {db, router} from "../../index.js";
import validateAuth from "../../utils/validateAuth.js";

router.post("/api/v1/orderHistory", (req, res) => {
    const validSession = validateAuth(req);
    if (!validSession) return res.status(401).json({status: "error", data: "Invalid Authorization"});

    try {
        const page = req.body.page || 0;
        const limit = req.body.limit || 15;

        const filter = req.body.filter || [];

        const filterSQL = filter.map(x => `${Object.keys(x)[0]} LIKE '%${x[Object.keys(x)[0]]}%'`).join(" AND ");

        const countTransaction = db.prepare(`SELECT COUNT(id) from purchase_history WHERE user = ? ${filter.length >= 1 ? `AND ${filterSQL}` : ""}`).get(validSession);

        const count = Math.floor(countTransaction[Object.keys(countTransaction)[0]] / limit);

        const list = db.prepare(`
        SELECT 
        ph.id, 
        ph.amount AS purchase_amount, 
        ph.date AS purchase_date,
        d.idDrug, 
        d.name AS drug_name, 
        d.dose, 
        d.price, 
        d.type, 
        d.companyName, 
        d.amount AS drug_amount,
        u.token AS user_token, 
        u.name AS user_name, 
        u.surname AS user_surname, 
        u.email AS user_email
        FROM purchase_history ph
        JOIN drugs d ON ph.purchased = d.idDrug
        JOIN users u ON ph.user = u.token
        WHERE ph.user = @user 
        ${filter.length >= 1 ? `AND ${filterSQL}` : ""}
        ORDER BY ${req.body.orderBy || "ph.id"} 
        ${req.body.descending === true ? "DESC" : "ASC"} 
        LIMIT @limit 
        OFFSET @page;
        `).all(
            {
                user: validSession,
                limit: limit,
                page: page * (limit || 15) || 0,
            },
        );

        res.json({
            status: "success",
            metadata: {
                currentPage: req.body.page || 0,
                pageCount: count,
                results: list.length,
            },
            data: list,
        });

    } catch (err) {
        res.json({status: "error", error: err.toString()});
    }
});