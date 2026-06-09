import { pool } from "../config/db.js";

const baseSelect = `
  SELECT p.id, p.nom, p.niveau, p.ecole_id,
         s.nom AS ecole_nom, s.ville_id
  FROM programs p
  INNER JOIN schools s ON s.id = p.ecole_id
`;

export const programModel = {
  async findAll({ school_id } = {}) {
    const params = {};
    let sql = baseSelect;

    if (school_id) {
      sql += " WHERE p.ecole_id = :school_id";
      params.school_id = school_id;
    }

    sql += " ORDER BY p.nom ASC";
    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  async create({ nom, niveau = null, ecole_id }) {
    const [result] = await pool.execute(
      "INSERT INTO programs (nom, niveau, ecole_id) VALUES (:nom, :niveau, :ecole_id)",
      { nom, niveau, ecole_id }
    );
    return this.findById(result.insertId);
  },

  async findById(id) {
    const [rows] = await pool.execute(`${baseSelect} WHERE p.id = :id`, { id });
    return rows[0] || null;
  },

  async update(id, { nom, niveau = null, ecole_id }) {
    const [result] = await pool.execute(
      "UPDATE programs SET nom = :nom, niveau = :niveau, ecole_id = :ecole_id WHERE id = :id",
      { id, nom, niveau, ecole_id }
    );
    return result.affectedRows ? this.findById(id) : null;
  },

  async remove(id) {
    const [result] = await pool.execute("DELETE FROM programs WHERE id = :id", { id });
    return result.affectedRows > 0;
  }
};
