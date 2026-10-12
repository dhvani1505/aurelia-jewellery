
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../../api";
import "../AdminPages.css";

const API_URL = "http://localhost:5000";

const initialForm = {
  categoryId: "",
  name: "",
  slug: "",
  description: "",
  material: "",
  price: "",
  comparePrice: "",
  imageUrl: "",
  badge: "",
  quantity: "0",
  lowStockThreshold: "5",
  isActive: true,
};

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================
  // LOAD CATEGORIES AND PRODUCT
  // =========================================

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [categoryResponse, productResponse] =
          await Promise.all([
            api.get("/categories"),
            fetch(`${API_URL}/api/products/${id}`),
          ]);

        if (!productResponse.ok) {
          throw new Error("Failed to load product.");
        }

        const categoryData = categoryResponse.data;

        let categoryList = [];

        if (Array.isArray(categoryData)) {
          categoryList = categoryData;
        } else if (Array.isArray(categoryData.categories)) {
          categoryList = categoryData.categories;
        } else if (Array.isArray(categoryData.data)) {
          categoryList = categoryData.data;
        }

        const productData = await productResponse.json();

        if (!productData.success || !productData.product) {
          throw new Error(
            productData.message || "Product not found."
          );
        }

        const product = productData.product;

        if (!cancelled) {
          setCategories(categoryList);

          setForm({
            categoryId: String(
              product.category_id ??
                product.categoryId ??
                ""
            ),
            name: product.name ?? "",
            slug: product.slug ?? "",
            description: product.description ?? "",
            material: product.material ?? "",
            price: String(product.price ?? ""),
            comparePrice: String(
              product.compare_price ??
                product.comparePrice ??
                ""
            ),
            imageUrl:
              product.image_url ??
              product.imageUrl ??
              "",
            badge: product.badge ?? "",
            quantity: String(product.quantity ?? 0),
            lowStockThreshold: String(
              product.low_stock_threshold ??
                product.lowStockThreshold ??
                5
            ),
            isActive: Boolean(
              product.is_active ??
                product.isActive ??
                true
            ),
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load product details."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // =========================================
  // HANDLE INPUT CHANGES
  // =========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================
  // UPDATE PRODUCT AND STOCK
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const token = localStorage.getItem("aurelia-token");

    if (!token) {
      setError("Please log in as an administrator first.");
      return;
    }

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/api/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            categoryId: Number(form.categoryId),
            name: form.name.trim(),
            slug: form.slug.trim(),
            description: form.description,
            material: form.material,
            price: Number(form.price),
            comparePrice:
              form.comparePrice === ""
                ? null
                : Number(form.comparePrice),
            imageUrl: form.imageUrl.trim(),
            badge: form.badge,
            isActive: form.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update product."
        );
      }

      // Update inventory using the existing API.

      const inventoryResponse = await fetch(
        `${API_URL}/api/products/${id}/inventory`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: Number(form.quantity),
          }),
        }
      );

      const inventoryData = await inventoryResponse.json();

      if (!inventoryResponse.ok || !inventoryData.success) {
        throw new Error(
          inventoryData.message ||
            "Product details saved, but stock update failed."
        );
      }

      setSuccess("Product updated successfully!");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // STYLES
  // =========================================

  const inputClass =
    "w-full border border-[#ded8cf] bg-white px-4 py-3 text-sm outline-none focus:border-[#171513]";

  // =========================================
  // LOADING STATE
  // =========================================

  if (loading) {
    return (
      <div className="admin-content-page">
        <p className="text-sm text-gray-500">
          Loading product details...
        </p>
      </div>
    );
  }

  // =========================================
  // EDIT PRODUCT FORM
  // =========================================

  return (
    <div className="admin-content-page">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="mb-5 flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to Products
        </button>

        <h1 className="admin-page-title">Edit Product</h1>

        <p className="admin-page-description">
          Update the product information and inventory.
        </p>
      </div>

      {error && (
        <div className="mb-5 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-6"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* PRODUCT NAME */}

          <div>
            <label className="mb-2 block text-sm">
              Product Name *
            </label>

            <input
              className={inputClass}
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* SLUG */}

          <div>
            <label className="mb-2 block text-sm">
              Slug *
            </label>

            <input
              className={inputClass}
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
            />
          </div>

          {/* CATEGORY DROPDOWN */}

          <div>
            <label className="mb-2 block text-sm">
              Category *
            </label>

            <select
              className={inputClass}
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select category
              </option>

              {categories.map((category) => {
                const categoryId = category.id ?? category._id;

                const categoryName =
                  category.name ??
                  category.category_name ??
                  "Unnamed Category";

                return (
                  <option
                    key={categoryId}
                    value={String(categoryId)}
                  >
                    {categoryName}
                  </option>
                );
              })}
            </select>

            {categories.length === 0 && (
              <p className="mt-1 text-xs text-red-600">
                No categories found. Please check your category API.
              </p>
            )}
          </div>

          {/* MATERIAL */}

          <div>
            <label className="mb-2 block text-sm">
              Material
            </label>

            <input
              className={inputClass}
              name="material"
              value={form.material}
              onChange={handleChange}
            />
          </div>

          {/* PRICE */}

          <div>
            <label className="mb-2 block text-sm">
              Price (₹) *
            </label>

            <input
              className={inputClass}
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          {/* COMPARE PRICE */}

          <div>
            <label className="mb-2 block text-sm">
              Compare Price (₹)
            </label>

            <input
              className={inputClass}
              name="comparePrice"
              type="number"
              min="0"
              step="0.01"
              value={form.comparePrice}
              onChange={handleChange}
            />
          </div>

          {/* IMAGE URL */}

          <div>
            <label className="mb-2 block text-sm">
              Image URL
            </label>

            <input
              className={inputClass}
              name="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>

          {/* BADGE */}

          <div>
            <label className="mb-2 block text-sm">
              Badge
            </label>

            <input
              className={inputClass}
              name="badge"
              value={form.badge}
              onChange={handleChange}
              placeholder="e.g. Bestseller"
            />
          </div>

          {/* STOCK QUANTITY */}

          <div>
            <label className="mb-2 block text-sm">
              Stock Quantity
            </label>

            <input
              className={inputClass}
              name="quantity"
              type="number"
              min="0"
              step="1"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </div>

          {/* LOW STOCK THRESHOLD */}

          <div>
            <label className="mb-2 block text-sm">
              Low Stock Threshold
            </label>

            <input
              className={inputClass}
              name="lowStockThreshold"
              type="number"
              min="0"
              step="1"
              value={form.lowStockThreshold}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="mb-2 block text-sm">
            Description
          </label>

          <textarea
            className={inputClass}
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* ACTIVE STATUS */}

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Product is active
        </label>

        {/* BUTTONS */}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || categories.length === 0}
            className="flex items-center gap-2 bg-[#171513] px-6 py-3 text-sm text-white hover:bg-[#37322d] disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Update Product"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="border border-[#ded8cf] px-6 py-3 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
