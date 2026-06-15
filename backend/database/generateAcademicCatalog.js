import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  buildAcademicCatalog,
  catalogToFrenchSchoolTypeRepairSql,
  catalogToFrenchSql,
  catalogToSql
} from "./academicCatalog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readSource = (name) => readFile(path.join(__dirname, "sources", name), "utf8");

const [establishmentsText, programsText] = await Promise.all([
  readSource("stoon_etablissements_ville_par_ville.txt"),
  readSource("stoon_filieres_liees_etablissements.txt")
]);

const catalog = buildAcademicCatalog({ establishmentsText, programsText });
const fallbackPath = path.join(__dirname, "..", "..", "frontend", "src", "data", "academicCatalog.json");
const frenchImportPath = path.join(__dirname, "..", "..", "..", "import_donnees_academiques_stoon_fr.sql");
const frenchSchoolTypeRepairPath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "reparation_type_etablissements_stoon_fr.sql"
);

await mkdir(path.dirname(fallbackPath), { recursive: true });
await Promise.all([
  writeFile(path.join(__dirname, "academic_seed.sql"), catalogToSql(catalog), "utf8"),
  writeFile(frenchImportPath, catalogToFrenchSql(catalog), "utf8"),
  writeFile(frenchSchoolTypeRepairPath, catalogToFrenchSchoolTypeRepairSql(catalog), "utf8"),
  writeFile(fallbackPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8")
]);

console.log(
  `Catalogue généré: ${catalog.regions.length} régions, ${catalog.cities.length} villes, ` +
    `${catalog.schools.length} établissements, ${catalog.programs.length} filières.`
);
