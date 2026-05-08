import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Review extends Model {}

Review.init(
  {
    rating: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    comment: { type: DataTypes.TEXT, allowNull: false }
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "reviews",
    indexes: [
      { fields: ["target_user_id"] },
      { fields: ["reviewer_id"] },
      { fields: ["target_user_id", "reviewer_id"] }
    ]
  }
);
