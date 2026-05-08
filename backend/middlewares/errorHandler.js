import { ApiError } from "../utils/ApiError.js";

export const notFound = (req, res, next) => {
  next(new ApiError(`Route introuvable: ${req.originalUrl}`, 404));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Erreur serveur",
    details: err.details || null,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};
