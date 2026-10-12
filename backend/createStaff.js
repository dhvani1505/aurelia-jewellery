require("dotenv").config();

const bcrypt = require("bcryptjs");
const db = require("./src/config/db");

async function createStaff() {
  try {
    const name = "Aurelia Staff";
    const email = "staff@aurelia.com";
    const password = "Staff@12345";

    // Get staff role
    const [roles] = await db.execute(
      `
      SELECT id
      FROM roles
      WHERE name = 'staff'
      LIMIT 1
      `
    );

    if (roles.length === 0) {
      throw new Error("Staff role not found");
    }

    const roleId = roles[0].id;

    // Check existing staff
    const [existing] = await db.execute(
      `
      SELECT id
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    );

    if (existing.length > 0) {
      console.log("Staff account already exists.");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // Create staff
    await db.execute(
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
        hashedPassword,
        roleId,
      ]
    );

    console.log(
      "Staff account created successfully."
    );

    console.log("Email:", email);
    console.log("Password:", password);

    process.exit(0);

  } catch (error) {
    console.error(
      "Failed to create staff:"
    );

    console.error(error.message);

    process.exit(1);
  }
}

createStaff();