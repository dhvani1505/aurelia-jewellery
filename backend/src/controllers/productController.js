const Product = require("../models/Product");


// =========================================
// GET ALL PRODUCTS
// GET /api/products
// =========================================

async function getProducts(req, res) {
  try {
    const products = await Product.findAll();

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
}


// =========================================
// GET PRODUCT BY ID
// GET /api/products/:id
// =========================================

async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    console.error(
      "Get product error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
}


// =========================================
// CREATE PRODUCT
// POST /api/products
// =========================================

async function createProduct(req, res) {
  try {
    const {
      categoryId,
      name,
      slug,
      description,
      material,
      price,
      comparePrice,
      imageUrl,
      badge,
      quantity,
      lowStockThreshold,
    } = req.body;


    if (
      !categoryId ||
      !name ||
      !slug ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Category, name, slug and price are required",
      });
    }


    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Price cannot be negative",
      });
    }


    const productId =
      await Product.create({
        categoryId,
        name: name.trim(),
        slug: slug.trim(),
        description,
        material,
        price: Number(price),
        comparePrice:
          comparePrice !== undefined
            ? Number(comparePrice)
            : null,
        imageUrl,
        badge,
        quantity:
          quantity !== undefined
            ? Number(quantity)
            : 0,
        lowStockThreshold:
          lowStockThreshold !== undefined
            ? Number(lowStockThreshold)
            : 5,
      });


    return res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      productId,
    });

  } catch (error) {
    console.error(
      "Create product error:",
      error
    );

    if (
      error.code === "ER_DUP_ENTRY"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "A product with this slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to create product",
    });
  }
}


// =========================================
// UPDATE PRODUCT
// PUT /api/products/:id
// =========================================

async function updateProduct(req, res) {
  try {
    const { id } = req.params;

    const {
      categoryId,
      name,
      slug,
      description,
      material,
      price,
      comparePrice,
      imageUrl,
      badge,
      isActive,
    } = req.body;


    if (
      !categoryId ||
      !name ||
      !slug ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Category, name, slug and price are required",
      });
    }


    const existingProduct =
      await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }


    await Product.update(id, {
      categoryId,
      name: name.trim(),
      slug: slug.trim(),
      description,
      material,
      price: Number(price),
      comparePrice:
        comparePrice !== undefined
          ? Number(comparePrice)
          : null,
      imageUrl,
      badge,
      isActive:
        isActive ?? true,
    });


    return res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
    });

  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    if (
      error.code === "ER_DUP_ENTRY"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "A product with this slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to update product",
    });
  }
}


// =========================================
// DELETE PRODUCT
// DELETE /api/products/:id
// =========================================

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const existingProduct =
      await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }


    await Product.remove(id);


    return res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete product",
    });
  }
}


// =========================================
// UPDATE INVENTORY
// PATCH /api/products/:id/inventory
// =========================================

async function updateInventory(req, res) {
  try {
    const { id } = req.params;

    const { quantity } = req.body;


    if (
      quantity === undefined ||
      Number(quantity) < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid quantity is required",
      });
    }


    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }


    const updated =
      await Product.updateInventory(
        id,
        Number(quantity)
      );


    if (!updated) {
      return res.status(404).json({
        success: false,
        message:
          "Inventory record not found",
      });
    }


    return res.status(200).json({
      success: true,
      message:
        "Inventory updated successfully",
    });

  } catch (error) {
    console.error(
      "Update inventory error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update inventory",
    });
  }
}


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateInventory,
};