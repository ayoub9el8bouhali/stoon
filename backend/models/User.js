import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class User extends Model {
  toPublicJSON() {
    const values = { ...this.get({ plain: true }) };
    delete values.passwordHash;
    return values;
  }
}

User.init(
  {
    firstName: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user"
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    school: {
      type: DataTypes.STRING(160),
      allowNull: false
    },
    fieldOfStudy: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reputation: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 4.5
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    preferences: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
    }
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    defaultScope: {
      attributes: { exclude: ["passwordHash"] }
    },
    scopes: {
      withPassword: {
        attributes: { include: ["passwordHash"] }
      }
    },
    indexes: [
      { fields: ["email"], unique: true },
      { fields: ["city"] },
      { fields: ["school"] },
      { fields: ["field_of_study"] },
      { fields: ["role"] }
    ]
  }
);
