import dotenv from "dotenv";

dotenv.config();

const numberFromEnv = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: numberFromEnv(process.env.PORT, 5000),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: numberFromEnv(process.env.DB_PORT, 3306),
    name: process.env.DB_NAME || "stoon_db",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || ""
  },
  jwt: {
    secret: process.env.JWT_SECRET || "stoon_dev_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  },
  uploadMaxSizeMb: numberFromEnv(process.env.UPLOAD_MAX_SIZE_MB, 8)
};
