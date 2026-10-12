const Order = require("../models/Order");

// =========================================
// CREATE ORDER
// POST /api/orders
// =========================================

async function createOrder(req, res) {
  try {
    const userId = req.user.id;

    const {
      items,
      shippingAddress,
      paymentMethod,
    } = req.body;

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    const orderId = await Order.create({
      userId,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || "cod",
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
}

// =========================================
// GET MY ORDERS
// GET /api/orders/my-orders
// =========================================

async function getMyOrders(req, res) {
  try {
    console.log("=================================");
    console.log("AUTH USER:", req.user);

    const userId = req.user.id;

    console.log("FETCHING ORDERS FOR USER ID:", userId);

    const orders = await Order.findByUser(userId);

    console.log("ORDERS FOUND:", orders);

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
}
// =========================================
// GET MY ORDER BY ID
// GET /api/orders/my-orders/:id
// =========================================

async function getMyOrderById(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await Order.findById(id, userId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
}

// =========================================
// GET ALL ORDERS
// GET /api/orders
// =========================================

async function getAllOrders(req, res) {
  try {
    const orders = await Order.findAll();

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
}

// =========================================
// UPDATE ORDER STATUS
// PATCH /api/orders/:id/status
// =========================================

async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const updated = await Order.updateStatus(
      id,
      status
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  updateOrderStatus,
};