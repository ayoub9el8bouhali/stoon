import { pool } from "../config/db.js";

export const cityModel = {
  async findAll() {
    const [rows] = await pool.query("SELECT id, nom, region FROM cities ORDER BY nom ASC");
    return rows;
  },

  async create({ nom, region = null }) {
    const [result] = await pool.execute(
      "INSERT INTO cities (nom, region) VALUES (:nom, :region)",
      { nom, region }
    );
    return this.findById(result.insertId);
  },

  async findById(id) {
    const [rows] = await pool.execute(
      "SELECT id, nom, region FROM cities WHERE id = :id",
      { id }
    );
    return rows[0] || null;
  },

  async update(id, { nom, region = null }) {
    const [result] = await pool.execute(
      "UPDATE cities SET nom = :nom, region = :region WHERE id = :id",
      { id, nom, region }
    );
    return result.affectedRows ? this.findById(id) : null;
  },

  async remove(id) {
    const [result] = await pool.execute("DELETE FROM cities WHERE id = :id", { id });
    return result.affectedRows > 0;
  }
};

