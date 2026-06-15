import test from "node:test";
import assert from "node:assert/strict";

test("refuse de démarrer une conversation avec soi-même", async () => {
  const baseUrl = "http://localhost:5001/api";
  const login = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "yassine@stoon.ma", password: "Stoon2026!" })
  }).then(response => response.json());

  const response = await fetch(`${baseUrl}/messages/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${login.token}`
    },
    body: JSON.stringify({ participantId: login.user.id, body: "Test impossible" })
  });

  assert.equal(response.status, 422);
});
