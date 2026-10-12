
import { useEffect, useState } from "react";
import { RefreshCw, Users } from "lucide-react";

import api from "../../api";
import "../AdminPages.css";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // LOAD USERS / CUSTOMERS
  // =========================================

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users");

      const data = response.data;

      if (Array.isArray(data)) {
        setCustomers(data);
      } else if (Array.isArray(data.users)) {
        setCustomers(data.users);
      } else if (Array.isArray(data.customers)) {
        setCustomers(data.customers);
      } else if (Array.isArray(data.data)) {
        setCustomers(data.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error(
        "Failed to load customers:",
        error.response?.data || error
      );

      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
      return "-";
    }

    return formattedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================
  // FORMAT STATUS
  // =========================================

  const formatStatus = (isActive) => {
    return Number(isActive) === 1 ? "Active" : "Inactive";
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="admin-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="admin-page-header">

        <div>
          <p className="admin-eyebrow">
            AURELIA JEWELLERY
          </p>

          <h1 className="admin-page-title">
            Customers
          </h1>

          <p className="admin-page-subtitle">
            View registered users and their account information.
          </p>
        </div>

        <button
          type="button"
          className="admin-secondary-btn"
          onClick={loadCustomers}
        >
          <RefreshCw size={15} />
          Refresh
        </button>

      </div>


      {/* =========================================
          CUSTOMER TABLE
      ========================================= */}

      <div className="admin-table-card">

        {/* TABLE HEADER */}

        <div className="admin-table-header">

          <div>
            <p className="admin-eyebrow">
              USER MANAGEMENT
            </p>

            <h2>
              All Users
            </h2>
          </div>

          <span className="admin-count">
            {customers.length} users
          </span>

        </div>


        {/* =========================================
            LOADING
        ========================================= */}

        {loading ? (

          <div className="admin-empty">
            Loading users...
          </div>

        ) : customers.length === 0 ? (

          /* =========================================
             NO USERS
          ========================================= */

          <div className="admin-empty">

            <Users size={30} />

            <h3>
              No users found
            </h3>

            <p>
              Registered users will appear here.
            </p>

          </div>

        ) : (

          /* =========================================
             USERS TABLE
          ========================================= */

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Role ID
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Created
                  </th>

                  <th>
                    Updated
                  </th>

                </tr>

              </thead>


              <tbody>

                {customers.map((customer) => (

                  <tr
                    key={customer.id}
                  >

                    {/* ID */}

                    <td>
                      <strong>
                        #{customer.id}
                      </strong>
                    </td>


                    {/* NAME */}

                    <td>

                      <div className="admin-customer-cell">

                        <strong>
                          {customer.name ||
                            "Unnamed User"}
                        </strong>

                      </div>

                    </td>


                    {/* EMAIL */}

                    <td>
                      {customer.email || "-"}
                    </td>


                    {/* ROLE ID */}

                    <td>
                      {customer.role_id ?? "-"}
                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={
                          Number(customer.is_active) === 1
                            ? "admin-role admin-role-admin"
                            : "admin-role"
                        }
                      >
                        {formatStatus(
                          customer.is_active
                        )}
                      </span>

                    </td>


                    {/* CREATED */}

                    <td>
                      {formatDate(
                        customer.created_at
                      )}
                    </td>


                    {/* UPDATED */}

                    <td>
                      {formatDate(
                        customer.updated_at
                      )}
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

export default AdminCustomers;
