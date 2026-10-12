const Category = require("../models/Category");

// =========================================
// GET CATEGORIES
// =========================================

async function getCategories(req, res) {
  try {
    const categories = await Category.findAll();

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
}

// =========================================
// GET CATEGORY
// =========================================

async function getCategory(req, res) {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get category error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
}

// =========================================
// CREATE CATEGORY
// =========================================

async function createCategory(req, res) {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const categoryId = await Category.create({
      name: name.trim(),
      slug: slug.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      categoryId,
    });
  } catch (error) {
    console.error("Create category error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Category name or slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
}

// =========================================
// UPDATE CATEGORY
// =========================================

async function updateCategory(req, res) {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const existing = await Category.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await Category.update(req.params.id, {
      name: name.trim(),
      slug: slug.trim(),
    });

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Update category error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Category name or slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
}

// =========================================
// DELETE CATEGORY
// =========================================

async function deleteCategory(req, res) {
  try {
    const existing = await Category.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await Category.remove(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        success: false,
        message:
          "Cannot delete category because products are using it",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
}

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};