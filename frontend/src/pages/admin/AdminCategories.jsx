
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  X,
} from "lucide-react";

import api from "../../api";
import "../AdminPages.css";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  // =========================================
  // LOAD CATEGORIES
  // =========================================

  const loadCategories = async () => {
    try {
      setLoading(true);

      const response = await api.get("/categories");

      console.log("Categories API response:", response.data);

      const data = response.data;

      if (Array.isArray(data)) {
        setCategories(data);
      } else if (Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else if (Array.isArray(data.data)) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);

      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // =========================================
  // FORM
  // =========================================

  const openAddForm = () => {
    setEditingCategory(null);

    setFormData({
      name: "",
      slug: "",
    });

    setShowForm(true);
  };

  const openEditForm = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name || "",
      slug: category.slug || "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCategory(null);

    setFormData({
      name: "",
      slug: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // ADD / UPDATE CATEGORY
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    try {
      if (editingCategory) {
        await api.put(
          `/categories/${editingCategory.id}`,
          formData
        );
      } else {
        await api.post(
          "/categories",
          formData
        );
      }

      closeForm();
      await loadCategories();
    } catch (error) {
      console.error("Category save failed:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save category"
      );
    }
  };

  // =========================================
  // DELETE CATEGORY
  // =========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/categories/${id}`);

      await loadCategories();
    } catch (error) {
      console.error("Category delete failed:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete category"
      );
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="admin-content-page">

      {/* HEADER */}

      <div className="admin-page-header">

        <div>
          <div className="admin-page-eyebrow">
            CATALOG
          </div>

          <h1 className="admin-page-title">
            Categories
          </h1>

          <p className="admin-page-description">
            Manage your jewellery collections and
            product categories.
          </p>
        </div>

        <div className="admin-header-actions">

          <button
            type="button"
            className="admin-secondary-button"
            onClick={loadCategories}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            type="button"
            className="admin-primary-button"
            onClick={openAddForm}
          >
            <Plus size={17} />
            Add Category
          </button>

        </div>

      </div>


      {/* FORM */}

      {showForm && (
        <div className="admin-form-card">

          <div className="admin-form-header">

            <div>
              <div className="admin-page-eyebrow">
                {editingCategory
                  ? "EDIT CATEGORY"
                  : "NEW CATEGORY"}
              </div>

              <h2>
                {editingCategory
                  ? "Edit Category"
                  : "Add Category"}
              </h2>
            </div>

            <button
              type="button"
              className="admin-close-button"
              onClick={closeForm}
            >
              <X size={18} />
            </button>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="admin-form-grid">

              <div className="admin-field">

                <label>
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rings"
                  required
                />

              </div>


              <div className="admin-field">

                <label>
                  Slug
                </label>

                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="e.g. rings"
                />

              </div>

            </div>


            <div className="admin-form-actions">

              <button
                type="button"
                className="admin-secondary-button"
                onClick={closeForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-primary-button"
              >
                {editingCategory
                  ? "Update Category"
                  : "Create Category"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* CATEGORY LIST */}

      <div className="admin-table-card">

        <div className="admin-table-header">

          <div>
            <div className="admin-page-eyebrow">
              COLLECTION MANAGEMENT
            </div>

            <h2>
              All Categories
            </h2>
          </div>

          <div className="admin-count">
            {categories.length} categories
          </div>

        </div>


        {loading ? (

          <div className="admin-empty-state">
            <RefreshCw size={22} />
            <p>Loading categories...</p>
          </div>

        ) : categories.length === 0 ? (

          <div className="admin-empty-state">

            <h3>
              No categories found
            </h3>

            <p>
              Add your first jewellery category
              to get started.
            </p>

            <button
              type="button"
              className="admin-primary-button"
              onClick={openAddForm}
            >
              <Plus size={16} />
              Add Category
            </button>

          </div>

        ) : (

          <div className="admin-category-list">

            {categories.map((category) => {

              const id =
                category.id ||
                category._id;

              const name =
                category.name ||
                category.category_name ||
                "Unnamed Category";

              const slug =
                category.slug ||
                name
                  .toLowerCase()
                  .replace(/\s+/g, "-");

              return (
                <div
                  className="admin-category-row"
                  key={id}
                >

                  <div className="admin-category-info">

                    <div className="admin-category-name">
                      {name}
                    </div>

                    <div className="admin-category-slug">
                      /{slug}
                    </div>

                  </div>


                  <div className="admin-category-actions">

                    <button
                      type="button"
                      className="admin-icon-button"
                      onClick={() =>
                        openEditForm(category)
                      }
                      title="Edit category"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      className="admin-icon-button admin-delete-button"
                      onClick={() =>
                        handleDelete(id)
                      }
                      title="Delete category"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminCategories;
