import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, loading } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError(
        "Email and password are required"
      );

      return;
    }

    try {
      await login(
        form.email,
        form.password
      );

      const redirect =
        location.state?.from || "/";

      navigate(redirect);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.35em] uppercase text-gray-500 mb-4">
            Aurelia Jewellery
          </p>

          <h1 className="font-serif text-4xl text-gray-900">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-3">
            Sign in to your Aurelia account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 p-8 shadow-sm"
        >

          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div className="mb-7">
            <label className="block text-sm text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 tracking-wider uppercase text-sm hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

          <div className="text-center mt-7 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-black underline underline-offset-4"
            >
              Create one
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;