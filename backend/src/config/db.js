
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 4000),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

 ssl: {
  minVersion: "TLSv1.2",
  rejectUnauthorized: true,
  ca: process.env.DB_CA_CERT?.replace(/\\n/g, "\n"),
},
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  let connection;

  try {
    connection = await pool.getConnection();

    console.log("TiDB/MySQL connected successfully");

    const [rows] = await connection.query(`
      SELECT
        DATABASE() AS database_name,
        @@hostname AS hostname,
        @@port AS port,
        USER() AS mysql_user
    `);

    console.log("DATABASE INFO:");
    console.table(rows);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  } finally {
    if (connection) connection.release();
  }
}

testConnection();

module.exports = pool;
