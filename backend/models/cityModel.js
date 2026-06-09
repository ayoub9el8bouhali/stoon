import { pool } from "../config/db.js";

export const cityModel = {
  async findAll() {
    const [rows] = await pool.query("SELECT id, nom, region, aliases FROM cities ORDER BY region ASC, nom ASC");
    return rows;
  },

  async create({ nom, region = null, aliases = [] }) {
    const [result] = await pool.execute(
      "INSERT INTO cities (nom, region, aliases) VALUES (:nom, :region, :aliases)",
      { nom, region, aliases: JSON.stringify(aliases) }
    );
    return this.findById(result.insertId);
  },

  async findById(id) {
    const [rows] = await pool.execute(
      "SELECT id, nom, region, aliases FROM cities WHERE id = :id",
      { id }
    );
    return rows[0] || null;
  },

  async update(id, { nom, region = null, aliases = [] }) {
    const [result] = await pool.execute(
      "UPDATE cities SET nom = :nom, region = :region, aliases = :aliases WHERE id = :id",
      { id, nom, region, aliases: JSON.stringify(aliases) }
    );
    return result.affectedRows ? this.findById(id) : null;
  },

  async remove(id) {
    const [result] = await pool.execute("DELETE FROM cities WHERE id = :id", { id });
    return result.affectedRows > 0;
  }
};
