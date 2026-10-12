const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");

const {
  createOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

// =========================================
// USER
// =========================================

// Create order
router.post(
  "/",
  authenticateToken,
  createOrder
);

// Get logged-in user's orders
router.get(
  "/my-orders",
  authenticateToken,
  getMyOrders
);

// Get one logged-in user's order
router.get(
  "/my-orders/:id",
  authenticateToken,
  getMyOrderById
);

// =========================================
// STAFF / ADMIN
// =========================================

// Get all orders
router.get(
  "/",
  authenticateToken,
  permissionMiddleware("order.view"),
  getAllOrders
);

// Update order status
router.patch(
  "/:id/status",
  authenticateToken,
  permissionMiddleware("order.update"),
  updateOrderStatus
);

module.exports = router;