import test, { after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { askChatbot, teachChatbot } from "./chatbotService.js";
import { sequelize } from "../config/database.js";
import { pool } from "../config/db.js";

const testDirectory = mkdtempSync(path.join(tmpdir(), "stoon-chatbot-"));
process.env.STOON_CHATBOT_KNOWLEDGE = path.join(testDirectory, "connaissances.json");
process.env.STOON_CHATBOT_HISTORY = path.join(testDirectory, "historique.txt");
after(async () => {
  rmSync(testDirectory, { recursive: true, force: true });
  await sequelize.close();
  await pool.end();
});

test("askChatbot reçoit une réponse du chatbot Python", async () => {
  const result = await askChatbot("bonjour");

  assert.equal(result.success, true);
  assert.match(result.reply, /Bonjour/i);
});

test("teachChatbot apprend une réponse au chatbot Python", async () => {
  const question = `question-test-${Date.now()}`;
  const answer = "Réponse apprise pendant le test.";

  const learned = await teachChatbot(question, answer);
  const result = await askChatbot(question);

  assert.equal(learned.success, true);
  assert.equal(result.reply, answer);
});

test("askChatbot retourne les logements réels après un dialogue guidé", async () => {
  const result = await askChatbot("chambre", "housing_type|Rabat|2000");

  assert.equal(result.items.length, 1);
  assert.match(result.items[0].title, /Chambre lumineuse/i);
});
