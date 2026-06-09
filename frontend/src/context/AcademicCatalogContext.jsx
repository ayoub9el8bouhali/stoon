import { createContext, useContext, useEffect, useMemo, useState } from "react";
import fallbackCatalog from "../data/academicCatalog.json";
import { api } from "../services/api.js";
import { normalizeApiCatalog } from "../utils/academicCatalog.js";

const AcademicCatalogContext = createContext(null);
const CACHE_KEY = "stoon_academic_catalog";
const CACHE_VERSION = 1;

const cachedCatalog = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    return cached?.version === CACHE_VERSION ? cached.catalog : fallbackCatalog;
  } catch {
    return fallbackCatalog;
  }
};

export function AcademicCatalogProvider({ children }) {
  const [catalog, setCatalog] = useState(cachedCatalog);
  const [source, setSource] = useState("local");

  useEffect(() => {
    let active = true;

    Promise.all([api.get("/cities"), api.get("/schools"), api.get("/programs")])
      .then(([citiesResponse, schoolsResponse, programsResponse]) => {
        if (!active) return;
        const nextCatalog = normalizeApiCatalog({
          cities: citiesResponse.data.data,
          schools: schoolsResponse.data.data,
          programs: programsResponse.data.data
        });
        localStorage.setItem(CACHE_KEY, JSON.stringify({ version: CACHE_VERSION, catalog: nextCatalog }));
        setCatalog(nextCatalog);
        setSource("api");
      })
      .catch(() => {
        setSource("local");
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({ catalog, source }), [catalog, source]);
  return <AcademicCatalogContext.Provider value={value}>{children}</AcademicCatalogContext.Provider>;
}

export const useAcademicCatalog = () => useContext(AcademicCatalogContext);
