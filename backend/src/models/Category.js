const db = require("../config/db");

// =========================================
// GET ALL CATEGORIES
// =========================================

async function findAll() {
  const [rows] = await db.execute(`
    SELECT
      id,
      name,
      slug
    FROM categories
    ORDER BY name ASC
  `);

  return rows;
}

// =========================================
// GET CATEGORY BY ID
// =========================================

async function findById(id) {
  const [rows] = await db.execute(
    `
    SELECT
      id,
      name,
      slug
    FROM categories
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
}

// =========================================
// CREATE CATEGORY
// =========================================

async function create({ name, slug }) {
  const [result] = await db.execute(
    `
    INSERT INTO categories
    (name, slug)
    VALUES (?, ?)
    `,
    [name, slug]
  );

  return result.insertId;
}

// =========================================
// UPDATE CATEGORY
// =========================================

async function update(id, { name, slug }) {
  const [result] = await db.execute(
    `
    UPDATE categories
    SET
      name = ?,
      slug = ?
    WHERE id = ?
    `,
    [name, slug, id]
  );

  return result.affectedRows;
}

// =========================================
// DELETE CATEGORY
// =========================================

async function remove(id) {
  const [result] = await db.execute(
    `
    DELETE FROM categories
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};