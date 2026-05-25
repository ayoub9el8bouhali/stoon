import { Router } from "express";
import { programController } from "../controllers/programController.js";

const router = Router();

router.get("/", programController.list);
router.post("/", programController.create);
router.put("/:id", programController.update);
router.delete("/:id", programController.remove);

export default router;

