import {
  createContext,
  useContext,
  useState,
} from "react";

import api from "./api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser =
        localStorage.getItem("aurelia-user");

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(
      "aurelia-token"
    );
  });

  const [loading, setLoading] = useState(false);

  // =========================================
  // LOGIN
  // =========================================

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const data = response.data;

      if (!data.success || !data.token) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // Save token
      localStorage.setItem(
        "aurelia-token",
        data.token
      );

      // Save user
      localStorage.setItem(
        "aurelia-user",
        JSON.stringify(data.user)
      );

      // Update React state
      setToken(data.token);
      setUser(data.user);

      return data;
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data || error
      );

      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // REGISTER
  // =========================================

  const register = async (
    name,
    email,
    password
  ) => {
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
        }
      );

      const data = response.data;

      if (!data.success) {
        throw new Error(
          data.message ||
            "Registration failed"
        );
      }

      return data;
    } catch (error) {
      console.error(
        "Register error:",
        error.response?.data || error
      );

      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const logout = () => {
    localStorage.removeItem(
      "aurelia-token"
    );

    localStorage.removeItem(
      "aurelia-user"
    );

    setToken(null);
    setUser(null);
  };

  // =========================================
  // CONTEXT
  // =========================================

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}