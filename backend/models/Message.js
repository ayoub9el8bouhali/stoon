import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Message extends Model {}

Message.init(
  {
    body: { type: DataTypes.TEXT, allowNull: false },
    attachments: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    sequelize,
    modelName: "Message",
    tableName: "messages",
    indexes: [
      { fields: ["conversation_id"] },
      { fields: ["sender_id"] },
      { fields: ["created_at"] }
    ]
  }
);
