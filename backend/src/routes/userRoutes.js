const express = require("express");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  activateUser,
} = require("../controllers/userController");

const authenticateToken = require("../middleware/authMiddleware");

const requirePermission = require("../middleware/permissionMiddleware");

const router = express.Router();

// =========================================
// VIEW ALL USERS
// GET /api/users
// ADMIN
// =========================================

router.get(
  "/",
  authenticateToken,
  requirePermission("user.view"),
  getUsers
);

// =========================================
// VIEW SINGLE USER
// GET /api/users/:id
// ADMIN
// =========================================

router.get(
  "/:id",
  authenticateToken,
  requirePermission("user.view"),
  getUser
);

// =========================================
// CREATE USER / STAFF / ADMIN
// POST /api/users
// ADMIN
// =========================================

router.post(
  "/",
  authenticateToken,
  requirePermission("staff.manage"),
  createUser
);

// =========================================
// UPDATE USER
// PUT /api/users/:id
// ADMIN
// =========================================

router.put(
  "/:id",
  authenticateToken,
  requirePermission("user.update"),
  updateUser
);

// =========================================
// DEACTIVATE USER
// DELETE /api/users/:id
// ADMIN
// =========================================

router.delete(
  "/:id",
  authenticateToken,
  requirePermission("user.delete"),
  deleteUser
);

// =========================================
// ACTIVATE USER
// PATCH /api/users/:id/activate
// ADMIN
// =========================================

router.patch(
  "/:id/activate",
  authenticateToken,
  requirePermission("user.update"),
  activateUser
);

module.exports = router;