import { Router } from "express";
import { rideController } from "../controllers/rideController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { schemas } from "../middlewares/validators.js";

const router = Router();

router.get("/", rideController.list);
router.get("/:id", validate(schemas.idParam), rideController.getById);
router.post("/", protect, validate(schemas.ride), rideController.create);
router.put("/:id", protect, validate(schemas.idParam), rideController.update);
router.delete("/:id", protect, validate(schemas.idParam), rideController.remove);
router.post("/:id/favorite", protect, validate(schemas.idParam), rideController.toggleFavorite);
router.post("/:id/report", protect, validate(schemas.report.merge(schemas.idParam)), rideController.report);
router.post("/:id/reservations", protect, validate(schemas.reservation), rideController.reserve);

export default router;
