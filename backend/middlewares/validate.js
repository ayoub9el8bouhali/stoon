import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params
  });

  if (!result.success) {
    const details = result.error.errors.map((error) => ({
      path: error.path.join("."),
      message: error.message
    }));

    return next(new ApiError("Données invalides", 422, details));
  }

  req.body = result.data.body ?? req.body;
  req.query = result.data.query ?? req.query;
  req.params = result.data.params ?? req.params;
  next();
};
