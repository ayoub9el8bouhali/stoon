import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import { env } from "../config/env.js";
import "./generateAcademicCatalog.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readSqlFile = (fileName) => fs.readFile(path.join(__dirname, fileName), "utf8");

const run = async () => {
  const connection = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    multipleStatements: true
  });

  try {
    const schemaSql = await readSqlFile("academic_schema.sql");
    const seedSql = await readSqlFile("academic_seed.sql");

    await connection.query(schemaSql);
    await connection.query(seedSql);

    console.log("Catalogue académique ST00N généré et importé.");
  } finally {
    await connection.end();
  }
};

run().catch((error) => {
  console.error("Import académique échoué:", {
    code: error.code,
    errno: error.errno,
    message: error.message,
    sqlMessage: error.sqlMessage
  });
  process.exit(1);
});
