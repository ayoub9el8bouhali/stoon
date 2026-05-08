import { Router } from "express";
import { housingController } from "../controllers/housingController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { schemas } from "../middlewares/validators.js";

const router = Router();

router.get("/", housingController.list);
router.get("/:id", validate(schemas.idParam), housingController.getById);
router.post("/", protect, upload.array("files", 8), validate(schemas.housing), housingController.create);
router.put("/:id", protect, upload.array("files", 8), validate(schemas.idParam), housingController.update);
router.delete("/:id", protect, validate(schemas.idParam), housingController.remove);
router.post("/:id/favorite", protect, validate(schemas.idParam), housingController.toggleFavorite);
router.post("/:id/report", protect, validate(schemas.report.merge(schemas.idParam)), housingController.report);

export default router;
