const db = require("../config/db");


// =========================================
// GET ALL PRODUCTS
// =========================================

async function findAll() {
  const [rows] = await db.execute(`
    SELECT
      p.id,
      p.name,
      p.slug,
      p.description,
      p.material,
      p.price,
      p.compare_price,
      p.image_url,
      p.badge,
      p.is_active,

      c.id AS category_id,
      c.name AS category_name,
      c.slug AS category_slug,

      i.quantity,
      i.reserved_quantity,
      i.low_stock_threshold

    FROM products p

    JOIN categories c
      ON p.category_id = c.id

    LEFT JOIN inventory i
      ON p.id = i.product_id

    WHERE p.is_active = TRUE

    ORDER BY p.created_at DESC
  `);

  return rows;
}


// =========================================
// GET PRODUCT BY ID
// =========================================

async function findById(id) {
  const [rows] = await db.execute(
    `
    SELECT
      p.id,
      p.name,
      p.slug,
      p.description,
      p.material,
      p.price,
      p.compare_price,
      p.image_url,
      p.badge,
      p.is_active,

      c.id AS category_id,
      c.name AS category_name,
      c.slug AS category_slug,

      i.quantity,
      i.reserved_quantity,
      i.low_stock_threshold

    FROM products p

    JOIN categories c
      ON p.category_id = c.id

    LEFT JOIN inventory i
      ON p.id = i.product_id

    WHERE p.id = ?

    LIMIT 1
    `,
    [id]
  );

  return rows[0];
}


// =========================================
// CREATE PRODUCT
// =========================================

async function create(product) {
  const connection =
    await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] =
      await connection.execute(
        `
        INSERT INTO products
        (
          category_id,
          name,
          slug,
          description,
          material,
          price,
          compare_price,
          image_url,
          badge
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          product.categoryId,
          product.name,
          product.slug,
          product.description || null,
          product.material || null,
          product.price,
          product.comparePrice || null,
          product.imageUrl || null,
          product.badge || null,
        ]
      );

    const productId =
      result.insertId;

    await connection.execute(
      `
      INSERT INTO inventory
      (
        product_id,
        quantity,
        low_stock_threshold
      )
      VALUES (?, ?, ?)
      `,
      [
        productId,
        product.quantity || 0,
        product.lowStockThreshold || 5,
      ]
    );

    await connection.commit();

    return productId;

  } catch (error) {

    await connection.rollback();

    throw error;

  } finally {

    connection.release();
  }
}


// =========================================
// UPDATE PRODUCT
// =========================================

async function update(id, product) {
  const [result] =
    await db.execute(
      `
      UPDATE products
      SET
        category_id = ?,
        name = ?,
        slug = ?,
        description = ?,
        material = ?,
        price = ?,
        compare_price = ?,
        image_url = ?,
        badge = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        product.categoryId,
        product.name,
        product.slug,
        product.description || null,
        product.material || null,
        product.price,
        product.comparePrice || null,
        product.imageUrl || null,
        product.badge || null,
        product.isActive ?? true,
        id,
      ]
    );

  return result.affectedRows;
}


// =========================================
// DELETE PRODUCT
// =========================================

async function remove(id) {
  const [result] =
    await db.execute(
      `
      DELETE FROM products
      WHERE id = ?
      `,
      [id]
    );

  return result.affectedRows;
}


// =========================================
// UPDATE INVENTORY
// =========================================

async function updateInventory(
  productId,
  quantity
) {
  const [result] =
    await db.execute(
      `
      UPDATE inventory
      SET quantity = ?
      WHERE product_id = ?
      `,
      [
        quantity,
        productId,
      ]
    );

  return result.affectedRows;
}


module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  updateInventory,
};