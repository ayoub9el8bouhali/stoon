import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Job extends Model {}

Job.init(
  {
    title: { type: DataTypes.STRING(180), allowNull: false },
    company: { type: DataTypes.STRING(160), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    opportunityType: {
      type: DataTypes.ENUM("stage", "job_etudiant", "service_freelance"),
      allowNull: false
    },
    workMode: {
      type: DataTypes.ENUM("presentiel", "hybride", "remote"),
      allowNull: false,
      defaultValue: "hybride"
    },
    city: { type: DataTypes.STRING(80), allowNull: false },
    school: { type: DataTypes.STRING(160), allowNull: true },
    fieldOfStudy: { type: DataTypes.STRING(120), allowNull: true },
    salary: { type: DataTypes.STRING(120), allowNull: true },
    deadline: { type: DataTypes.DATEONLY, allowNull: true },
    skills: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    contactEmail: { type: DataTypes.STRING(160), allowNull: false, validate: { isEmail: true } },
    status: {
      type: DataTypes.ENUM("active", "closed", "archived"),
      allowNull: false,
      defaultValue: "active"
    }
  },
  {
    sequelize,
    modelName: "Job",
    tableName: "jobs",
    indexes: [
      { fields: ["opportunity_type"] },
      { fields: ["work_mode"] },
      { fields: ["city"] },
      { fields: ["field_of_study"] },
      { fields: ["status"] },
      { fields: ["user_id"] }
    ]
  }
);
