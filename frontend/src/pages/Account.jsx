
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  ArrowRight,
  Heart,
  LogOut,
  Package,
  UserRound,
} from "lucide-react";

import "./Account.css";

function Account() {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="account-page account-login-page">

        <div className="account-login-card">

          <div className="account-brand-mark">
            A
          </div>

          <p className="account-eyebrow">
            AURELIA JEWELLERY
          </p>

          <h1>
            Please Sign In
          </h1>

          <p className="account-login-text">
            Sign in to access your account,
            orders and saved jewellery.
          </p>

          <Link
            to="/login"
            className="account-primary-button"
          >
            Sign In
            <ArrowRight size={16} />
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="account-page">

      <div className="account-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <header className="account-header">

          <div>

            <p className="account-eyebrow">
              AURELIA JEWELLERY
            </p>

            <h1>
              My Account
            </h1>

            <p className="account-header-text">
              Welcome back, {user.name}.
            </p>

          </div>

          <div className="account-avatar">
            {user.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

        </header>


        {/* =====================================
            MAIN GRID
        ===================================== */}

        <div className="account-grid">

          {/* PROFILE */}

          <section className="account-card account-profile-card">

            <div className="account-card-heading">

              <div className="account-card-icon">
                <UserRound size={18} />
              </div>

              <div>
                <p className="account-card-label">
                  PERSONAL DETAILS
                </p>

                <h2>
                  Profile
                </h2>
              </div>

            </div>


            <div className="account-profile-details">

              <div className="account-detail">

                <span>
                  Name
                </span>

                <strong>
                  {user.name || "-"}
                </strong>

              </div>


              <div className="account-detail">

                <span>
                  Email
                </span>

                <strong>
                  {user.email || "-"}
                </strong>

              </div>


              <div className="account-detail">

                <span>
                  Account Type
                </span>

                <strong className="account-role">
                  {user.role || "Customer"}
                </strong>

              </div>

            </div>

          </section>


          {/* ORDERS */}

          <Link
            to="/orders"
            className="account-action-card"
          >

            <div className="account-action-top">

              <div className="account-card-icon">
                <Package size={18} />
              </div>

              <ArrowRight
                className="account-action-arrow"
                size={18}
              />

            </div>

            <div>

              <p className="account-card-label">
                PURCHASE HISTORY
              </p>

              <h2>
                My Orders
              </h2>

              <p>
                View your orders and track
                their delivery status.
              </p>

            </div>

            <span className="account-action-link">
              View Orders
              <ArrowRight size={14} />
            </span>

          </Link>


          {/* WISHLIST */}

          <Link
            to="/wishlist"
            className="account-action-card"
          >

            <div className="account-action-top">

              <div className="account-card-icon">
                <Heart size={18} />
              </div>

              <ArrowRight
                className="account-action-arrow"
                size={18}
              />

            </div>

            <div>

              <p className="account-card-label">
                SAVED COLLECTION
              </p>

              <h2>
                Wishlist
              </h2>

              <p>
                Revisit the jewellery pieces
                you saved for later.
              </p>

            </div>

            <span className="account-action-link">
              View Wishlist
              <ArrowRight size={14} />
            </span>

          </Link>

        </div>


        {/* =====================================
            ACCOUNT FOOTER
        ===================================== */}

        <div className="account-footer">

          <div>
            <p>
              AURELIA JEWELLERY
            </p>

            <span>
              Crafted for moments that stay.
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="account-logout-button"
          >
            <LogOut size={16} />
            Sign Out
          </button>

        </div>

      </div>

    </div>
  );
}

export default Account;
