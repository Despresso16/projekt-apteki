import {db, router} from "./index.js";

const randomDrugNames = ["Fenistil", "Allegra", "Aleric", "Flonidan", "Otrivin", "Lirra Gem", "Hitaxa Fast", "Hitaxa Metmin", "Aleric Deslo", "Xylogel", "Sudafed"];
const randomCompanyNames = ["Motorola", "Sigma Lek", "NFZ oficjalne", "node developers", "firma 1", "firma 2", "Olkusz Leki Corporation"];

router.get("/api/v1/DEV_changePermission", (req, res) => {
    if (!req.query.userId) return res.status(405).json({status: "error", data: "Missing userId parameter."});

    const t1 = db.prepare(`UPDATE users SET permission = 2 WHERE token = ?`).run(req.query.userId);

    if (t1.changes === 0) return res.status(401).json({status: "error", data: "No changes were made"});

    res.status(200).json({status: "success"});
});

router.get("/api/v1/DEV_fillData", (req, res) => {

    const count = req.query.count || 20;

    const rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;

    for (var i = 0; i <= count; i++) {

        const name = randomDrugNames[Math.floor(Math.random() * randomDrugNames.length)];

        const company = randomCompanyNames[Math.floor(Math.random() * randomCompanyNames.length)];

        db.prepare(`INSERT INTO drugs values (null, @name, @dose, @price, @type, @companyName, @amount)`)
            .run({name: name, dose: rand(1, 4), price: rand(3, 25), type: `Opis, to jest wygenerowane przez DEV_FILLDATA, ${crypto.randomUUID()}`, companyName: company, amount: rand(1, 10)});
    }

    res.status(200).json({status: "success"});
});