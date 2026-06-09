import assert from "node:assert/strict";
import test from "node:test";
import fallbackCatalog from "../data/academicCatalog.json" with { type: "json" };
import {
  OTHER_SCHOOL_LABEL,
  OTHER_SCHOOL_VALUE,
  cascadeAcademicSelection,
  getAcademicOptions,
  isOtherSchool
} from "./academicCatalog.js";

test("returns strictly linked options", () => {
  const options = getAcademicOptions(fallbackCatalog, {
    region: "Casablanca-Settat",
    city: "Casablanca",
    school: "Ecole Nationale de Commerce et de Gestion - ENCG Casablanca"
  });

  assert.ok(options.cities.some(({ name }) => name === "Casablanca"));
  assert.ok(options.schools.every(({ cityId }) => options.city?.id === cityId));
  assert.ok(options.programs.every(({ schoolId }) => options.school?.id === schoolId));
  assert.ok(options.programs.some(({ name }) => name === "Marketing digital"));
});

test("resets descendants when an academic parent changes", () => {
  const current = {
    region: "Casablanca-Settat",
    city: "Casablanca",
    school: "EMSI Casablanca",
    fieldOfStudy: "Génie informatique"
  };

  assert.deepEqual(cascadeAcademicSelection(current, "city", "Rabat"), {
    region: "Casablanca-Settat",
    city: "Rabat",
    school: "",
    fieldOfStudy: ""
  });
  assert.deepEqual(cascadeAcademicSelection(current, "region", "Rabat-Salé-Kénitra"), {
    region: "Rabat-Salé-Kénitra",
    city: "",
    school: "",
    fieldOfStudy: ""
  });
});

test("preserves legacy text values outside the catalog", () => {
  const options = getAcademicOptions(fallbackCatalog, {
    city: "Ville historique",
    school: "École historique",
    fieldOfStudy: "Ancienne filière"
  });

  assert.equal(options.legacy, true);
  assert.equal(options.region, "__legacy__");
  assert.equal(options.cities[0].name, "Ville historique");
  assert.equal(options.schools[0].name, "École historique");
  assert.equal(options.programs[0].name, "Ancienne filière");
});

test("preserves a legacy school and field when the city still exists", () => {
  const options = getAcademicOptions(fallbackCatalog, {
    city: "Casablanca",
    school: "EMSI Casablanca",
    fieldOfStudy: "Informatique"
  });

  assert.equal(options.region, "Casablanca-Settat");
  assert.ok(options.schools.some(({ name }) => name === "EMSI Casablanca"));
  assert.ok(options.programs.some(({ name }) => name === "Informatique"));
});

test("places the other-school choice after catalog establishments", () => {
  const options = getAcademicOptions(fallbackCatalog, {
    region: "Casablanca-Settat",
    city: "Casablanca"
  });

  assert.equal(options.schools.at(-1).name, OTHER_SCHOOL_VALUE);
  assert.equal(OTHER_SCHOOL_LABEL, "Autre école");
});

test("detects establishments outside the catalog for filtering", () => {
  assert.equal(isOtherSchool(fallbackCatalog, "Casablanca", "EMSI Casablanca"), true);
  assert.equal(
    isOtherSchool(
      fallbackCatalog,
      "Casablanca",
      "Ecole Marocaine des Sciences de l'Ingenieur - EMSI Casablanca"
    ),
    false
  );
});
