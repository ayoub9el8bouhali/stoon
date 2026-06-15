import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import housingRoutes from "./housingRoutes.js";
import marketplaceRoutes from "./marketplaceRoutes.js";
import rideRoutes from "./rideRoutes.js";
import eventRoutes from "./eventRoutes.js";
import jobRoutes from "./jobRoutes.js";
import messageRoutes from "./messageRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import adminRoutes from "./adminRoutes.js";
import cityRoutes from "./cityRoutes.js";
import schoolRoutes from "./schoolRoutes.js";
import programRoutes from "./programRoutes.js";
import chatbotRoutes from "./chatbotRoutes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    name: "ST00N API",
    status: "opérationnelle",
    timestamp: new Date().toISOString()
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/housing", housingRoutes);
router.use("/marketplace", marketplaceRoutes);
router.use("/rides", rideRoutes);
router.use("/events", eventRoutes);
router.use("/jobs", jobRoutes);
router.use("/messages", messageRoutes);
router.use("/reviews", reviewRoutes);
router.use("/admin", adminRoutes);
router.use("/cities", cityRoutes);
router.use("/schools", schoolRoutes);
router.use("/programs", programRoutes);
router.use("/chatbot", chatbotRoutes);

export default router;
