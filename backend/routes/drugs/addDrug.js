import {db, router} from "../../index.js";
import validateAuth from "../../utils/validateAuth.js";
import {drugSchema} from "../../utils/schemas.js";

router.post("/api/v1/addDrug", (req, res) => {
    const validSession = validateAuth(req);
    if (!validSession) return res.status(401).json({status: "error", data: "Invalid Authorization"});

    const accountTransaction = db.prepare(`SELECT permission FROM users WHERE token = ?;`).get(validSession);
    if (!accountTransaction) return res.status(401).json({status: "error", data: "Invalid Authorization"});
    if (accountTransaction.permission !== 2) return res.status(401).json({status: "error", data: "Permission violation"});

    const data = req.body;
    const isValid = drugSchema(data);
    if (!isValid) {
        return res.status(401).json({status: "error", data: drugSchema.errors[0].message});
    }
    const insert = db.prepare(`INSERT INTO drugs values (null, @name, @dose, @price, @type, @companyName, @amount)`)
        .run({name: data.name, dose: data.dose, price: data.price, type: data.type, companyName: data.companyName, amount: data.amount});
    const result = db.prepare(`SELECT * from drugs WHERE idDrug = ?;`).get(insert.lastInsertRowid);
    res.json({status: "success", data: result});
});