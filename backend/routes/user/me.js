import {db, router} from "../../index.js";
import validateAuth from "../../utils/validateAuth.js";

router.get("/api/v1/me", (req, res) => {
    const validSession = validateAuth(req);
    if (!validSession) return res.status(401).json({status: "error", data: "Invalid Authorization"});

    const accountTransaction = db.prepare(`SELECT name, surname, email FROM users WHERE token = ?;`).get(validSession);
    if (!accountTransaction) return res.status(401).json({status: "error", data: "Invalid Authorization"});
    res.json(accountTransaction);
});