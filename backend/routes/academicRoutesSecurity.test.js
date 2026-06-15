import test from "node:test";
import assert from "node:assert/strict";

const baseUrl = "http://localhost:5001/api";

for (const resource of ["cities", "schools", "programs"]) {
  test(`refuse la création publique de ${resource}`, async () => {
    const response = await fetch(`${baseUrl}/${resource}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });

    assert.equal(response.status, 401);
  });
}
