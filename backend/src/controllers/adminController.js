const db = require("../config/db");

/*
=========================================
ADMIN DASHBOARD
=========================================
*/

async function getDashboardStats(req, res) {
  try {
    console.log("Dashboard request from:", req.user);

    /*
    =========================================
    TOTAL PRODUCTS
    =========================================
    */

    const [productRows] = await db.execute(`
      SELECT COUNT(*) AS total
      FROM products
      WHERE is_active = 1
    `);

    /*
    =========================================
    TOTAL USERS
    =========================================
    */

    const [userRows] = await db.execute(`
      SELECT COUNT(*) AS total
      FROM users
    `);

    /*
    =========================================
    TOTAL ORDERS
    =========================================
    */

    const [orderRows] = await db.execute(`
      SELECT COUNT(*) AS total
      FROM orders
    `);

    /*
    =========================================
    PENDING ORDERS
    =========================================
    */

    const [pendingRows] = await db.execute(`
      SELECT COUNT(*) AS total
      FROM orders
      WHERE status = 'pending'
    `);

    /*
    =========================================
    TOTAL REVENUE
    =========================================
    */

    const [revenueRows] = await db.execute(`
      SELECT COALESCE(SUM(total_amount), 0) AS total
      FROM orders
      WHERE status != 'cancelled'
    `);

    /*
    =========================================
    LOW STOCK PRODUCTS
    =========================================

    Inventory is stored separately from products.

    quantity <= low_stock_threshold
    */

    const [lowStockRows] = await db.execute(`
      SELECT COUNT(*) AS total
      FROM inventory
      WHERE quantity <= low_stock_threshold
    `);

    /*
    =========================================
    RECENT ORDERS
    =========================================
    */

    const [recentOrders] = await db.execute(`
      SELECT
        o.id,
        o.user_id,
        o.total_amount,
        o.payment_method,
        o.status,
        o.created_at
      FROM orders o
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    /*
    =========================================
    LOW STOCK PRODUCT LIST
    =========================================
    */

    const [lowStockProducts] = await db.execute(`
      SELECT
        p.id,
        p.name,
        p.image_url,
        i.quantity,
        i.reserved_quantity,
        i.low_stock_threshold
      FROM inventory i
      JOIN products p
        ON p.id = i.product_id
      WHERE i.quantity <= i.low_stock_threshold
      ORDER BY i.quantity ASC
      LIMIT 10
    `);

    /*
    =========================================
    RESPONSE
    =========================================
    */

    return res.status(200).json({
      success: true,

      stats: {
        totalProducts: productRows[0].total,
        totalUsers: userRows[0].total,
        totalOrders: orderRows[0].total,
        pendingOrders: pendingRows[0].total,
        totalRevenue: revenueRows[0].total,
        lowStockProducts: lowStockRows[0].total,
      },

      recentOrders,

      lowStockProducts,
    });

  } catch (error) {
    console.error("=================================");
    console.error("DASHBOARD ERROR");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("SQL:", error.sql);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
      error: error.message,
      code: error.code,
    });
  }
}

module.exports = {
  getDashboardStats,
};