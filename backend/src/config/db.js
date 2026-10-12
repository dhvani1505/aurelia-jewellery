const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL connected successfully");

    const [rows] = await connection.query(`
      SELECT
        DATABASE() AS database_name,
        @@hostname AS hostname,
        @@port AS port,
        USER() AS mysql_user
    `);

    console.log("DATABASE INFO:");
    console.table(rows);

    connection.release();
  } catch (error) {
    console.error("MySQL connection failed:");
    console.error(error.message);
  }
}
testConnection();

module.exports = pool;