import {
  User,
  Housing,
  MarketplaceItem,
  Ride,
  Event,
  Job,
  Favorite,
  Notification,
  Review
} from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination, paginatedResponse } from "../utils/pagination.js";
import { publicFilePath } from "../middlewares/uploadMiddleware.js";

export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = {};

  ["city", "school", "fieldOfStudy", "role"].forEach((key) => {
    if (req.query[key]) where[key] = req.query[key];
  });

  const result = await User.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    limit,
    offset
  });

  res.json({ success: true, ...paginatedResponse({ ...result, page, limit }) });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ["id", "firstName", "lastName", "photo", "city", "school", "fieldOfStudy", "bio", "reputation", "createdAt"],
    include: [
      { model: Review, as: "receivedReviews", limit: 8, separate: true, order: [["createdAt", "DESC"]] }
    ]
  });

  if (!user) {
    throw new ApiError("Utilisateur introuvable", 404);
  }

  res.json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const photo = publicFilePath(req.file);
  const payload = {
    ...req.body,
    ...(photo ? { photo } : {})
  };

  await req.user.update(payload);
  res.json({ success: true, message: "Profil mis à jour", user: req.user.toPublicJSON() });
});

export const getMyStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const [housing, marketplace, rides, events, jobs, favorites, notifications] = await Promise.all([
    Housing.count({ where: { userId } }),
    MarketplaceItem.count({ where: { userId } }),
    Ride.count({ where: { userId } }),
    Event.count({ where: { userId } }),
    Job.count({ where: { userId } }),
    Favorite.count({ where: { userId } }),
    Notification.count({ where: { userId, isRead: false } })
  ]);

  res.json({
    success: true,
    data: {
      publications: housing + marketplace + rides + events + jobs,
      housing,
      marketplace,
      rides,
      events,
      jobs,
      favorites,
      unreadNotifications: notifications,
      reputation: req.user.reputation
    }
  });
});

export const getMyPublications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const [housing, documents, rides, jobs] = await Promise.all([
    Housing.findAll({ where: { userId }, order: [["createdAt", "DESC"]] }),
    MarketplaceItem.findAll({ where: { userId }, order: [["createdAt", "DESC"]] }),
    Ride.findAll({ where: { userId }, order: [["createdAt", "DESC"]] }),
    Job.findAll({ where: { userId }, order: [["createdAt", "DESC"]] })
  ]);

  const addType = (items, resourceType) =>
    items.map(item => ({ ...item.get({ plain: true }), resourceType, ownerId: userId }));

  const data = [
    ...addType(housing, "housing"),
    ...addType(documents, "document"),
    ...addType(rides, "ride"),
    ...addType(jobs, "job")
  ].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

  res.json({ success: true, data });
});

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.findAll({
    where: { userId: req.user.id },
    order: [["createdAt", "DESC"]],
    limit: 30
  });

  res.json({ success: true, data: notifications });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    where: { id: req.params.id, userId: req.user.id }
  });

  if (!notification) {
    throw new ApiError("Notification introuvable", 404);
  }

  await notification.update({ isRead: true });
  res.json({ success: true, data: notification });
});
