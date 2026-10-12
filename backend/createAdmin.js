require("dotenv").config();

const bcrypt = require("bcryptjs");

const db = require("./src/config/db");


async function createAdmin() {

  try {

    const name = "Aurelia Admin";

    const email = "admin@aurelia.com";

    const password = "Admin@12345";


    /*
    Get admin role
    */

    const [roles] = await db.execute(
      `
      SELECT id
      FROM roles
      WHERE name = 'admin'
      LIMIT 1
      `
    );


    if (roles.length === 0) {
      throw new Error(
        "Admin role not found"
      );
    }


    const roleId = roles[0].id;


    /*
    Check existing admin
    */

    const [existing] =
      await db.execute(
        `
        SELECT id
        FROM users
        WHERE email = ?
        LIMIT 1
        `,
        [email]
      );


    if (existing.length > 0) {

      console.log(
        "Admin already exists."
      );

      process.exit(0);
    }


    /*
    Hash password
    */

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );


    /*
    Create admin
    */

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
      "Admin created successfully."
    );

    console.log(
      "Email:",
      email
    );

    console.log(
      "Password:",
      password
    );


    process.exit(0);

  } catch (error) {

    console.error(
      "Failed to create admin:"
    );

    console.error(
      error.message
    );

    process.exit(1);
  }
}


createAdmin();