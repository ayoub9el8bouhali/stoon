import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Report extends Model {}

Report.init(
  {
    itemType: {
      type: DataTypes.ENUM("housing", "marketplace", "ride", "event", "job", "message", "user"),
      allowNull: false
    },
    itemId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    reason: { type: DataTypes.STRING(240), allowNull: false },
    status: {
      type: DataTypes.ENUM("open", "reviewing", "resolved"),
      allowNull: false,
      defaultValue: "open"
    }
  },
  {
    sequelize,
    modelName: "Report",
    tableName: "reports",
    indexes: [
      { fields: ["reporter_id"] },
      { fields: ["item_type", "item_id"] },
      { fields: ["status"] }
    ]
  }
);
