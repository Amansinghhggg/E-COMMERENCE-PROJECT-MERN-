import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../../redux/api/category";
import { useEffect, useState } from "react";
import AdminMenu from "./adminMenu";

export default function CategoryList() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryName, setCategoryName] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  const { data: categories, isLoading, isError } = useGetAllCategoriesQuery();
    const [createCategory] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  useEffect(() => {
    if (selectedCategory) {
      setEditCategoryName(selectedCategory.name || "");
    }
  }, [selectedCategory]);

  const handleOpenModal = (category) => {
    setSelectedCategory(category);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCategory(null);
    setEditCategoryName("");
  };

    const handleCreateCategory = async () => {
        if (categoryName.trim() === "") {
            toast.error("Category name cannot be empty.");
            return;
        }
        try {
            await createCategory({ name: categoryName }).unwrap();
            setCategoryName("");
            toast.success("Category created successfully.");
        } catch (error) {
            console.error("Failed to create category:", error);
            toast.error("Error creating category: " + (error.data?.message || error.message));
        }
    };

        const handleUpdateCategory = async () => {
          if (!selectedCategory) {
            return;
          }

          if (editCategoryName.trim() === "") {
            toast.error("Category name cannot be empty.");
            return;
          }

          try {
            await updateCategory({
              id: selectedCategory._id,
              name: editCategoryName,
            }).unwrap();
            toast.success("Category updated successfully.");
            handleCloseModal();
          } catch (error) {
            console.error("Failed to update category:", error);
            toast.error("Error updating category: " + (error.data?.message || error.message));
          }
        };

        const handleDeleteCategory = async () => {
          if (!selectedCategory) {
            return;
          }

          if (!window.confirm(`Delete ${selectedCategory.name}?`)) {
            return;
          }

          try {
            await deleteCategory(selectedCategory._id).unwrap();
            toast.success("Category deleted successfully.");
            handleCloseModal();
          } catch (error) {
            console.error("Failed to delete category:", error);
            toast.error("Error deleting category: " + (error.data?.message || error.message));
          }
        };

        if (isLoading) {
        return <Loader />;
    }

        if (isError) {
        return <div>Error loading categories.</div>;
    }

    return (
          <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Category List</h1>
            <AdminMenu />

            <div className="form-container mb-6 flex gap-2">
              <input
                type="text"
                placeholder="New Category Name"
                className="input-field border px-3 py-2 rounded w-full max-w-sm"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <button onClick={handleCreateCategory} className="btn bg-black text-white px-4 py-2 rounded">
                Add Category
              </button>
            </div>

            <div className="category-list flex flex-wrap gap-3">
              {(categories || []).map((category) => (
                <button
                  key={category._id}
                  className="m-2 p-4 border border-gray-300 hover:bg-gray-100 rounded"
                  onClick={() => handleOpenModal(category)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {openModal && selectedCategory && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                role="dialog"
                aria-modal="true"
                onClick={handleCloseModal}
              >
                <div
                  className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Edit Category</h2>
                    <button
                      type="button"
                      className="text-2xl leading-none text-gray-500 hover:text-black"
                      onClick={handleCloseModal}
                    >
                      &times;
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    Category: <span className="font-medium">{selectedCategory.name}</span>
                  </p>

                  <input
                    type="text"
                    className="w-full rounded border px-3 py-2 mb-4"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="rounded border px-4 py-2 hover:bg-gray-100"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                      onClick={handleDeleteCategory}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
                      onClick={handleUpdateCategory}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
}