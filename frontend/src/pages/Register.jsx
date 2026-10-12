import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../AuthContext";

function Register() {
  const navigate = useNavigate();

  const { register, loading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError(
        "All fields are required"
      );

      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Passwords do not match"
      );

      return;
    }

    try {
      await register(
        form.name,
        form.email,
        form.password
      );

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
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
            Create Account
          </h1>

          <p className="text-gray-500 mt-3">
            Join the Aurelia collection
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

          {success && (
            <div className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm text-gray-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

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

          <div className="mb-5">
            <label className="block text-sm text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div className="mb-7">
            <label className="block text-sm text-gray-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 tracking-wider uppercase text-sm hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>

          <div className="text-center mt-7 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-black underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Register;