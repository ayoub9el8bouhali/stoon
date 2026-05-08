export const getPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 9, 1), 50);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

export const paginatedResponse = ({ rows, count, page, limit }) => ({
  data: rows,
  meta: {
    page,
    limit,
    total: count,
    pages: Math.ceil(count / limit) || 1
  }
});
