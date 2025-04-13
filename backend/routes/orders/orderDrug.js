import {db, router} from "../../index.js";
import validateAuth from "../../utils/validateAuth.js";
import {orderSchema} from "../../utils/schemas.js";


router.post("/api/v1/orderDrug", (req, res) => {
    const validSession = validateAuth(req);
    if (!validSession) return res.status(401).json({status: "error", data: "Invalid Authorization"});

    const data = req.body;
    const isValid = orderSchema(data);
    if (!isValid) {
        return res.status(401).json({status: "error", data: orderSchema.errors[0].message});
    }

    const drug = db.prepare(`SELECT amount FROM drugs WHERE idDrug = ?;`).get(req.body.id);

    if (drug.amount < data.amount || data.amount === 0) {
        return res.status(401).json({status: "error", data: "Invalid Amount"});
    }

    db.prepare(`UPDATE drugs SET amount = ? WHERE idDrug = ?;`).run(drug.amount - data.amount, data.id);

    // Success

    const x = db.prepare(`INSERT INTO purchase_history values (null, @purchased, @user, @amount, @date);`)
        .run({purchased: data.id, user: validSession, amount: data.amount, date: new Date().toISOString()});

    console.log(x);

    res.json({status: "success"})
});