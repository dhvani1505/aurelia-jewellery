
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../../api";
import "../AdminPages.css";
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

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
};

function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load category names from the database
  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        const response = await api.get("/categories");
        const data = response.data;

        let categoryList = [];

        if (Array.isArray(data)) {
          categoryList = data;
        } else if (Array.isArray(data.categories)) {
          categoryList = data.categories;
        } else if (Array.isArray(data.data)) {
          categoryList = data.data;
        }

        if (!cancelled) {
          setCategories(categoryList);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Failed to load categories."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingCategories(false);
        }
      }
    };

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "name") {
      setForm((previous) => ({
        ...previous,
        name: value,
        slug: value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      }));
    }
  };

  // Save product
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
      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
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
          quantity: Number(form.quantity),
          lowStockThreshold: Number(form.lowStockThreshold),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to save product."
        );
      }

      setSuccess("Product added successfully!");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full border border-[#ded8cf] bg-white px-4 py-3 text-sm outline-none focus:border-[#171513]";

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

        <h1 className="admin-page-title">Add New Product</h1>

        <p className="admin-page-description">
          Add a new jewellery product to your store.
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
          {/* Product Name */}
          <div>
            <label className="mb-2 block text-sm">
              Product Name *
            </label>

            <input
              className={inputClass}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Aurelia Solitaire Ring"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-2 block text-sm">
              Slug *
            </label>

            <input
              className={inputClass}
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="aurelia-solitaire-ring"
              required
            />
          </div>

          {/* Category Name Dropdown */}
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
              disabled={loadingCategories}
            >
              <option value="" disabled>
                {loadingCategories
                  ? "Loading categories..."
                  : "Select category"}
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
          </div>

          {/* Material */}
          <div>
            <label className="mb-2 block text-sm">
              Material
            </label>

            <input
              className={inputClass}
              name="material"
              value={form.material}
              onChange={handleChange}
              placeholder="e.g. 18K Gold"
            />
          </div>

          {/* Price */}
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
              placeholder="e.g. 12999"
              required
            />
          </div>

          {/* Compare Price */}
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
              placeholder="Original price (optional)"
            />
          </div>

          {/* Image URL */}
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
              placeholder="https://example.com/ring.jpg"
            />
          </div>

          {/* Badge */}
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

          {/* Stock Quantity */}
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

          {/* Low Stock Threshold */}
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

        {/* Description */}
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
            placeholder="Describe the jewellery product..."
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={
              saving ||
              loadingCategories ||
              categories.length === 0
            }
            className="flex items-center gap-2 bg-[#171513] px-6 py-3 text-sm text-white hover:bg-[#37322d] disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Product"}
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

export default AddProduct;
