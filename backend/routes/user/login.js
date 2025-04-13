import {db, router} from "../../index.js";
import {loginSchema} from "../../utils/schemas.js";
import {SetRateLimit} from "../../utils/rateLimit.js";
import generateSession from "../../utils/session.js";
import bcrypt from "bcrypt";

router.post("/api/v1/login", SetRateLimit({window: "2m", max: 3}), (req, res) => {
    const data = req.body;
    const isValid = loginSchema(data);
    if (!isValid) {
        return res.status(401).json({status: "error", data: loginSchema.errors[0].message});
    }
    const transaction = db.prepare("SELECT token, password FROM users WHERE email = ?;")
        .get(req.body.email);

    if (!transaction) return res.status(401).json({status: "error", data: "Invalid email or password."});

    const passwordCorrect = bcrypt.compareSync(req.body.password, transaction.password);

    if (!passwordCorrect) return res.status(401).json({status: "error", data: "Invalid email or password."});

    res.json({status: "success", data: generateSession(transaction.token, "1h")});
});