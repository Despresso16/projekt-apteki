import {db, router} from "../../index.js";
import validateAuth from "../../utils/validateAuth.js";
import {updateDrugSchema} from "../../utils/schemas.js";

router.patch("/api/v1/updateDrug", (req, res) => {
    const validSession = validateAuth(req);
    if (!validSession) return res.status(401).json({status: "error", data: "Invalid Authorization"});

    const accountTransaction = db.prepare(`SELECT permission FROM users WHERE token = ?;`).get(validSession);
    if (accountTransaction.permission !== 2) return res.status(401).json({
        status: "error",
        data: "Permission violation"
    });

    const data = req.body;
    const isValid = updateDrugSchema(data);
    if (!isValid) {
        return res.status(401).json({status: "error", data: updateDrugSchema.errors[0].message});
    }

    const drug = db.prepare(`SELECT * FROM drugs WHERE idDrug = ?;`).get(req.body.drugId);
    if (!drug) return res.status(401).json({status: "error", data: "Invalid drug identification"});

    db.prepare(`UPDATE drugs SET name = @name, dose = @dose, price = @price, companyName = @companyName, amount = @amount, type = @type WHERE idDrug = ?`)
        .run({
            name: req.body.name || drug.name,
            dose: req.body.dose || drug.dose,
            price: req.body.price || drug.price,
            companyName: req.body.companyName || drug.companyName,
            amount: req.body.amount || drug.amount,
            type: req.body.type || drug.type
        }, req.body.drugId);

    res.json({status: "success"});
});