import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Event extends Model {}

Event.init(
  {
    title: { type: DataTypes.STRING(180), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    eventType: {
      type: DataTypes.ENUM("conference", "atelier", "soiree", "sport", "voyage", "culture"),
      allowNull: false,
      defaultValue: "conference"
    },
    city: { type: DataTypes.STRING(80), allowNull: false },
    school: { type: DataTypes.STRING(160), allowNull: false },
    fieldOfStudy: { type: DataTypes.STRING(120), allowNull: true },
    venue: { type: DataTypes.STRING(220), allowNull: false },
    startsAt: { type: DataTypes.DATE, allowNull: false },
    endsAt: { type: DataTypes.DATE, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    capacity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 40 },
    reservedSeats: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    posterUrl: { type: DataTypes.STRING, allowNull: true },
    status: {
      type: DataTypes.ENUM("active", "full", "cancelled", "archived"),
      allowNull: false,
      defaultValue: "active"
    }
  },
  {
    sequelize,
    modelName: "Event",
    tableName: "events",
    indexes: [
      { fields: ["event_type"] },
      { fields: ["city"] },
      { fields: ["school"] },
      { fields: ["starts_at"] },
      { fields: ["status"] },
      { fields: ["user_id"] }
    ]
  }
);
