const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/permissionMiddleware");

const {
  getDashboardStats,
} = require("../controllers/adminController");

/*
=========================================
ADMIN DASHBOARD
=========================================
*/

router.get(
  "/dashboard",
  authenticateToken,
  requirePermission("user.view"),
  getDashboardStats
);

module.exports = router;