
const db = require("../config/db");

// GET ADMIN DASHBOARD DATA
async function getDashboard(req, res) {
  try {
    // 1. Total products
    const [productRows] = await db.execute(`
      SELECT COUNT(*) AS totalProducts
      FROM products
      WHERE is_active = TRUE
    `);

    // 2. Total customers
    const [customerRows] = await db.execute(`
      SELECT COUNT(*) AS totalCustomers
      FROM users
    `);

    // 3. Total orders and pending orders
    const [orderRows] = await db.execute(`
      SELECT
        COUNT(*) AS totalOrders,
        COALESCE(
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END),
          0
        ) AS pendingOrders,
        COALESCE(
          SUM(total_amount),
          0
        ) AS totalRevenue
      FROM orders
    `);

    // 4. Low-stock products
    const [lowStockProducts] = await db.execute(`
      SELECT
        p.id,
        p.name,
        p.price,
        p.image_url,
        i.quantity,
        i.low_stock_threshold
      FROM products p
      INNER JOIN inventory i
        ON p.id = i.product_id
      WHERE p.is_active = TRUE
        AND i.quantity <= i.low_stock_threshold
      ORDER BY i.quantity ASC
    `);

    // 5. Recent orders
    const [recentOrders] = await db.execute(`
      SELECT
        o.id,
        o.user_id,
        o.total_amount,
        o.status,
        o.created_at,
        o.shipping_first_name,
        o.shipping_last_name,
        o.shipping_email
      FROM orders o
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts: Number(productRows[0].totalProducts),
        totalCustomers: Number(customerRows[0].totalCustomers),
        totalOrders: Number(orderRows[0].totalOrders),
        pendingOrders: Number(orderRows[0].pendingOrders),
        totalRevenue: Number(orderRows[0].totalRevenue),
        lowStockCount: lowStockProducts.length,
      },
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
      error: error.message,
    });
  }
}

module.exports = {
  getDashboard,
};
