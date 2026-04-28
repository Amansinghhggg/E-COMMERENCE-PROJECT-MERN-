import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../../redux/api/category";
import { useEffect, useState } from "react";

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

  const handleCreateCategory = async (e) => {
    e.preventDefault();

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
          <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0f172a] to-[#111111] px-4 py-8 text-white">
            <div className="mx-auto max-w-6xl">
              <div className="mb-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-sky-200/80">Admin</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Categories
                </h1>
                <p className="mt-2 text-sm leading-6 text-gray-300">
                  Create, edit, and remove categories from one clean workspace.
                </p>
              </div>

              <form onSubmit={handleCreateCategory} className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-sky-400 focus:bg-black/30"
                    placeholder="New category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                  <button className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">
                    Add Category
                  </button>
                </div>
              </form>

              <div className="mt-6 flex flex-wrap gap-3">
                {categories.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => handleOpenModal(c)}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 transition hover:border-sky-400/40 hover:bg-sky-500/15 hover:text-sky-100"
                  >
                    {c.name}
                  </button>
                ))}
              </div>

            {openModal && selectedCategory && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
                onClick={handleCloseModal}
              >
                <div
                  className="w-full max-w-md rounded-[1.75rem] border border-white/10 bg-[#0f172a] p-6 text-white shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-sky-200/80">Edit</p>
                      <h2 className="text-xl font-semibold">Category</h2>
                    </div>
                    <button
                      type="button"
                      className="rounded-full px-2 text-2xl leading-none text-gray-400 transition hover:bg-white/10 hover:text-white"
                      onClick={handleCloseModal}
                    >
                      &times;
                    </button>
                  </div>

                  <p className="mb-2 text-sm text-gray-400">
                    Category: <span className="font-medium">{selectedCategory.name}</span>
                  </p>

                  <input
                    type="text"
                    className="mb-4 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:bg-black/30"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />

                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400"
                      onClick={handleDeleteCategory}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
                      onClick={handleUpdateCategory}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        );
}