import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class MarketplaceItem extends Model {}

MarketplaceItem.init(
  {
    title: { type: DataTypes.STRING(180), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    category: {
      type: DataTypes.ENUM("document", "livre", "materiel", "electronique", "autre"),
      allowNull: false
    },
    transactionType: {
      type: DataTypes.ENUM("vente", "achat"),
      allowNull: false,
      defaultValue: "vente"
    },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    condition: {
      type: DataTypes.ENUM("neuf", "tres_bon", "bon", "acceptable", "numerique"),
      allowNull: false,
      defaultValue: "bon"
    },
    city: { type: DataTypes.STRING(80), allowNull: false },
    school: { type: DataTypes.STRING(160), allowNull: false },
    fieldOfStudy: { type: DataTypes.STRING(120), allowNull: true },
    images: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    documentUrl: { type: DataTypes.STRING, allowNull: true },
    status: {
      type: DataTypes.ENUM("active", "sold", "archived"),
      allowNull: false,
      defaultValue: "active"
    }
  },
  {
    sequelize,
    modelName: "MarketplaceItem",
    tableName: "marketplace_items",
    indexes: [
      { fields: ["category"] },
      { fields: ["transaction_type"] },
      { fields: ["city"] },
      { fields: ["school"] },
      { fields: ["status"] },
      { fields: ["user_id"] }
    ]
  }
);
