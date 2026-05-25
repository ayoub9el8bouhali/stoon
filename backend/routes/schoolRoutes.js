import { Router } from "express";
import { schoolController } from "../controllers/schoolController.js";

const router = Router();

router.get("/", schoolController.list);
router.post("/", schoolController.create);
router.put("/:id", schoolController.update);
router.delete("/:id", schoolController.remove);

export default router;

