import { Router } from "express";
import { cityController } from "../controllers/cityController.js";

const router = Router();

router.get("/", cityController.list);
router.post("/", cityController.create);
router.put("/:id", cityController.update);
router.delete("/:id", cityController.remove);

export default router;

