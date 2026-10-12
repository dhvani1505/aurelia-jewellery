
const express = require("express");
const router = express.Router();

const { getDashboard } = require("../controllers/dashboardController");

// Add authentication/permission middleware here if your existing
// admin routes require it. The dashboard should be admin-only.
router.get("/", getDashboard);

module.exports = router;
