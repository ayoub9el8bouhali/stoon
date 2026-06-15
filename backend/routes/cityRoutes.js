import { Router } from "express";
import { cityController } from "../controllers/cityController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", cityController.list);
router.post("/", protect, adminOnly, cityController.create);
router.put("/:id", protect, adminOnly, cityController.update);
router.delete("/:id", protect, adminOnly, cityController.remove);

export default router;
