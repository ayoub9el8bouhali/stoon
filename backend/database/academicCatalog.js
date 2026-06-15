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

export const catalogToFrenchSql = ({ cities, schools, programs }) => {
  const cityValues = cities.map(({ id, name }) => `(${id}, ${sqlString(name)})`).join(",\n");
  const schoolValues = schools
    .map(({ id, name, cityId, status }) => {
      const type = status === "public" ? "public" : "private";
      return `(${id}, ${sqlString(name)}, ${sqlString(type)}, ${cityId})`;
    })
    .join(",\n");
  const programValues = programs
    .map(({ id, name, level, schoolId }) => `(${id}, ${sqlString(name)}, ${sqlString(level)}, ${schoolId})`)
    .join(",\n");

  return `-- Importer ce fichier après avoir sélectionné la base STOON dans phpMyAdmin.
-- Le fichier ne sélectionne pas la base car InfinityFree impose son propre nom.

CREATE TABLE IF NOT EXISTS villes (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL UNIQUE,
  cree_le TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS etablissements (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  type ENUM('public','private') NOT NULL DEFAULT 'public',
  ville_id INT NULL,
  cree_le TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_etablissements_ville (ville_id),
  CONSTRAINT fk_etablissements_ville
    FOREIGN KEY (ville_id) REFERENCES villes(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET @stoon_add_school_type = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE etablissements ADD COLUMN type ENUM(''public'',''private'') NOT NULL DEFAULT ''public'' AFTER nom',
    'SELECT 1'
  )
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'etablissements'
    AND COLUMN_NAME = 'type'
);
PREPARE stoon_school_type_statement FROM @stoon_add_school_type;
EXECUTE stoon_school_type_statement;
DEALLOCATE PREPARE stoon_school_type_statement;

CREATE TABLE IF NOT EXISTS filieres (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  niveau VARCHAR(100) NULL,
  etablissement_id INT NULL,
  cree_le TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_filieres_etablissement (etablissement_id),
  CONSTRAINT fk_filieres_etablissement
    FOREIGN KEY (etablissement_id) REFERENCES etablissements(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM filieres;
DELETE FROM etablissements;
DELETE FROM villes;

INSERT INTO villes (id, nom) VALUES
${cityValues};

INSERT INTO etablissements (id, nom, type, ville_id) VALUES
${schoolValues};

INSERT INTO filieres (id, nom, niveau, etablissement_id) VALUES
${programValues};

SET FOREIGN_KEY_CHECKS = 1;
`;
};

export const catalogToFrenchSchoolTypeRepairSql = ({ schools }) => {
  const publicIds = schools.filter(({ status }) => status === "public").map(({ id }) => id).join(",");
  const privateIds = schools.filter(({ status }) => status !== "public").map(({ id }) => id).join(",");

  return `-- Correctif ciblé pour la cascade Ville -> Etablissement du thème WordPress STOON.
SET @stoon_add_school_type = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE etablissements ADD COLUMN type ENUM(''public'',''private'') NOT NULL DEFAULT ''private'' AFTER nom',
    'SELECT 1'
  )
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'etablissements'
    AND COLUMN_NAME = 'type'
);
PREPARE stoon_school_type_statement FROM @stoon_add_school_type;
EXECUTE stoon_school_type_statement;
DEALLOCATE PREPARE stoon_school_type_statement;

UPDATE etablissements SET type = 'public' WHERE id IN (${publicIds});
UPDATE etablissements SET type = 'private' WHERE id IN (${privateIds});
`;
};
