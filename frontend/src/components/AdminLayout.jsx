import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  Store,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../AuthContext";
import "./AdminLayout.css";

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-layout">

      {/* ================================
          SIDEBAR
      ================================= */}

      <aside className="admin-sidebar">

        {/* LOGO */}

        <Link to="/admin/dashboard" className="admin-logo">
          <div className="admin-logo-main">
            AURELIA
          </div>

          <div className="admin-logo-sub">
            FINE JEWELLERY
          </div>
        </Link>


        {/* ADMIN LABEL */}

        <div className="admin-section-label">
          ADMIN PANEL
        </div>


        {/* NAVIGATION */}

        <nav className="admin-sidebar-nav">

          <AdminNavLink
            to="/admin/dashboard"
            icon={<LayoutDashboard size={18} />}
            end
          >
            Dashboard
          </AdminNavLink>

          <AdminNavLink
            to="/admin/products"
            icon={<Package size={18} />}
          >
            Products
          </AdminNavLink>

          <AdminNavLink
            to="/admin/categories"
            icon={<Tags size={18} />}
          >
            Categories
          </AdminNavLink>

          <AdminNavLink
            to="/admin/orders"
            icon={<ShoppingBag size={18} />}
          >
            Orders
          </AdminNavLink>

          <AdminNavLink
            to="/admin/customers"
            icon={<Users size={18} />}
          >
            Customers
          </AdminNavLink>

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="admin-sidebar-bottom">

          <Link
            to="/"
            className="admin-sidebar-link"
          >
            <Store size={18} />
            <span>View Store</span>
          </Link>

          <button
            type="button"
            className="admin-sidebar-link admin-logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* ================================
          MAIN AREA
      ================================= */}

      <main className="admin-main">

        {/* TOP HEADER */}

        <header className="admin-topbar">

          <div>
            <div className="admin-topbar-label">
              AURELIA JEWELLERY
            </div>

            <div className="admin-topbar-title">
              Administration
            </div>
          </div>


          <div className="admin-user">

            <div className="admin-user-info">
              <span className="admin-user-name">
                {user?.name || "Aurelia Admin"}
              </span>

              <span className="admin-user-role">
                Administrator
              </span>
            </div>

            <div className="admin-user-avatar">
              {(user?.name || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

          </div>

        </header>


        {/* PAGE CONTENT */}

        <section className="admin-content">
          <Outlet />
        </section>

      </main>

    </div>
  );
}


/* =========================================
   SIDEBAR NAV LINK
========================================= */

function AdminNavLink({
  to,
  icon,
  children,
  end = false,
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `admin-sidebar-link ${
          isActive ? "active" : ""
        }`
      }
    >
      {icon}

      <span>{children}</span>

      <ChevronRight
        className="admin-nav-arrow"
        size={15}
      />
    </NavLink>
  );
}

export default AdminLayout;