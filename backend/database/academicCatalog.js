const REGION_NAMES = {
  "CASABLANCA-SETTAT": "Casablanca-Settat",
  "RABAT-SALE-KENITRA": "Rabat-Salé-Kénitra",
  "FES-MEKNES": "Fès-Meknès",
  "MARRAKECH-SAFI": "Marrakech-Safi",
  "TANGER-TETOUAN-AL HOCEIMA": "Tanger-Tétouan-Al Hoceïma",
  "SOUSS-MASSA": "Souss-Massa",
  ORIENTAL: "Oriental",
  "BENI MELLAL-KHENIFRA": "Béni Mellal-Khénifra",
  "DRAA-TAFILALET": "Drâa-Tafilalet",
  "GUELMIM-OUED NOUN": "Guelmim-Oued Noun",
  "LAAYOUNE-SAKIA EL HAMRA": "Laâyoune-Sakia El Hamra",
  "DAKHLA-OUED EDDAHAB": "Dakhla-Oued Ed-Dahab"
};

const EXTRA_CITY_REGIONS = {
  "BEN GUERIR / BENGUERIR": "Marrakech-Safi",
  "FQUIH BEN SALAH": "Béni Mellal-Khénifra",
  TIZNIT: "Souss-Massa"
};

const CITY_NAMES = {
  "BEN GUERIR / BENGUERIR": { name: "Ben Guerir", aliases: ["Benguerir"] },
  "KELAA DES SRAGHNA / KALAA SERAGHNA": { name: "Kelaa des Sraghna", aliases: ["Kalaa Seraghna"] },
  "NOUACEUR / BOUSKOURA": { name: "Nouaceur", aliases: ["Bouskoura"] }
};

const titleCase = (value) =>
  value
    .toLocaleLowerCase("fr")
    .replace(/(^|[\s'-])\p{L}/gu, (letter) => letter.toLocaleUpperCase("fr"));

const canonicalCity = (heading) => CITY_NAMES[heading] || { name: titleCase(heading), aliases: [] };

const normalizeStatus = (status) => status.replace(/^\[|\]$/g, "").trim().toLocaleLowerCase("fr");

const isSeparator = (line, character) => line.length >= 20 && [...line].every((item) => item === character);

const isExcludedSchool = (name) => !name || name === "ETABLISSEMENT" || /^Aucun\b/i.test(name);

const isExcludedProgram = (name) =>
  !name ||
  name === "..." ||
  /^À vérifier\b/i.test(name) ||
  /^Université mère\b/i.test(name);

const sqlString = (value) => (value === null ? "NULL" : `'${String(value).replaceAll("'", "''")}'`);

export const buildAcademicCatalog = ({ establishmentsText, programsText }) => {
  if (!establishmentsText?.trim() || !programsText?.trim()) {
    throw new Error("Les deux sources académiques sont obligatoires.");
  }

  const sourceSchoolNames = new Set(
    establishmentsText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => line.slice(2).trim())
      .filter((name) => !isExcludedSchool(name))
  );

  const lines = programsText.split(/\r?\n/).map((line) => line.trim());
  const cities = [];
  const schools = [];
  const programs = [];
  let region = null;
  let city = null;
  let status = null;
  let school = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const next = lines[index + 1] || "";

    if (isSeparator(next, "=") && REGION_NAMES[line]) {
      region = REGION_NAMES[line];
      city = null;
      continue;
    }

    if (isSeparator(next, "-")) {
      const normalized = canonicalCity(line);
      city = {
        id: cities.length + 1,
        name: normalized.name,
        aliases: normalized.aliases,
        region: EXTRA_CITY_REGIONS[line] || region
      };
      cities.push(city);
      continue;
    }

    if (/^\[.+\]$/.test(line) && line !== "[STATUT]") {
      status = normalizeStatus(line);
      continue;
    }

    if (line.startsWith("- ")) {
      const name = line.slice(2).trim();
      if (isExcludedSchool(name) || !city) {
        school = null;
        continue;
      }

      school = {
        id: schools.length + 1,
        name,
        cityId: city.id,
        status: status || "non précisé",
        description: null,
        siteWeb: null,
        verifiedInEstablishmentsSource: sourceSchoolNames.has(name)
      };
      schools.push(school);
      continue;
    }

    if (line.startsWith("Filières:") && school) {
      const names = line
        .slice("Filières:".length)
        .split(";")
        .map((name) => name.trim())
        .filter((name) => !isExcludedProgram(name));

      [...new Set(names)].forEach((name) => {
        programs.push({
          id: programs.length + 1,
          name,
          level: null,
          schoolId: school.id
        });
      });
    }
  }

  const regions = [...new Set(cities.map((item) => item.region).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "fr")
  );

  return { regions, cities, schools, programs };
};

export const catalogToSql = ({ cities, schools, programs }) => {
  const cityValues = cities
    .map(({ id, name, region, aliases }) => `(${id}, ${sqlString(name)}, ${sqlString(region)}, ${sqlString(JSON.stringify(aliases))})`)
    .join(",\n");
  const schoolValues = schools
    .map(
      ({ id, name, cityId, status, description, siteWeb }) =>
        `(${id}, ${sqlString(name)}, ${sqlString(status)}, ${cityId}, ${sqlString(description)}, ${sqlString(siteWeb)})`
    )
    .join(",\n");
  const programValues = programs
    .map(({ id, name, level, schoolId }) => `(${id}, ${sqlString(name)}, ${sqlString(level)}, ${schoolId})`)
    .join(",\n");

  return `USE stoon_db;

SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM programs;
DELETE FROM schools;
DELETE FROM cities;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO cities (id, nom, region, aliases) VALUES
${cityValues};

INSERT INTO schools (id, nom, statut, ville_id, description, site_web) VALUES
${schoolValues};

INSERT INTO programs (id, nom, niveau, ecole_id) VALUES
${programValues};
`;
};
