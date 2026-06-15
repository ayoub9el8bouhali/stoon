import { Router } from "express";
import { programController } from "../controllers/programController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", programController.list);
router.post("/", protect, adminOnly, programController.create);
router.put("/:id", protect, adminOnly, programController.update);
router.delete("/:id", protect, adminOnly, programController.remove);

export default router;
