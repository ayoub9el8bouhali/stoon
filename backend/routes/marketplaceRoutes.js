import { Router } from "express";
import { marketplaceController } from "../controllers/marketplaceController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { schemas } from "../middlewares/validators.js";

const router = Router();

router.get("/", marketplaceController.list);
router.get("/:id", validate(schemas.idParam), marketplaceController.getById);
router.post("/", protect, upload.array("files", 8), validate(schemas.marketplace), marketplaceController.create);
router.put("/:id", protect, upload.array("files", 8), validate(schemas.idParam), marketplaceController.update);
router.delete("/:id", protect, validate(schemas.idParam), marketplaceController.remove);
router.post("/:id/favorite", protect, validate(schemas.idParam), marketplaceController.toggleFavorite);
router.post("/:id/report", protect, validate(schemas.report.merge(schemas.idParam)), marketplaceController.report);

export default router;
