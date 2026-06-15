import test, { after } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const baseUrl = "http://localhost:5001/api";
const createdConversationIds = new Set();
const marker = `test-conversation-${Date.now()}`;

after(async () => {
  if (!createdConversationIds.size) return;
  const ids = [...createdConversationIds].join(",");
  execFileSync("docker", [
    "exec", "stoon_mysql", "mysql", "-uroot", "stoon_db", "-e",
    `DELETE FROM messages WHERE body LIKE '${marker}%'; DELETE FROM notifications WHERE user_id=2 AND type='message' AND body='Yassine vous a envoyé un message.'; DELETE FROM conversation_participants WHERE conversation_id IN (${ids}); DELETE FROM conversations WHERE id IN (${ids});`
  ]);
});

test("réutilise une conversation directe existante", async () => {
  const login = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "yassine@stoon.ma", password: "Stoon2026!" })
  }).then(response => response.json());

  const send = body => fetch(`${baseUrl}/messages/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${login.token}` },
    body: JSON.stringify({ participantId: 2, body })
  }).then(response => response.json());

  const first = await send(`${marker}-1`);
  const second = await send(`${marker}-2`);
  createdConversationIds.add(first.data.id);
  createdConversationIds.add(second.data.id);

  assert.equal(second.data.id, first.data.id);
  assert.equal(second.reused, true);
});
