import { sequelize } from "../models/index.js";

const sync = async () => {
  await sequelize.sync({ alter: true });
  console.log("Schéma ST00N synchronisé avec MySQL.");
  await sequelize.close();
};

sync().catch((error) => {
  console.error(error);
  process.exit(1);
});
