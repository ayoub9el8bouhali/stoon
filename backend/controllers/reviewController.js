import { Review, User } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createReview = asyncHandler(async (req, res) => {
  if (req.body.targetUserId === req.user.id) {
    throw new ApiError("Vous ne pouvez pas vous noter vous-même", 422);
  }

  const targetUser = await User.findByPk(req.body.targetUserId);
  if (!targetUser) {
    throw new ApiError("Utilisateur ciblé introuvable", 404);
  }

  const review = await Review.create({
    reviewerId: req.user.id,
    targetUserId: req.body.targetUserId,
    rating: req.body.rating,
    comment: req.body.comment
  });

  const reviews = await Review.findAll({ where: { targetUserId: req.body.targetUserId } });
  const average = reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
  await targetUser.update({ reputation: Number(average.toFixed(2)) });

  const fullReview = await Review.findByPk(review.id, {
    include: [
      { model: User, as: "reviewer", attributes: ["id", "firstName", "lastName", "photo", "school"] },
      { model: User, as: "targetUser", attributes: ["id", "firstName", "lastName", "reputation"] }
    ]
  });

  res.status(201).json({ success: true, message: "Avis publié", data: fullReview });
});

export const listUserReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.findAll({
    where: { targetUserId: req.params.id },
    include: [{ model: User, as: "reviewer", attributes: ["id", "firstName", "lastName", "photo", "school"] }],
    order: [["createdAt", "DESC"]]
  });

  res.json({ success: true, data: reviews });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByPk(req.params.id);
  if (!review) throw new ApiError("Avis introuvable", 404);

  if (review.reviewerId !== req.user.id && req.user.role !== "admin") {
    throw new ApiError("Action non autorisée", 403);
  }

  await review.destroy();
  res.json({ success: true, message: "Avis supprimé" });
});
