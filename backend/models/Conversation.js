import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Conversation extends Model {}

Conversation.init(
  {
    title: { type: DataTypes.STRING(180), allowNull: true },
    lastMessageAt: { type: DataTypes.DATE, allowNull: true }
  },
  {
    sequelize,
    modelName: "Conversation",
    tableName: "conversations",
    indexes: [{ fields: ["last_message_at"] }]
  }
);
