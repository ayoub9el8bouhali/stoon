import test, { after } from "node:test";
import assert from "node:assert/strict";
import { searchStoonData } from "./chatbotSearchService.js";
import { sequelize } from "../config/database.js";
import { pool } from "../config/db.js";

after(async () => {
  await sequelize.close();
  await pool.end();
});

test("recherche les logements actifs par ville", async () => {
  const result = await searchStoonData({ type: "housing", city: "Rabat", budget: 2000 });

  assert.equal(result.items.length, 1);
  assert.match(result.reply, /Chambre lumineuse/i);
});

test("recherche les covoiturages actifs par trajet", async () => {
  const result = await searchStoonData({
    type: "ride",
    departureCity: "Casablanca",
    destinationCity: "Rabat"
  });

  assert.equal(result.items.length, 1);
  assert.match(result.reply, /Casablanca.*Rabat/i);
});

test("recherche les écoles par ville", async () => {
  const result = await searchStoonData({ type: "school", city: "Agadir" });

  assert.ok(result.items.length > 0);
  assert.match(result.reply, /Agadir/i);
});
