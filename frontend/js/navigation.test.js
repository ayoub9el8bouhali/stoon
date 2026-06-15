import test from "node:test";
import assert from "node:assert/strict";
import { safeNextPath } from "./navigation.js";

test("conserve une destination interne après connexion", () => {
  assert.equal(safeNextPath("/pages/messages.html?participantId=2"), "/pages/messages.html?participantId=2");
});

test("refuse une redirection vers un autre site", () => {
  assert.equal(safeNextPath("https://example.com/attaque"), "/pages/dashboard.html");
  assert.equal(safeNextPath("//example.com/attaque"), "/pages/dashboard.html");
});
