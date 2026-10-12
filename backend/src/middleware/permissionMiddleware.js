const db = require("../config/db");

function requirePermission(permissionName) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const [rows] = await db.execute(
        `
        SELECT p.id
        FROM role_permissions rp
        JOIN permissions p
          ON p.id = rp.permission_id
        WHERE rp.role_id = ?
        AND p.name = ?
        LIMIT 1
        `,
        [
          req.user.roleId,
          permissionName,
        ]
      );

      if (rows.length === 0) {
        return res.status(403).json({
          success: false,
          message:
            "You do not have permission to perform this action",
        });
      }

      next();
    } catch (error) {
      console.error(
        "Permission check error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Permission check failed",
      });
    }
  };
}

module.exports = requirePermission;