import test from "node:test";
import assert from "node:assert/strict";

test("ne bloque jamais les pages HTML avec le limiteur API", async () => {
  const statuses = [];
  for (let index = 0; index < 260; index += 1) {
    statuses.push((await fetch("http://localhost:5001/")).status);
  }

  assert.ok(statuses.every(status => status === 200));
});
