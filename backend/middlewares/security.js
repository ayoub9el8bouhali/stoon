import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const securityMiddlewares = [
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }),
  cors({
    origin: env.frontendUrl,
    credentials: true
  })
];

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Trop de requêtes. Réessayez dans quelques minutes."
  }
});
