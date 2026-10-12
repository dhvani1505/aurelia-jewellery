const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Name must contain at least 2 characters",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const existingUser =
      await User.findByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "Email is already registered",
      });
    }

    const userRoleId =
      await User.getRoleId("user");

    if (!userRoleId) {
      return res.status(500).json({
        success: false,
        message:
          "Default user role not found",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const userId = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      roleId: userRoleId,
    });

    return res.status(201).json({
      success: true,
      message:
        "Account created successfully",
      user: {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        role: "user",
      },
    });
  } catch (error) {
    console.error(
      "Register error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong",
    });
  }
}


/*
=========================================
LOGIN
=========================================
*/

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // Normalize email
    const normalizedEmail =
      email.trim().toLowerCase();

    // Find user
    const user =
      await User.findByEmail(
        normalizedEmail
      );

    // Don't reveal whether email exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // Check account status
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been disabled",
      });
    }

    // Compare password
    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        roleId: user.role_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong",
    });
  }
}


module.exports = {
  register,
  login,
};