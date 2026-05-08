import fs from "fs";
import path from "path";
import multer from "multer";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const ensureDirectory = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isPdf = file.mimetype === "application/pdf";
    const folder = isPdf ? "uploads/documents" : "uploads/images";
    ensureDirectory(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    cb(null, `${Date.now()}-${safeName || "stoon"}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new ApiError("Seuls les fichiers JPG, PNG, WEBP et PDF sont acceptés", 415));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.uploadMaxSizeMb * 1024 * 1024
  }
});

export const publicFilePath = (file) => {
  if (!file) return null;
  return `/${file.path.replace(/\\/g, "/")}`;
};

export const publicFilePaths = (files = []) => files.map(publicFilePath).filter(Boolean);
