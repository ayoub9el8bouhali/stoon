import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { searchStoonData } from "./chatbotSearchService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const chatbotPath = path.join(__dirname, "..", "chatbot", "chatbot.py");
const pythonCommand = process.env.PYTHON_BIN || (process.platform === "win32" ? "python" : "python3");

const runPythonChatbot = (payload) =>
  new Promise((resolve, reject) => {
    const python = spawn(pythonCommand, [chatbotPath], {
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true
    });

    let output = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });
    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });
    python.on("error", reject);
    python.on("close", (code) => {
      try {
        const result = JSON.parse(output);
        if (code !== 0 || !result.success) {
          return reject(new Error(result.message || errorOutput || "L'assistant STOON est indisponible."));
        }
        return resolve(result);
      } catch {
        return reject(new Error(errorOutput || "Réponse invalide de l'assistant STOON."));
      }
    });

    python.stdin.end(JSON.stringify(payload));
  });

export const askChatbot = async (message, context = "") => {
  const result = await runPythonChatbot({ action: "ask", message, context });
  const contextSuggestions = {
    housing_city: ["Casablanca", "Rabat", "Marrakech"],
    housing_budget: ["1500 MAD", "2000 MAD", "2500 MAD", "3000 MAD"],
    housing_type: ["Chambre", "Studio", "Appartement", "Colocation"],
    ride_route: ["Casablanca vers Rabat", "Marrakech vers Casablanca"],
    job_details: ["Stage à Casablanca", "Job étudiant à Tanger"],
    school_details: ["Informatique à Agadir", "École à Rabat"]
  };
  const step = String(result.nextContext || "").split("|")[0];
  if (!result.search) {
    return { ...result, items: [], suggestions: contextSuggestions[step] || [] };
  }

  const searchResult = await searchStoonData(result.search);
  return {
    ...result,
    reply: searchResult.reply,
    items: searchResult.items,
    suggestions: searchResult.items.length ? ["Nouvelle recherche", "Voir plus de détails"] : ["Élargir la recherche"]
  };
};

export const teachChatbot = (question, answer) =>
  runPythonChatbot({ action: "teach", question, answer });
