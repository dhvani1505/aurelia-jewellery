const db = require("../config/db");

// =========================================
// CREATE ORDER
// =========================================

async function create(orderData) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    let totalAmount = 0;
    const preparedItems = [];

    // =========================================
    // VALIDATE PRODUCTS + CALCULATE TOTAL
    // =========================================

    for (const item of orderData.items) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);

      if (!productId || !quantity || quantity <= 0) {
        throw new Error(
          "Invalid product or quantity"
        );
      }

      const [products] =
        await connection.execute(
          `
          SELECT
            id,
            name,
            price
          FROM products
          WHERE id = ?
            AND is_active = TRUE
          LIMIT 1
          `,
          [productId]
        );

      if (!products.length) {
        throw new Error(
          `Product ${productId} not found`
        );
      }

      const product = products[0];

      const subtotal =
        Number(product.price) * quantity;

      totalAmount += subtotal;

      preparedItems.push({
        productId,
        productName: product.name,
        price: Number(product.price),
        quantity,
        size: item.size || null,
        subtotal,
      });
    }

    // =========================================
    // SHIPPING ADDRESS
    // =========================================

    const shipping =
      orderData.shippingAddress || {};

    const firstName =
      shipping.firstName ||
      shipping.name ||
      "";

    const lastName =
      shipping.lastName || "";

    const email =
      shipping.email || "";

    const phone =
      shipping.phone || "";

    const address =
      shipping.address || "";

    const city =
      shipping.city || "";

    const state =
      shipping.state || "";

    const pincode =
      shipping.pincode || "";

    // =========================================
    // CREATE ORDER
    // =========================================

    const [orderResult] =
      await connection.execute(
        `
        INSERT INTO orders
        (
          user_id,
          total_amount,
          payment_method,
          status,

          shipping_first_name,
          shipping_last_name,
          shipping_email,
          shipping_phone,

          shipping_address,
          shipping_city,
          shipping_state,
          shipping_pincode
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          orderData.userId,
          totalAmount,
          orderData.paymentMethod || "cod",
          "pending",

          firstName,
          lastName,
          email,
          phone,

          address,
          city,
          state,
          pincode,
        ]
      );

    const orderId =
      orderResult.insertId;

    // =========================================
    // CREATE ORDER ITEMS
    // =========================================

    for (const item of preparedItems) {
      await connection.execute(
        `
        INSERT INTO order_items
        (
          order_id,
          product_id,
          product_name,
          price,
          quantity,
          size,
          subtotal
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          orderId,
          item.productId,
          item.productName,
          item.price,
          item.quantity,
          item.size,
          item.subtotal,
        ]
      );
    }

    // =========================================
    // COMMIT
    // =========================================

    await connection.commit();

    return orderId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// =========================================
// GET ORDER BY ID FOR USER
// =========================================

async function findById(
  orderId,
  userId
) {
  const [orders] =
    await db.execute(
      `
      SELECT
        id,
        user_id,
        total_amount,
        payment_method,
        status,

        shipping_first_name,
        shipping_last_name,
        shipping_email,
        shipping_phone,

        shipping_address,
        shipping_city,
        shipping_state,
        shipping_pincode,

        created_at,
        updated_at

      FROM orders

      WHERE id = ?
        AND user_id = ?

      LIMIT 1
      `,
      [orderId, userId]
    );

  if (!orders.length) {
    return null;
  }

  const order = orders[0];

  const [items] =
    await db.execute(
      `
      SELECT
        id,
        order_id,
        product_id,
        product_name,
        price,
        quantity,
        size,
        subtotal

      FROM order_items

      WHERE order_id = ?

      ORDER BY id ASC
      `,
      [orderId]
    );

  order.items = items;

  return order;
}

// =========================================
// GET USER ORDERS
// =========================================

async function findByUser(userId) {
  const [orders] =
    await db.execute(
      `
      SELECT
        id,
        total_amount,
        payment_method,
        status,
        created_at,
        updated_at

      FROM orders

      WHERE user_id = ?

      ORDER BY created_at DESC
      `,
      [userId]
    );

  return orders;
}

// =========================================
// GET ALL ORDERS
// =========================================

async function findAll() {
  const [orders] =
    await db.execute(
      `
      SELECT
        o.id,
        o.user_id,
        o.total_amount,
        o.payment_method,
        o.status,

        o.shipping_first_name,
        o.shipping_last_name,
        o.shipping_email,
        o.shipping_phone,

        o.shipping_address,
        o.shipping_city,
        o.shipping_state,
        o.shipping_pincode,

        o.created_at,
        o.updated_at,

        u.email AS user_email

      FROM orders o

      JOIN users u
        ON o.user_id = u.id

      ORDER BY o.created_at DESC
      `
    );

  return orders;
}

// =========================================
// UPDATE ORDER STATUS
// =========================================
async function updateStatus(orderId, status) {
  console.log("ORDER ID:", orderId);
  console.log("STATUS:", status);

  const [result] = await db.execute(
    `
    UPDATE orders
    SET status = ?
    WHERE id = ?
    `,
    [status, orderId]
  );

  console.log("AFFECTED ROWS:", result.affectedRows);

  const [rows] = await db.execute(
    `
    SELECT id, status
    FROM orders
    WHERE id = ?
    `,
    [orderId]
  );

  console.log("AFTER UPDATE:", rows);

  return result.affectedRows;
}

module.exports = {
  create,
  findById,
  findByUser,
  findAll,
  updateStatus,
};