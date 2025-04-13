// Define libraries
import express from "express";
import sqlite3 from "better-sqlite3";
import {existsSync, copyFileSync, globSync} from "node:fs";
import Ajv from "ajv";
import "dotenv/config";
import morgan from "morgan";
import chalk from "chalk";
import cors from "cors";

if (!existsSync("./database.sqlite")) {
    copyFileSync("./users_template.sqlite", "./database.sqlite");
}
// Define server router and SQLite database.
export const router = express();
router.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
router.options('*', cors());
export const ajv = new Ajv();
router.use(express.json());
router.use(morgan("dev"));
router.disable('x-powered-by');
export const db = sqlite3("./database.sqlite");

db.pragma('journal_mode = WAL');

if (process.env["DEV_CRITICAL"] === "true") {
    import("./developmentEndpoints.js");
    setTimeout(() => {
        console.log(chalk.bold(chalk.red(`[SERVER] [CRITICAL] DEVELOPMENT MODE IS ON. TURN OFF DEVELOPMENT IN YOUR .ENV FILE BEFORE PUSHING TO PRODUCTION.`)));
    }, 100);
}

// Import routes.
const routes = globSync("./routes/**/*.js");
for (const route of routes) {
    console.log(chalk.cyan(`[SERVER] Imported "${route}"`));
    import(`./${route}`);
}

router.listen(process.env.PORT);
console.log("Listening on ==> http://localhost:" + process.env.PORT);