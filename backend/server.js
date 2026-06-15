import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import "./models/index.js";
import apiRoutes from "./routes/index.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import { securityMiddlewares } from "./middlewares/security.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "..", "frontend");

const app = express();

app.use(securityMiddlewares);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", apiRoutes);
app.use(
  express.static(frontendPath, {
    etag: false,
    maxAge: 0,
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    }
  })
);
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
    return next();
  }

  return res.sendFile(path.join(frontendPath, "index.html"));
});
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`ST00N API prête sur http://localhost:${env.port}/api`);
    });
  } catch (error) {
    console.error("Impossible de démarrer l'API ST00N:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;
