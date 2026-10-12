const express = require("express");
const cors = require("cors");

require("dotenv").config();

require("./config/db");

const authRoutes = require("./routes/authRoutes");

const app = express();
const testRoutes = require("./routes/testRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use(cors());



app.use(express.json());

/*
=========================================
TEST ROUTE
=========================================
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Aurelia Jewellery API is running",
  });
});

/*
=========================================
AUTH ROUTES
=========================================
*/

app.use(
  "/api/auth",
  authRoutes
);
app.use(
  "/api/test",
  testRoutes
);
app.use(
  "/api/users",
  userRoutes
);
app.use(
  "/api/products",
  productRoutes
);
app.use(
  "/api/orders",
  orderRoutes
);
app.use(
  "/api/admin",
  adminRoutes
);
app.use(
  "/api/categories",
  categoryRoutes
);
app.use("/api/dashboard", dashboardRoutes);
/*
=========================================
SERVER
=========================================
*/

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Aurelia backend running on http://localhost:${PORT}`
  );
});