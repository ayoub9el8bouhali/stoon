import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Housing extends Model {}

Housing.init(
  {
    title: { type: DataTypes.STRING(180), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    type: {
      type: DataTypes.ENUM("chambre", "studio", "appartement", "colocation"),
      allowNull: false,
      defaultValue: "colocation"
    },
    city: { type: DataTypes.STRING(80), allowNull: false },
    school: { type: DataTypes.STRING(160), allowNull: false },
    fieldOfStudy: { type: DataTypes.STRING(120), allowNull: true },
    address: { type: DataTypes.STRING(220), allowNull: false },
    latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    rooms: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
    availableFrom: { type: DataTypes.DATEONLY, allowNull: false },
    images: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    amenities: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    status: {
      type: DataTypes.ENUM("active", "reserved", "archived"),
      allowNull: false,
      defaultValue: "active"
    }
  },
  {
    sequelize,
    modelName: "Housing",
    tableName: "housing_ads",
    indexes: [
      { fields: ["city"] },
      { fields: ["school"] },
      { fields: ["price"] },
      { fields: ["status"] },
      { fields: ["user_id"] }
    ]
  }
);
