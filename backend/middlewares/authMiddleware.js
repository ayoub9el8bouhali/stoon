import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    throw new ApiError("Authentification requise", 401);
  }

  const decoded = jwt.verify(token, env.jwt.secret);
  const user = await User.findByPk(decoded.id);

  if (!user) {
    throw new ApiError("Utilisateur introuvable", 401);
  }

  req.user = user;
  next();
});

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new ApiError("Accès administrateur requis", 403));
  }

  next();
};
