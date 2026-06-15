import test from "node:test";
import assert from "node:assert/strict";

test("un profil utilisateur est consultable sans connexion", async () => {
  const response = await fetch("http://localhost:5001/api/users/2");
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.equal(result.data.id, 2);
  assert.equal(result.data.passwordHash, undefined);
  assert.equal(result.data.email, undefined);
});
