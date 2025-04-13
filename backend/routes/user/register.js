import {db, router} from "../../index.js";
import {registerSchema} from "../../utils/schemas.js";
import {SetRateLimit} from "../../utils/rateLimit.js";
import generateSession from "../../utils/session.js";
import bcrypt from "bcrypt";

router.post("/api/v1/register", SetRateLimit({window: "5m", max: 15}), (req, res) => {
    const data = req.body;
    const isValid = registerSchema(data);
    if (!isValid) {
        return res.status(401).json({status: "error", data: registerSchema.errors[0].message});
    }
    const existsTransaction = db.prepare("SELECT COUNT() from users WHERE email = ?;").get(req.body.email);
    if (existsTransaction && existsTransaction['COUNT()'] > 0) return res.status(401).json({status: "error", data: "Account already exists"});
    const userId = crypto.randomUUID();
    const hash = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
    db.prepare(`INSERT into users values (@token, @name, @surname, @password, @email, @permission, null)`)
         .run({token: userId, name: data.name, email: data.email, surname: data.surname, password: hash, permission: 0});
    res.status(200).json({status: "success", data: generateSession(userId, "3h")});
});