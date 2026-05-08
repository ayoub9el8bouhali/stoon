import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class ConversationParticipant extends Model {}

ConversationParticipant.init(
  {
    lastReadAt: { type: DataTypes.DATE, allowNull: true }
  },
  {
    sequelize,
    modelName: "ConversationParticipant",
    tableName: "conversation_participants",
    indexes: [
      { fields: ["conversation_id"] },
      { fields: ["user_id"] },
      { fields: ["conversation_id", "user_id"], unique: true }
    ]
  }
);
