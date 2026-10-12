const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");

const productController = require("../controllers/productController");

// =========================================
// PUBLIC PRODUCT ROUTES
// =========================================

// GET /api/products
router.get(
  "/",
  productController.getProducts
);

// GET /api/products/:id
router.get(
  "/:id",
  productController.getProductById
);

// =========================================
// CREATE PRODUCT
// ADMIN
// =========================================

router.post(
  "/",
  authenticateToken,
  permissionMiddleware("product.create"),
  productController.createProduct
);

// =========================================
// UPDATE PRODUCT
// ADMIN
// =========================================

router.put(
  "/:id",
  authenticateToken,
  permissionMiddleware("product.update"),
  productController.updateProduct
);

// =========================================
// DELETE PRODUCT
// ADMIN
// =========================================

router.delete(
  "/:id",
  authenticateToken,
  permissionMiddleware("product.delete"),
  productController.deleteProduct
);

// =========================================
// UPDATE INVENTORY
// STAFF / ADMIN
// =========================================

router.patch(
  "/:id/inventory",
  authenticateToken,
  permissionMiddleware("inventory.update"),
  productController.updateInventory
);

module.exports = router;