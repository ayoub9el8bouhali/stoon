import test from "node:test";
import assert from "node:assert/strict";

const baseUrl = "http://localhost:5001/api";

test("retourne les publications de l'utilisateur connecté", async () => {
  const login = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "yassine@stoon.ma", password: "Stoon2026!" })
  }).then(response => response.json());

  const response = await fetch(`${baseUrl}/users/me/publications`, {
    headers: { Authorization: `Bearer ${login.token}` }
  });
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(result.data));
  assert.ok(result.data.every(item => item.ownerId === login.user.id));
  assert.ok(result.data.every(item => ["housing", "ride", "job", "document"].includes(item.resourceType)));
});
