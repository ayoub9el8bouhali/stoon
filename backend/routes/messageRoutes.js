import { Router } from "express";
import {
  createConversation,
  listConversations,
  listMessages,
  sendMessage
} from "../controllers/messageController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { schemas } from "../middlewares/validators.js";

const router = Router();

router.use(protect);
router.get("/conversations", listConversations);
router.post("/conversations", upload.array("files", 5), validate(schemas.message), createConversation);
router.get("/conversations/:id", validate(schemas.idParam), listMessages);
router.post("/conversations/:id", upload.array("files", 5), validate(schemas.message), sendMessage);

export default router;
