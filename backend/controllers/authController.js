import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn
  });

export const register = asyncHandler(async (req, res) => {
  const existingUser = await User.unscoped().findOne({ where: { email: req.body.email } });
  if (existingUser) {
    throw new ApiError("Un compte existe déjà avec cet email", 409);
  }

  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = await User.create({
    ...req.body,
    passwordHash,
    emailVerified: true
  });

  const token = signToken(user);

  res.status(201).json({
    success: true,
    message: "Compte créé. Vérification email simulée comme validée.",
    token,
    user: user.toPublicJSON()
  });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.unscoped().findOne({ where: { email: req.body.email } });
  if (!user) {
    throw new ApiError("Email ou mot de passe incorrect", 401);
  }

  const validPassword = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!validPassword) {
    throw new ApiError("Email ou mot de passe incorrect", 401);
  }

  const token = signToken(user);

  res.json({
    success: true,
    message: "Connexion réussie",
    token,
    user: user.toPublicJSON()
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toPublicJSON() });
});

export const logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Déconnexion réussie côté client" });
});
