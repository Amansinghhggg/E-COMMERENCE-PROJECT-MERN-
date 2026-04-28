import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useGetAllCategoriesQuery } from "../../redux/api/category";
import { toast } from "react-toastify";

const AdminProductUpdate = () => {
  const params = useParams();
  const productId = params.id;

  const { data: productData } = useGetProductByIdQuery(productId, {
    skip: !productId,
  });

  console.log(productData);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock || "");

  // hook
  const navigate = useNavigate();

  // Fetch categories using RTK Query
  const { data: categories = [] } = useGetAllCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();

  // Define the update product mutation
  const [updateProduct] = useUpdateProductMutation();

  // Define the delete product mutation
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(
        typeof productData.category === "object"
          ? productData.category?._id || ""
          : productData.category || ""
      );
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
      setStock(productData.countInStock || "");
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Item added successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      setImage(res.image);
    } catch (err) {
      toast.error("Failed to upload image", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      // Update product using the RTK Query mutation
      const data = await updateProduct({ productId, formData });

      if (data?.error) {
        toast.error(data.error, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.success(`Product successfully updated`, {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.log(err);
      toast.error("Product update failed. Try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      const { data } = await deleteProduct(productId);
      toast.success(`"${data.name}" is deleted`, {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed. Try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0f172a] to-[#111111] px-4 py-8 text-white">
        <div className="mx-auto max-w-7xl">
          <main className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-200/80">Admin</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Update / Delete Product
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Edit product details, replace the image, or remove the product entirely.
              </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/20">
                  {image ? (
                    <img
                      src={image}
                      alt="product"
                      className="h-[22rem] w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-[22rem] items-center justify-center text-sm text-gray-400">
                      No image selected
                    </div>
                  )}
                </div>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 px-4 py-5 text-center transition hover:border-sky-400/40 hover:bg-sky-500/10">
                  <span className="text-sm font-semibold text-white">
                    {typeof image === "string" && image ? "Change image" : "Upload image"}
                  </span>
                  <span className="mt-1 text-xs text-gray-400">PNG, JPG, JPEG</span>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={uploadFileHandler}
                    className="hidden"
                  />
                </label>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-sky-400 focus:bg-black/30"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="price" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                      Price
                    </label>
                    <input
                      id="price"
                      type="number"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-sky-400 focus:bg-black/30"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="quantity" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                      Quantity
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-sky-400 focus:bg-black/30"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="brand" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                      Brand
                    </label>
                    <input
                      id="brand"
                      type="text"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-sky-400 focus:bg-black/30"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="6"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-sky-400 focus:bg-black/30"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="stock" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                      Count In Stock
                    </label>
                    <input
                      id="stock"
                      type="text"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-sky-400 focus:bg-black/30"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                      Category
                    </label>
                    <select
                      id="category"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:bg-black/30"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories?.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center justify-center rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-400"
                  >
                    Delete
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminProductUpdate;