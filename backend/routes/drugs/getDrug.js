import {db, router} from "../../index.js";
import validateAuth from "../../utils/validateAuth.js";

router.get("/api/v1/getDrug", (req, res) => {
    const validSession = validateAuth(req);
    if (!validSession) return res.status(401).json({status: "error", data: "Invalid Authorization"});
    if (!req.query.drugId) return res.status(401).json({status: "error", data: "Missing drug identification"});
    const drug = db.prepare(`SELECT * FROM drugs WHERE idDrug = ?;`).get(req.query.drugId);
    if (!drug) return res.status(401).json({status: "error", data: "Invalid drug identification"});
    res.json({status: "success", data: drug});
});