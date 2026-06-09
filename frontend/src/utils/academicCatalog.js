export const OTHER_SCHOOL_VALUE = "__other_school__";
export const OTHER_SCHOOL_LABEL = "Autre école";

export const getRegionForCity = (catalog, cityName) =>
  catalog.cities.find(({ name, aliases = [] }) => name === cityName || aliases.includes(cityName))?.region || "";

export const cascadeAcademicSelection = (current, key, value) => {
  const next = { ...current, [key]: value };

  if (key === "region") {
    next.city = "";
    next.school = "";
    next.fieldOfStudy = "";
  } else if (key === "city") {
    next.school = "";
    next.fieldOfStudy = "";
  } else if (key === "school") {
    next.fieldOfStudy = "";
  }

  return next;
};

export const getAcademicOptions = (catalog, selection = {}) => {
  const inferredRegion = selection.region || getRegionForCity(catalog, selection.city);
  const city = catalog.cities.find(({ name }) => name === selection.city);
  const legacyCity = Boolean(selection.city && !city);

  if (legacyCity) {
    return {
      legacy: true,
      region: "__legacy__",
      city: null,
      school: null,
      cities: [{ id: "__legacy_city__", name: selection.city, aliases: [], region: "__legacy__" }],
      schools: selection.school
        ? [{ id: "__legacy_school__", name: selection.school, cityId: "__legacy_city__" }]
        : [],
      programs: selection.fieldOfStudy
        ? [{ id: "__legacy_program__", name: selection.fieldOfStudy, schoolId: "__legacy_school__" }]
        : []
    };
  }

  const schools = city ? catalog.schools.filter(({ cityId }) => cityId === city.id) : [];
  let school = schools.find(({ name }) => name === selection.school);
  const legacySchool = Boolean(selection.school && selection.school !== OTHER_SCHOOL_VALUE && !school);

  if (legacySchool) {
    school = { id: "__legacy_school__", name: selection.school, cityId: city.id };
    schools.push(school);
  }

  if (city) {
    schools.push({ id: OTHER_SCHOOL_VALUE, name: OTHER_SCHOOL_VALUE, cityId: city.id });
  }

  const programs = school ? catalog.programs.filter(({ schoolId }) => schoolId === school.id) : [];
  const legacyProgram = Boolean(
    selection.fieldOfStudy && !programs.some(({ name }) => name === selection.fieldOfStudy)
  );

  if (legacyProgram) {
    programs.push({ id: "__legacy_program__", name: selection.fieldOfStudy, schoolId: school.id });
  }

  return {
    legacy: legacySchool || legacyProgram,
    region: inferredRegion,
    city,
    school,
    cities: inferredRegion ? catalog.cities.filter(({ region }) => region === inferredRegion) : [],
    schools,
    programs
  };
};

export const isOtherSchool = (catalog, cityName, schoolName) => {
  if (!schoolName || schoolName === OTHER_SCHOOL_VALUE) return false;
  const city = catalog.cities.find(({ name, aliases = [] }) => name === cityName || aliases.includes(cityName));
  if (!city) return true;
  return !catalog.schools.some(({ cityId, name }) => cityId === city.id && name === schoolName);
};

export const normalizeApiCatalog = ({ cities, schools, programs }) => ({
  regions: [...new Set(cities.map(({ region }) => region).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr")),
  cities: cities.map(({ id, nom, region, aliases }) => ({
    id,
    name: nom,
    region,
    aliases: Array.isArray(aliases) ? aliases : JSON.parse(aliases || "[]")
  })),
  schools: schools.map(({ id, nom, ville_id, statut, description, site_web }) => ({
    id,
    name: nom,
    cityId: ville_id,
    status: statut,
    description,
    siteWeb: site_web
  })),
  programs: programs.map(({ id, nom, niveau, ecole_id }) => ({
    id,
    name: nom,
    level: niveau,
    schoolId: ecole_id
  }))
});
