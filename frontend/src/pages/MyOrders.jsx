import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import api from "../api";

function MyOrders() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: "/orders" },
      });

      return;
    }

    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/orders/my-orders"
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
            "Failed to fetch orders"
        );
      }

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error(
        "Fetch orders error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <p className="text-sm tracking-[0.2em] uppercase text-gray-500">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4] px-6 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.35em] uppercase text-[#b08d57] mb-3">
            Aurelia Jewellery
          </p>

          <h1 className="font-serif text-4xl text-gray-900">
            My Orders
          </h1>

          <p className="text-gray-500 mt-3">
            View your recent Aurelia orders.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* No orders */}
        {!error && orders.length === 0 && (
          <div className="bg-white border border-gray-200 p-12 text-center">
            <h2 className="font-serif text-2xl mb-3">
              No orders yet
            </h2>

            <p className="text-gray-500 mb-7">
              Your jewellery orders will appear here.
            </p>

            <Link
              to="/shop"
              className="inline-block bg-black text-white px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-gray-800 transition"
            >
              Explore Jewellery
            </Link>
          </div>
        )}

        {/* Orders */}
        {orders.length > 0 && (
          <div className="space-y-5">

            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-white border border-gray-200 p-6 hover:border-[#b08d57] transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-2">
                      Order #{order.id}
                    </p>

                    <p className="text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-1">
                      Status
                    </p>

                    <span className="text-sm capitalize">
                      {order.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-1">
                      Payment
                    </p>

                    <span className="text-sm uppercase">
                      {order.payment_method}
                    </span>
                  </div>

                  <div className="md:text-right">
                    <p className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-1">
                      Total
                    </p>

                    <p className="font-serif text-xl">
                      {formatPrice(
                        order.total_amount
                      )}
                    </p>
                  </div>

                </div>
              </Link>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;