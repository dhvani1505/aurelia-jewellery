const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/permissionMiddleware");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// =========================================
// PUBLIC
// =========================================

router.get(
  "/",
  getCategories
);

router.get(
  "/:id",
  getCategory
);

// =========================================
// ADMIN
// =========================================

router.post(
  "/",
  authenticateToken,
  requirePermission("category.manage"),
  createCategory
);

router.put(
  "/:id",
  authenticateToken,
  requirePermission("category.manage"),
  updateCategory
);

router.delete(
  "/:id",
  authenticateToken,
  requirePermission("category.manage"),
  deleteCategory
);

module.exports = router;