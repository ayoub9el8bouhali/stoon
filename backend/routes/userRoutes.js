import { Router } from "express";
import {
  getMyStats,
  getMyPublications,
  getUserById,
  listNotifications,
  listUsers,
  markNotificationRead,
  updateProfile
} from "../controllers/userController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { schemas } from "../middlewares/validators.js";

const router = Router();

router.get("/", protect, adminOnly, listUsers);
router.get("/me/stats", protect, getMyStats);
router.get("/me/publications", protect, getMyPublications);
router.get("/me/notifications", protect, listNotifications);
router.patch("/me/notifications/:id/read", protect, validate(schemas.idParam), markNotificationRead);
router.put("/profile", protect, upload.single("photo"), validate(schemas.profile), updateProfile);
router.get("/:id", protect, validate(schemas.idParam), getUserById);

export default router;
