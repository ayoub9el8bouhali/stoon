import { pool } from "../config/db.js";

const baseSelect = `
  SELECT s.id, s.nom, s.type, s.ville_id, s.description, s.site_web,
         c.nom AS ville_nom
  FROM schools s
  INNER JOIN cities c ON c.id = s.ville_id
`;

export const schoolModel = {
  async findAll({ city_id } = {}) {
    const params = {};
    let sql = baseSelect;

    if (city_id) {
      sql += " WHERE s.ville_id = :city_id";
      params.city_id = city_id;
    }

    sql += " ORDER BY s.nom ASC";
    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  async create({ nom, type, ville_id, description, site_web = null }) {
    const [result] = await pool.execute(
      `INSERT INTO schools (nom, type, ville_id, description, site_web)
       VALUES (:nom, :type, :ville_id, :description, :site_web)`,
      { nom, type, ville_id, description, site_web }
    );
    return this.findById(result.insertId);
  },

  async findById(id) {
    const [rows] = await pool.execute(`${baseSelect} WHERE s.id = :id`, { id });
    return rows[0] || null;
  },

  async update(id, { nom, type, ville_id, description, site_web = null }) {
    const [result] = await pool.execute(
      `UPDATE schools
       SET nom = :nom, type = :type, ville_id = :ville_id,
           description = :description, site_web = :site_web
       WHERE id = :id`,
      { id, nom, type, ville_id, description, site_web }
    );
    return result.affectedRows ? this.findById(id) : null;
  },

  async remove(id) {
    const [result] = await pool.execute("DELETE FROM schools WHERE id = :id", { id });
    return result.affectedRows > 0;
  }
};

