import test from "node:test";
import assert from "node:assert/strict";
import { presentListing } from "./listingPresentation.js";

test("présente un covoiturage avec prix par place et horaire", () => {
  const result = presentListing({
    departureCity: "Marrakech",
    destinationCity: "Casablanca",
    departureAt: "2026-05-18T07:30:00.000Z",
    pricePerSeat: "90.00",
    seatsAvailable: 3,
    school: "ENSA Marrakech"
  });

  assert.equal(result.title, "Marrakech → Casablanca");
  assert.equal(result.price, "90 MAD / place");
  assert.match(result.description, /3 places/);
});

test("présente une école avec son nom et sa ville", () => {
  const result = presentListing({
    nom: "ENSA Agadir",
    ville_nom: "Agadir",
    statut: "public"
  });

  assert.equal(result.title, "ENSA Agadir");
  assert.equal(result.city, "Agadir");
  assert.equal(result.price, "Établissement public");
});

test("présente un job avec salaire et entreprise", () => {
  const result = presentListing({
    title: "Stage développeur",
    company: "CasaTech",
    city: "Casablanca",
    salary: "2500 MAD/mois",
    opportunityType: "stage"
  });

  assert.equal(result.description, "CasaTech · Stage");
  assert.equal(result.price, "2500 MAD/mois");
});
