import { Router } from "express";
import { eventController } from "../controllers/eventController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { schemas } from "../middlewares/validators.js";

const router = Router();

router.get("/", eventController.list);
router.get("/:id", validate(schemas.idParam), eventController.getById);
router.post("/", protect, upload.array("files", 3), validate(schemas.event), eventController.create);
router.put("/:id", protect, upload.array("files", 3), validate(schemas.idParam), eventController.update);
router.delete("/:id", protect, validate(schemas.idParam), eventController.remove);
router.post("/:id/favorite", protect, validate(schemas.idParam), eventController.toggleFavorite);
router.post("/:id/report", protect, validate(schemas.report.merge(schemas.idParam)), eventController.report);
router.post("/:id/reservations", protect, validate(schemas.reservation), eventController.reserve);

export default router;
