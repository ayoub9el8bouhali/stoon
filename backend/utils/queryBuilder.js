import { Op } from "sequelize";

const filterableKeys = [
  "city",
  "school",
  "fieldOfStudy",
  "category",
  "type",
  "eventType",
  "opportunityType",
  "workMode",
  "status"
];

export const buildWhereClause = (query, searchableFields = []) => {
  const where = {};

  filterableKeys.forEach((key) => {
    if (query[key]) {
      where[key] = query[key];
    }
  });

  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price[Op.gte] = Number(query.minPrice);
    if (query.maxPrice) where.price[Op.lte] = Number(query.maxPrice);
  }

  if (query.search && searchableFields.length > 0) {
    where[Op.or] = searchableFields.map((field) => ({
      [field]: { [Op.like]: `%${query.search}%` }
    }));
  }

  return where;
};
