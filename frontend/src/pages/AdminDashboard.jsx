
import { useEffect, useState } from "react";
import {
  Package,
  Users,
  ShoppingBag,
  Clock,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Store,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./AdminPages.css";

const API_URL = "http://localhost:5000";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    lowStock: 0,
    recentOrders: [],
    lowStockProducts: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // LOAD DASHBOARD DATA FROM DATABASE
  // =========================================

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("aurelia-token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(`${API_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || "Unable to load dashboard data."
        );
      }

      const result = data.dashboard ?? data.data ?? data;
      const stats = result.stats ?? result.statistics ?? result;

      setDashboard({
        totalProducts: Number(
          stats.totalProducts ?? stats.total_products ?? 0
        ),

        totalCustomers: Number(
          stats.totalCustomers ??
          stats.totalCustomersCount ??
          stats.total_customers ??
          0
        ),

        totalOrders: Number(
          stats.totalOrders ?? stats.total_orders ?? 0
        ),

        pendingOrders: Number(
          stats.pendingOrders ?? stats.pending_orders ?? 0
        ),

        totalRevenue: Number(
          stats.totalRevenue ?? stats.total_revenue ?? 0
        ),

        lowStock: Number(
          stats.lowStock ??
          stats.lowStockCount ??
          stats.low_stock ??
          0
        ),

        recentOrders: Array.isArray(result.recentOrders)
          ? result.recentOrders
          : Array.isArray(result.recent_orders)
          ? result.recent_orders
          : [],

        lowStockProducts: Array.isArray(result.lowStockProducts)
          ? result.lowStockProducts
          : Array.isArray(result.low_stock_products)
          ? result.low_stock_products
          : [],
      });
    } catch (err) {
      setError(
        err.message || "Something went wrong while loading the dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // =========================================
  // FORMAT CURRENCY AND DATE
  // =========================================

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getCustomerName = (order) => {
    const fullName = [
      order.shipping_first_name,
      order.shipping_last_name,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      order.customer_name ||
      order.customerName ||
      order.user_name ||
      fullName ||
      order.shipping_email ||
      "Customer"
    );
  };

  // =========================================
  // DASHBOARD STATISTICS
  // =========================================

  const stats = [
    {
      title: "Total Products",
      value: dashboard.totalProducts,
      icon: <Package size={19} />,
      link: "/admin/products",
    },
    {
      title: "Total Customers",
      value: dashboard.totalCustomers,
      icon: <Users size={19} />,
      link: "/admin/customers",
    },
    {
      title: "Total Orders",
      value: dashboard.totalOrders,
      icon: <ShoppingBag size={19} />,
      link: "/admin/orders",
    },
    {
      title: "Pending Orders",
      value: dashboard.pendingOrders,
      icon: <Clock size={19} />,
      link: "/admin/orders",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(dashboard.totalRevenue),
      icon: <IndianRupee size={19} />,
      link: "/admin/orders",
    },
    {
      title: "Low Stock",
      value: dashboard.lowStock,
      icon: <AlertTriangle size={19} />,
      link: "/admin/products",
    },
  ];

  // =========================================
  // DASHBOARD CONTENT
  // Navbar comes from AdminLayout.jsx
  // =========================================

  return (
    <div className="admin-dashboard">
      <div className="dashboard-inner">
        {/* PAGE TITLE */}

        <div className="admin-page-header">
          <div>
            <div className="admin-page-eyebrow">
              OVERVIEW
            </div>

            <h1 className="admin-page-title">
              Dashboard
            </h1>

            <p className="admin-page-description">
              Monitor your Aurelia jewellery store.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="dashboard-refresh"
          >
            <RefreshCw
              size={15}
              className={loading ? "dashboard-spinning" : ""}
            />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* ERROR MESSAGE */}

        {error && (
          <div className="dashboard-error">
            <p>{error}</p>

            <button type="button" onClick={loadDashboard}>
              Try Again
            </button>
          </div>
        )}

        {/* STATISTICS */}

        <div className="admin-stats-grid">
          {stats.map((stat) => (
            <Link
              key={stat.title}
              to={stat.link}
              className="admin-stat-card"
            >
              <div className="admin-stat-top">
                <span className="admin-stat-label">
                  {stat.title}
                </span>

                <span className="admin-stat-icon">
                  {stat.icon}
                </span>
              </div>

              <div className="admin-stat-value">
                {loading ? "—" : stat.value}
              </div>

              <div className="admin-stat-manage">
                Manage
                <ArrowRight size={13} />
              </div>
            </Link>
          ))}
        </div>

        {/* RECENT ORDERS AND INVENTORY */}

        <div className="admin-panels">
          {/* RECENT ORDERS */}

          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <div className="admin-panel-eyebrow">
                  ORDERS
                </div>

                <h2 className="admin-panel-title">
                  Recent Orders
                </h2>
              </div>

              <Link
                to="/admin/orders"
                className="admin-panel-link"
              >
                View All
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="admin-panel-body">
              {loading ? (
                <p className="dashboard-empty">
                  Loading recent orders...
                </p>
              ) : dashboard.recentOrders.length === 0 ? (
                <p className="dashboard-empty">
                  No recent orders found.
                </p>
              ) : (
                <div className="dashboard-order-list">
                  {dashboard.recentOrders.slice(0, 5).map(
                    (order, index) => {
                      const orderId =
                        order.id ?? order.order_id ?? index + 1;

                      const status = order.status ?? "Pending";

                      return (
                        <Link
                          key={orderId}
                          to="/admin/orders"
                          className="dashboard-order"
                        >
                          <div>
                            <strong>
                              Order #{orderId}
                            </strong>

                            <p>{getCustomerName(order)}</p>

                            <small>
                              {formatDate(
                                order.created_at ??
                                order.createdAt ??
                                order.order_date
                              )}
                            </small>
                          </div>

                          <div className="dashboard-order-right">
                            <strong>
                              {formatCurrency(
                                order.total_amount ??
                                order.totalAmount ??
                                order.total ??
                                0
                              )}
                            </strong>

                            <span
                              className={`dashboard-status ${String(
                                status
                              ).toLowerCase()}`}
                            >
                              {status}
                            </span>
                          </div>
                        </Link>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </div>

          {/* LOW STOCK */}

          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <div className="admin-panel-eyebrow">
                  INVENTORY
                </div>

                <h2 className="admin-panel-title">
                  Low Stock
                </h2>
              </div>

              <Link
                to="/admin/products"
                className="admin-panel-link"
              >
                Manage
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="admin-panel-body">
              {loading ? (
                <p className="dashboard-empty">
                  Checking inventory...
                </p>
              ) : dashboard.lowStockProducts.length === 0 ? (
                <div className="inventory-empty">
                  <AlertTriangle size={20} />

                  <p>
                    {dashboard.lowStock === 0
                      ? "No low-stock products reported."
                      : `${dashboard.lowStock} products need attention. Open Products to review inventory.`}
                  </p>
                </div>
              ) : (
                <div className="dashboard-stock-list">
                  {dashboard.lowStockProducts
                    .slice(0, 5)
                    .map((product) => (
                      <div
                        key={product.id ?? product.product_id}
                        className="dashboard-stock-item"
                      >
                        <div>
                          <strong>
                            {product.name ?? product.product_name}
                          </strong>

                          <small>
                            Stock: {product.quantity ?? 0}
                          </small>
                        </div>

                        <AlertTriangle size={17} />
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* VIEW STORE */}

        <div className="dashboard-store-link">
          <Link to="/">
            <Store size={16} />
            View Store
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* DASHBOARD-SPECIFIC STYLES */}

      <style>{`
        .dashboard-inner {
          width: 100%;
          box-sizing: border-box;
        }

        .dashboard-refresh {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 38px;
          padding: 0 12px;
          border: 1px solid #ddd7cd;
          background: #fff;
          color: #171513;
          font-size: 12px;
          cursor: pointer;
        }

        .dashboard-refresh:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .dashboard-spinning {
          animation: dashboard-spin 1s linear infinite;
        }

        @keyframes dashboard-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .dashboard-error {
          margin-bottom: 20px;
          padding: 14px;
          background: #fff1f0;
          border: 1px solid #f1c4c0;
          color: #8b2922;
          font-size: 13px;
        }

        .dashboard-error p {
          margin: 0;
        }

        .dashboard-error button {
          margin-top: 8px;
          padding: 0;
          border: none;
          background: transparent;
          color: inherit;
          text-decoration: underline;
          cursor: pointer;
        }

        .dashboard-empty {
          color: #777168;
          font-size: 12px;
        }

        .dashboard-order-list,
        .dashboard-stock-list {
          display: flex;
          flex-direction: column;
        }

        .dashboard-order {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid #ebe7df;
          color: inherit;
          text-decoration: none;
        }

        .dashboard-order:last-child,
        .dashboard-stock-item:last-child {
          border-bottom: none;
        }

        .dashboard-order strong,
        .dashboard-stock-item strong {
          font-size: 12px;
          color: #171513;
        }

        .dashboard-order p {
          margin: 5px 0;
          font-size: 11px;
          color: #6f675d;
        }

        .dashboard-order small,
        .dashboard-stock-item small {
          display: block;
          margin-top: 5px;
          font-size: 10px;
          color: #8c857a;
        }

        .dashboard-order-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          flex-shrink: 0;
        }

        .dashboard-status {
          padding: 5px 8px;
          background: #f3eee5;
          color: #98743e;
          font-size: 9px;
          text-transform: uppercase;
        }

        .dashboard-status.completed,
        .dashboard-status.delivered {
          background: #edf3ed;
          color: #527052;
        }

        .dashboard-status.cancelled {
          background: #f5eaea;
          color: #985858;
        }

        .dashboard-stock-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 13px 0;
          border-bottom: 1px solid #ebe7df;
        }

        .dashboard-stock-item svg {
          color: #b08d57;
          flex-shrink: 0;
        }

        .dashboard-store-link {
          margin-top: 20px;
        }

        .dashboard-store-link a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #6f675d;
          font-size: 12px;
          text-decoration: none;
        }

        .dashboard-store-link a:hover {
          color: #b08d57;
        }

        @media (max-width: 700px) {
          .dashboard-order {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
