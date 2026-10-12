const bcrypt = require("bcryptjs");

const User = require("../models/User");

// =========================================
// GET ALL USERS
// GET /api/users
// =========================================

async function getUsers(req, res) {
  try {
    const users = await User.findAll();

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "Get users error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
}

// =========================================
// GET USER BY ID
// GET /api/users/:id
// =========================================

async function getUser(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "Get user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
}

// =========================================
// CREATE USER
// POST /api/users
// =========================================

async function createUser(req, res) {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, password and role are required",
      });
    }

    const allowedRoles = [
      "admin",
      "staff",
      "user",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
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
      await User.findByEmail(
        normalizedEmail
      );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "Email is already registered",
      });
    }

    const roleId =
      await User.getRoleId(role);

    if (!roleId) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    const userId =
      await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        roleId,
      });

    return res.status(201).json({
      success: true,
      message:
        `${role} account created successfully`,
      user: {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        role,
      },
    });
  } catch (error) {
    console.error(
      "Create user error:",
      error
    );

    if (
      error.code === "ER_DUP_ENTRY"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Email is already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

// =========================================
// UPDATE USER
// PUT /api/users/:id
// =========================================

async function updateUser(req, res) {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      role,
      isActive,
    } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and role are required",
      });
    }

    const allowedRoles = [
      "admin",
      "staff",
      "user",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const existingUser =
      await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const emailUser =
      await User.findByEmail(
        normalizedEmail
      );

    if (
      emailUser &&
      Number(emailUser.id) !== Number(id)
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Email is already registered",
      });
    }

    const roleId =
      await User.getRoleId(role);

    if (!roleId) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    await User.update(id, {
      name: name.trim(),
      email: normalizedEmail,
      roleId,
      isActive:
        isActive === undefined
          ? existingUser.is_active
          : Boolean(isActive),
    });

    return res.status(200).json({
      success: true,
      message:
        "User updated successfully",
    });
  } catch (error) {
    console.error(
      "Update user error:",
      error
    );

    if (
      error.code === "ER_DUP_ENTRY"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Email is already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to update user",
    });
  }
}

// =========================================
// DEACTIVATE USER
// DELETE /api/users/:id
// =========================================

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const existingUser =
      await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!existingUser.is_active) {
      return res.status(400).json({
        success: false,
        message: "User is already inactive",
      });
    }

    await User.deactivate(id);

    return res.status(200).json({
      success: true,
      message:
        "User deactivated successfully",
    });
  } catch (error) {
    console.error(
      "Delete user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to deactivate user",
    });
  }
}

// =========================================
// ACTIVATE USER
// PATCH /api/users/:id/activate
// =========================================

async function activateUser(req, res) {
  try {
    const { id } = req.params;

    const existingUser =
      await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (existingUser.is_active) {
      return res.status(400).json({
        success: false,
        message: "User is already active",
      });
    }

    await User.activate(id);

    return res.status(200).json({
      success: true,
      message:
        "User activated successfully",
    });
  } catch (error) {
    console.error(
      "Activate user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to activate user",
    });
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  activateUser,
};