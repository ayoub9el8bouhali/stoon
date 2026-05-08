import { Router } from "express";
import { createReview, deleteReview, listUserReviews } from "../controllers/reviewController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { schemas } from "../middlewares/validators.js";

const router = Router();

router.get("/user/:id", validate(schemas.idParam), listUserReviews);
router.post("/", protect, validate(schemas.review), createReview);
router.delete("/:id", protect, validate(schemas.idParam), deleteReview);

export default router;
