import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Ride extends Model {}

Ride.init(
  {
    departureCity: { type: DataTypes.STRING(80), allowNull: false },
    departureAddress: { type: DataTypes.STRING(220), allowNull: false },
    destinationCity: { type: DataTypes.STRING(80), allowNull: false },
    destinationAddress: { type: DataTypes.STRING(220), allowNull: false },
    departureAt: { type: DataTypes.DATE, allowNull: false },
    seatsTotal: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    seatsAvailable: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    pricePerSeat: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    carModel: { type: DataTypes.STRING(120), allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    city: { type: DataTypes.STRING(80), allowNull: false },
    school: { type: DataTypes.STRING(160), allowNull: false },
    status: {
      type: DataTypes.ENUM("active", "full", "cancelled", "archived"),
      allowNull: false,
      defaultValue: "active"
    }
  },
  {
    sequelize,
    modelName: "Ride",
    tableName: "rides",
    indexes: [
      { fields: ["departure_city"] },
      { fields: ["destination_city"] },
      { fields: ["departure_at"] },
      { fields: ["city"] },
      { fields: ["school"] },
      { fields: ["status"] },
      { fields: ["user_id"] }
    ]
  }
);
