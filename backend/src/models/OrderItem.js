// =========================================
// CREATE ORDER ITEM
// =========================================

async function createOrderItem(connection, item) {
  const [result] = await connection.execute(
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
      item.orderId,
      item.productId,
      item.productName,
      item.price,
      item.quantity,
      item.size || null,
      item.subtotal,
    ]
  );

  return result.insertId;
}

module.exports = {
  createOrderItem,
};