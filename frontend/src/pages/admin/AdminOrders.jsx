import { useEffect, useState } from "react";
import {
  RefreshCw,
  Package,
} from "lucide-react";

import api from "../../api";
import "../AdminPages.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // LOAD ORDERS
  // =========================================

  const loadOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/orders");

      const data = response.data;

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else if (Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error(
        "Failed to load orders:",
        error.response?.data || error
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // =========================================
  // UPDATE STATUS
  // =========================================

  const updateStatus = async (orderId, status) => {
    try {
      console.log(
        "Updating order:",
        orderId,
        "Status:",
        status
      );

      await api.patch(
        `/orders/${orderId}/status`,
        {
          status,
        }
      );

      await loadOrders();

    } catch (error) {
      console.error(
        "Failed to update order status:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    }
  };

  // =========================================
  // FORMAT PRICE
  // =========================================

  const formatPrice = (amount) => {
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="admin-page">

      {/* HEADER */}

      <div className="admin-page-header">

        <div>

          <p className="admin-eyebrow">
            AURELIA JEWELLERY
          </p>

          <h1 className="admin-page-title">
            Orders
          </h1>

          <p className="admin-page-subtitle">
            Manage customer orders and
            fulfilment status.
          </p>

        </div>

        <button
          type="button"
          className="admin-secondary-btn"
          onClick={loadOrders}
        >
          <RefreshCw size={15} />
          Refresh
        </button>

      </div>


      {/* TABLE */}

      <div className="admin-table-card">

        <div className="admin-table-header">

          <div>

            <p className="admin-eyebrow">
              ORDER MANAGEMENT
            </p>

            <h2>
              All Orders
            </h2>

          </div>

          <span className="admin-count">
            {orders.length} orders
          </span>

        </div>


        {loading ? (

          <div className="admin-empty">
            Loading orders...
          </div>

        ) : orders.length === 0 ? (

          <div className="admin-empty">

            <Package size={30} />

            <h3>
              No orders found
            </h3>

            <p>
              Customer orders will appear here.
            </p>

          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>Order</th>

                  <th>Customer</th>

                  <th>Date</th>

                  <th>Amount</th>

                  <th>Payment</th>

                  <th>Status</th>

                </tr>

              </thead>


              <tbody>

                {orders.map((order) => (

                  <tr key={order.id}>

                    <td>

                      <strong>
                        #{order.id}
                      </strong>

                    </td>


                    <td>

                      <div className="admin-customer-cell">

                        <strong>
                          {order.user?.name ||
                            order.customer?.name ||
                            order.name ||
                            "Customer"}
                        </strong>

                        <span>
                          {order.user?.email ||
                            order.customer?.email ||
                            order.email ||
                            "-"}
                        </span>

                      </div>

                    </td>


                    <td>
                      {formatDate(
                        order.createdAt ||
                        order.created_at ||
                        order.date
                      )}
                    </td>


                    <td>
  <strong>
    {formatPrice(
      order.total_amount ??
      order.totalAmount ??
      order.total ??
      order.amount ??
      0
    )}
  </strong>
</td>


                    <td>
                      {order.paymentMethod ||
                        order.payment_method ||
                        "COD"}
                    </td>


                    <td>

                      <select
                        className="admin-status-select"
                       value={
  order.status ||
  order.order_status ||
  order.orderStatus ||
  "processing"
}
                        onChange={(e) =>
                          updateStatus(
                            order.id,
                            e.target.value
                          )
                        }
                      >

                        <option value="pending">
                          Pending
                        </option>

                        <option value="processing">
                          Processing
                        </option>

                        <option value="shipped">
                          Shipped
                        </option>

                        <option value="delivered">
                          Delivered
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>

                      </select>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminOrders;