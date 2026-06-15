import { Router } from "express";
import { ask, teach } from "../controllers/chatbotController.js";

const router = Router();

router.post("/ask", ask);
router.post("/teach", teach);

export default router;
