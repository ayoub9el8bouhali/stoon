import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Booking extends Model {}

Booking.init(
  {
    resourceType: {
      type: DataTypes.ENUM("ride", "event"),
      allowNull: false
    },
    resourceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    seats: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      allowNull: false,
      defaultValue: "confirmed"
    }
  },
  {
    sequelize,
    modelName: "Booking",
    tableName: "bookings",
    indexes: [
      { fields: ["user_id"] },
      { fields: ["resource_type", "resource_id"] },
      { fields: ["status"] }
    ]
  }
);
