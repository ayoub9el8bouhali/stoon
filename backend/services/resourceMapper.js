import { publicFilePath, publicFilePaths } from "../middlewares/uploadMiddleware.js";

export const parseFlexibleList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
  }
};

export const splitUploads = (files = []) => {
  const images = files.filter((file) => file.mimetype.startsWith("image/"));
  const pdf = files.find((file) => file.mimetype === "application/pdf");

  return {
    imagePaths: publicFilePaths(images),
    pdfPath: publicFilePath(pdf)
  };
};

export const mapHousingPayload = (req, payload) => {
  const { imagePaths } = splitUploads(req.files);
  return {
    ...payload,
    images: imagePaths.length ? imagePaths : payload.images,
    amenities: parseFlexibleList(payload.amenities)
  };
};

export const mapMarketplacePayload = (req, payload) => {
  const { imagePaths, pdfPath } = splitUploads(req.files);
  return {
    ...payload,
    images: imagePaths.length ? imagePaths : payload.images,
    documentUrl: pdfPath || payload.documentUrl || null
  };
};

export const mapRidePayload = (req, payload) => ({
  ...payload,
  seatsAvailable: payload.seatsAvailable || payload.seatsTotal
});

export const mapEventPayload = (req, payload) => {
  const { imagePaths } = splitUploads(req.files);
  return {
    ...payload,
    posterUrl: imagePaths[0] || payload.posterUrl || null
  };
};

export const mapJobPayload = (req, payload) => ({
  ...payload,
  skills: parseFlexibleList(payload.skills)
});
