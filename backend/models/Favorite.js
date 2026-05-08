import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Favorite extends Model {}

Favorite.init(
  {
    itemType: {
      type: DataTypes.ENUM("housing", "marketplace", "ride", "event", "job"),
      allowNull: false
    },
    itemId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Favorite",
    tableName: "favorites",
    indexes: [
      { fields: ["user_id"] },
      { fields: ["item_type", "item_id"] },
      { fields: ["user_id", "item_type", "item_id"], unique: true }
    ]
  }
);
