import { askChatbot, teachChatbot } from "../services/chatbotService.js";

export const ask = async (req, res, next) => {
  try {
    const message = String(req.body.message || "").trim();
    if (!message) {
      return res.status(400).json({ success: false, message: "Le message est obligatoire." });
    }
    const context = String(req.body.context || "").trim();
    return res.json(await askChatbot(message, context));
  } catch (error) {
    return next(error);
  }
};

export const teach = async (req, res, next) => {
  try {
    const question = String(req.body.question || "").trim();
    const answer = String(req.body.answer || "").trim();
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: "La question et la réponse sont obligatoires." });
    }
    return res.json(await teachChatbot(question, answer));
  } catch (error) {
    return next(error);
  }
};
