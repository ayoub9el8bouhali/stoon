import { Router } from "express";
import { schoolController } from "../controllers/schoolController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", schoolController.list);
router.post("/", protect, adminOnly, schoolController.create);
router.put("/:id", protect, adminOnly, schoolController.update);
router.delete("/:id", protect, adminOnly, schoolController.remove);

export default router;
