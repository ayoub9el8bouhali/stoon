import { Router } from "express";
import { jobController } from "../controllers/jobController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { schemas } from "../middlewares/validators.js";

const router = Router();

router.get("/", jobController.list);
router.get("/:id", validate(schemas.idParam), jobController.getById);
router.post("/", protect, validate(schemas.job), jobController.create);
router.put("/:id", protect, validate(schemas.idParam), jobController.update);
router.delete("/:id", protect, validate(schemas.idParam), jobController.remove);
router.post("/:id/favorite", protect, validate(schemas.idParam), jobController.toggleFavorite);
router.post("/:id/report", protect, validate(schemas.report.merge(schemas.idParam)), jobController.report);

export default router;
