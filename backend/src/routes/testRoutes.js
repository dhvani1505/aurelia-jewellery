const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");

const requirePermission = require("../middleware/permissionMiddleware");

const router = express.Router();


/*
=========================================
AUTHENTICATED USER TEST
=========================================
*/

router.get(
  "/profile",
  authenticateToken,
  (req, res) => {
    res.json({
      success: true,
      message: "You are authenticated",
      user: req.user,
    });
  }
);


/*
=========================================
PRODUCT CREATE TEST
=========================================
*/

router.post(
  "/product-test",
  authenticateToken,
  requirePermission("product.create"),
  (req, res) => {
    res.json({
      success: true,
      message:
        "You have permission to create products",
      user: req.user,
    });
  }
);


module.exports = router;