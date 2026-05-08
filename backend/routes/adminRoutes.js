import { Router } from "express";
import { getAdminStats, listReports } from "../controllers/adminController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(protect, adminOnly);
router.get("/stats", getAdminStats);
router.get("/reports", listReports);

export default router;
