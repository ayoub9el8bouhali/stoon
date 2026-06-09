import { useEffect, useMemo, useState } from "react";
import { useAcademicCatalog } from "../../context/AcademicCatalogContext.jsx";
import {
  OTHER_SCHOOL_LABEL,
  OTHER_SCHOOL_VALUE,
  cascadeAcademicSelection,
  getAcademicOptions,
  getRegionForCity,
  isOtherSchool
} from "../../utils/academicCatalog.js";

const fieldConfig = [
  { key: "region", label: "Région", allLabel: "Toutes les régions" },
  { key: "city", label: "Ville", allLabel: "Toutes les villes" },
  { key: "school", label: "Établissement", allLabel: "Tous les établissements" },
  { key: "fieldOfStudy", label: "Filière", allLabel: "Toutes les filières" }
];

export function AcademicSelects({ value, onChange, layout = "form", allowAll = false, required = false }) {
  const { catalog } = useAcademicCatalog();
  const [region, setRegion] = useState(() => getRegionForCity(catalog, value.city));
  const [otherSchool, setOtherSchool] = useState(
    () => layout === "form" && isOtherSchool(catalog, value.city, value.school)
  );
  const selection = useMemo(
    () => ({ city: value.city, school: value.school, fieldOfStudy: value.fieldOfStudy, region }),
    [region, value.city, value.fieldOfStudy, value.school]
  );
  const options = useMemo(() => getAcademicOptions(catalog, selection), [catalog, selection]);

  useEffect(() => {
    const inferred = getRegionForCity(catalog, value.city);
    if (inferred && inferred !== region) setRegion(inferred);
    if (value.city && !inferred && region !== "__legacy__") setRegion("__legacy__");
  }, [catalog, region, value.city]);

  useEffect(() => {
    if (layout === "form" && value.school && isOtherSchool(catalog, value.city, value.school)) {
      setOtherSchool(true);
    }
  }, [catalog, layout, value.city, value.school]);

  const lists = {
    region:
      options.region === "__legacy__"
        ? [{ name: "__legacy__", label: "Valeur existante" }]
        : catalog.regions.map((name) => ({ name, label: name })),
    city: options.cities.map(({ name }) => ({ name, label: name })),
    school: options.schools.map(({ name }) => ({
      name,
      label: name === OTHER_SCHOOL_VALUE ? OTHER_SCHOOL_LABEL : name
    })),
    fieldOfStudy: options.programs.map(({ name }) => ({ name, label: name }))
  };

  const currentValues = {
    region: options.region || region,
    city: value.city || "",
    school: otherSchool ? OTHER_SCHOOL_VALUE : value.school || "",
    fieldOfStudy: otherSchool ? "" : value.fieldOfStudy || ""
  };

  const update = (key, nextValue) => {
    if (key === "school" && nextValue === OTHER_SCHOOL_VALUE) {
      if (layout === "form") {
        setOtherSchool(true);
        onChange({ city: value.city || "", school: "", fieldOfStudy: "" });
      } else {
        onChange({ city: value.city || "", school: OTHER_SCHOOL_VALUE, fieldOfStudy: "" });
      }
      return;
    }

    if (key === "region" || key === "city" || key === "school") setOtherSchool(false);
    const cascaded = cascadeAcademicSelection(currentValues, key, nextValue);
    if (key === "region") setRegion(nextValue);
    onChange({
      city: cascaded.city,
      school: cascaded.school,
      fieldOfStudy: cascaded.fieldOfStudy
    });
  };

  const disabled = {
    region: false,
    city: !currentValues.region,
    school: !currentValues.city,
    fieldOfStudy: !currentValues.school || currentValues.school === OTHER_SCHOOL_VALUE
  };

  const fields = fieldConfig.map(({ key, label, allLabel }) => {
    if (otherSchool && key === "fieldOfStudy" && layout === "form") {
      return (
        <div className="col-md-3" key={key}>
          <label className="form-label">Filière</label>
          <input
            className="form-control"
            value={value.fieldOfStudy || ""}
            onChange={(event) =>
              onChange({ city: value.city, school: value.school, fieldOfStudy: event.target.value })
            }
            placeholder="Saisir votre filière"
            required={required}
            aria-label="Filière libre"
          />
        </div>
      );
    }

    const select = (
      <select
        className={layout === "form" ? "form-select" : undefined}
        value={currentValues[key]}
        onChange={(event) => update(key, event.target.value)}
        disabled={disabled[key]}
        required={required && !allowAll}
        aria-label={label}
      >
        <option value="">{allowAll ? allLabel : `Choisir ${label.toLocaleLowerCase("fr")}`}</option>
        {lists[key].map((item) => (
          <option key={item.name} value={item.name}>
            {item.label}
          </option>
        ))}
      </select>
    );

    if (layout === "filter") return <span key={key}>{select}</span>;

    return (
      <div className="col-md-3" key={key}>
        <label className="form-label">{label}</label>
        {select}
      </div>
    );
  });

  if (otherSchool && layout === "form") {
    fields.splice(
      3,
      0,
      <div className="col-md-3" key="other-school-name">
        <label className="form-label">Nom de l’établissement</label>
        <input
          className="form-control"
          value={value.school || ""}
          onChange={(event) =>
            onChange({ city: value.city, school: event.target.value, fieldOfStudy: value.fieldOfStudy })
          }
          placeholder="Saisir votre établissement"
          required={required}
          aria-label="Nom de l’établissement"
        />
      </div>
    );
  }

  return fields;
}
