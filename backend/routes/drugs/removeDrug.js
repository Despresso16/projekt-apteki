import {db, router} from "../../index.js";
import validateAuth from "../../utils/validateAuth.js";


router.post("/api/v1/removeDrug", (req, res) => {
    const validSession = validateAuth(req);
    if (!validSession) return res.status(401).json({status: "error", data: "Invalid Authorization"});


    const accountTransaction = db.prepare(`SELECT permission FROM users WHERE token = ?;`).get(validSession);
    if (!accountTransaction) return res.status(401).json({status: "error", data: "Invalid Authorization"});
    if (accountTransaction.permission !== 2) return res.status(401).json({status: "error", data: "Permission violation"});

    const drug = db.prepare(`DELETE FROM drugs WHERE idDrug = ?;`).run(req.body.drugId);
    if (drug.changes === 0) return res.status(401).json({status: "error", data: "Invalid drug identification"});
    res.json({status: "success"});
});