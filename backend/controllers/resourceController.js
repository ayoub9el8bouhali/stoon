import { User, Favorite, Report } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination, paginatedResponse } from "../utils/pagination.js";
import { buildWhereClause } from "../utils/queryBuilder.js";

const ownerInclude = {
  model: User,
  as: "owner",
  attributes: ["id", "firstName", "lastName", "photo", "city", "school", "fieldOfStudy", "reputation"]
};

const safeSortFields = ["createdAt", "price", "startsAt", "departureAt", "deadline", "reputation"];

const resolveOrder = (query) => {
  const sortBy = safeSortFields.includes(query.sortBy) ? query.sortBy : "createdAt";
  const direction = String(query.order || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";
  return [[sortBy, direction]];
};

const ensureOwnership = (record, user) => {
  if (!record) {
    throw new ApiError("Ressource introuvable", 404);
  }

  if (record.userId !== user.id && user.role !== "admin") {
    throw new ApiError("Action non autorisée sur cette ressource", 403);
  }
};

export const createResourceController = ({
  model,
  resourceType,
  searchableFields,
  mapPayload = (req, payload) => payload
}) => ({
  list: asyncHandler(async (req, res) => {
    const { page, limit, offset } = getPagination(req.query);
    const where = buildWhereClause(req.query, searchableFields);

    const result = await model.findAndCountAll({
      where,
      include: [ownerInclude],
      order: resolveOrder(req.query),
      limit,
      offset,
      distinct: true
    });

    res.json({ success: true, ...paginatedResponse({ ...result, page, limit }) });
  }),

  getById: asyncHandler(async (req, res) => {
    const item = await model.findByPk(req.params.id, { include: [ownerInclude] });
    if (!item) {
      throw new ApiError("Ressource introuvable", 404);
    }

    res.json({ success: true, data: item });
  }),

  create: asyncHandler(async (req, res) => {
    const payload = mapPayload(req, { ...req.body, userId: req.user.id });
    const item = await model.create(payload);
    const fullItem = await model.findByPk(item.id, { include: [ownerInclude] });

    res.status(201).json({
      success: true,
      message: "Annonce publiée avec succès",
      data: fullItem
    });
  }),

  update: asyncHandler(async (req, res) => {
    const item = await model.findByPk(req.params.id);
    ensureOwnership(item, req.user);

    const payload = mapPayload(req, { ...req.body });
    await item.update(payload);
    const fullItem = await model.findByPk(item.id, { include: [ownerInclude] });

    res.json({
      success: true,
      message: "Annonce mise à jour",
      data: fullItem
    });
  }),

  remove: asyncHandler(async (req, res) => {
    const item = await model.findByPk(req.params.id);
    ensureOwnership(item, req.user);
    await item.destroy();

    res.json({ success: true, message: "Annonce supprimée" });
  }),

  toggleFavorite: asyncHandler(async (req, res) => {
    const item = await model.findByPk(req.params.id);
    if (!item) {
      throw new ApiError("Ressource introuvable", 404);
    }

    const where = { userId: req.user.id, itemType: resourceType, itemId: item.id };
    const favorite = await Favorite.findOne({ where });

    if (favorite) {
      await favorite.destroy();
      return res.json({ success: true, favorited: false, message: "Retiré des favoris" });
    }

    await Favorite.create(where);
    res.status(201).json({ success: true, favorited: true, message: "Ajouté aux favoris" });
  }),

  report: asyncHandler(async (req, res) => {
    const item = await model.findByPk(req.params.id);
    if (!item) {
      throw new ApiError("Ressource introuvable", 404);
    }

    const report = await Report.create({
      reporterId: req.user.id,
      itemType: resourceType,
      itemId: item.id,
      reason: req.body.reason
    });

    res.status(201).json({ success: true, message: "Signalement envoyé", data: report });
  })
});
