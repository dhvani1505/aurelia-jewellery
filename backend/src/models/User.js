const db = require("../config/db");

const User = {
  // =========================================
  // FIND USER BY EMAIL
  // =========================================

  async findByEmail(email) {
    const [rows] = await db.execute(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.password,
        u.role_id,
        u.is_active,
        r.name AS role
      FROM users u
      JOIN roles r
        ON u.role_id = r.id
      WHERE u.email = ?
      LIMIT 1
      `,
      [email]
    );

    return rows[0];
  },

  // =========================================
  // FIND USER BY ID
  // =========================================

  async findById(id) {
    const [rows] = await db.execute(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.role_id,
        u.is_active,
        r.name AS role
      FROM users u
      JOIN roles r
        ON u.role_id = r.id
      WHERE u.id = ?
      LIMIT 1
      `,
      [id]
    );

    return rows[0];
  },

  // =========================================
  // GET ALL USERS
  // =========================================

  async findAll() {
    const [rows] = await db.execute(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.role_id,
        r.name AS role,
        u.is_active,
        u.created_at,
        u.updated_at
      FROM users u
      JOIN roles r
        ON u.role_id = r.id
      ORDER BY u.created_at DESC
      `
    );

    return rows;
  },

  // =========================================
  // CREATE USER
  // =========================================

  async create({
    name,
    email,
    password,
    roleId,
  }) {
    const [result] = await db.execute(
      `
      INSERT INTO users
      (
        name,
        email,
        password,
        role_id
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        name,
        email,
        password,
        roleId,
      ]
    );

    return result.insertId;
  },

  // =========================================
  // GET ROLE ID
  // =========================================

  async getRoleId(roleName) {
    const [rows] = await db.execute(
      `
      SELECT id
      FROM roles
      WHERE name = ?
      LIMIT 1
      `,
      [roleName]
    );

    return rows[0]?.id;
  },

  // =========================================
  // UPDATE USER
  // =========================================

  async update(
    id,
    {
      name,
      email,
      roleId,
      isActive,
    }
  ) {
    const [result] = await db.execute(
      `
      UPDATE users
      SET
        name = ?,
        email = ?,
        role_id = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        name,
        email,
        roleId,
        isActive,
        id,
      ]
    );

    return result.affectedRows;
  },

  // =========================================
  // DEACTIVATE USER
  // =========================================

  async deactivate(id) {
    const [result] = await db.execute(
      `
      UPDATE users
      SET is_active = 0
      WHERE id = ?
      `,
      [id]
    );

    return result.affectedRows;
  },

  // =========================================
  // ACTIVATE USER
  // =========================================

  async activate(id) {
    const [result] = await db.execute(
      `
      UPDATE users
      SET is_active = 1
      WHERE id = ?
      `,
      [id]
    );

    return result.affectedRows;
  },
};

module.exports = User;