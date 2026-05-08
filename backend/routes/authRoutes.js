import { Router } from "express";
import { login, logout, me, register } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { schemas } from "../middlewares/validators.js";

const router = Router();

router.post("/register", validate(schemas.register), register);
router.post("/login", validate(schemas.login), login);
router.get("/me", protect, me);
router.post("/logout", protect, logout);

export default router;
