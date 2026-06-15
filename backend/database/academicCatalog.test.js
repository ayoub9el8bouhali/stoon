import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  buildAcademicCatalog,
  catalogToFrenchSchoolTypeRepairSql,
  catalogToFrenchSql,
  catalogToSql
} from "./academicCatalog.js";

const establishmentsText = await readFile(
  new URL("./sources/stoon_etablissements_ville_par_ville.txt", import.meta.url),
  "utf8"
);
const programsText = await readFile(
  new URL("./sources/stoon_filieres_liees_etablissements.txt", import.meta.url),
  "utf8"
);

const catalog = buildAcademicCatalog({ establishmentsText, programsText });

test("builds a cleaned, linked academic catalog", () => {
  assert.ok(catalog.regions.length >= 12);
  assert.ok(catalog.cities.length >= 40);
  assert.ok(catalog.schools.length >= 350);
  assert.ok(catalog.programs.length >= 3000);

  assert.equal(catalog.schools.some(({ name }) => name.startsWith("Aucun ")), false);
  assert.equal(catalog.programs.some(({ name }) => name.includes("À vérifier")), false);
  assert.equal(catalog.schools.every(({ cityId }) => catalog.cities.some(({ id }) => id === cityId)), true);
  assert.equal(catalog.programs.every(({ schoolId }) => catalog.schools.some(({ id }) => id === schoolId)), true);
});

test("normalizes aliases and exceptional regional groupings", () => {
  const benGuerir = catalog.cities.find(({ name }) => name === "Ben Guerir");
  const nouaceur = catalog.cities.find(({ name }) => name === "Nouaceur");
  const tiznit = catalog.cities.find(({ name }) => name === "Tiznit");

  assert.deepEqual(benGuerir.aliases, ["Benguerir"]);
  assert.deepEqual(nouaceur.aliases, ["Bouskoura"]);
  assert.equal(benGuerir.region, "Marrakech-Safi");
  assert.equal(tiznit.region, "Souss-Massa");
  assert.equal(catalog.regions.includes("Autres villes universitaires importantes"), false);
});

test("generates deterministic replacement SQL", () => {
  const first = catalogToSql(catalog);
  const second = catalogToSql(buildAcademicCatalog({ establishmentsText, programsText }));

  assert.equal(first, second);
  assert.match(first, /DELETE FROM programs;/);
  assert.match(first, /INSERT INTO cities/);
  assert.match(first, /INSERT INTO schools/);
  assert.match(first, /INSERT INTO programs/);
});

test("generates an import compatible with the French WordPress tables", () => {
  const sql = catalogToFrenchSql(catalog);

  assert.doesNotMatch(sql, /\bUSE\s+/);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS villes/);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS etablissements/);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS filieres/);
  assert.match(sql, /INFORMATION_SCHEMA\.COLUMNS/);
  assert.match(sql, /ALTER TABLE etablissements ADD COLUMN type ENUM/);
  assert.match(sql, /DELETE FROM filieres;/);
  assert.match(sql, /DELETE FROM etablissements;/);
  assert.match(sql, /DELETE FROM villes;/);
  assert.match(sql, /INSERT INTO villes \(id, nom\) VALUES/);
  assert.match(sql, /INSERT INTO etablissements \(id, nom, type, ville_id\) VALUES/);
  assert.match(sql, /INSERT INTO filieres \(id, nom, niveau, etablissement_id\) VALUES/);
  assert.doesNotMatch(sql, /INSERT INTO (cities|schools|programs)/);
});

test("generates a focused repair for the WordPress school type column", () => {
  const sql = catalogToFrenchSchoolTypeRepairSql(catalog);

  assert.match(sql, /INFORMATION_SCHEMA\.COLUMNS/);
  assert.match(sql, /ALTER TABLE etablissements ADD COLUMN type ENUM/);
  assert.match(sql, /UPDATE etablissements SET type = 'public' WHERE id IN/);
  assert.match(sql, /UPDATE etablissements SET type = 'private' WHERE id IN/);
  assert.doesNotMatch(sql, /DELETE FROM/);
});
