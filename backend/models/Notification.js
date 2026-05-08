import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Notification extends Model {}

Notification.init(
  {
    title: { type: DataTypes.STRING(160), allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    type: {
      type: DataTypes.ENUM("message", "booking", "review", "system", "report"),
      allowNull: false,
      defaultValue: "system"
    },
    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    sequelize,
    modelName: "Notification",
    tableName: "notifications",
    indexes: [
      { fields: ["user_id"] },
      { fields: ["type"] },
      { fields: ["is_read"] },
      { fields: ["created_at"] }
    ]
  }
);
