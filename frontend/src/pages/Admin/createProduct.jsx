import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useGetAllCategoriesQuery } from "../../redux/api/category";
import { toast } from "react-toastify";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useGetAllCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(` Product ${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0f172a] to-[#111111] px-4 py-8 text-white">
  <div className="mx-auto max-w-5xl">

    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">

      {/* HEADER */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-200/80">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Create Product</h1>
        <p className="mt-2 text-sm text-gray-300">
          Add a new product to your store
        </p>
      </div>

      {/* IMAGE UPLOAD */}
      <div className="mb-6">
        <label className="mb-2 block text-sm text-gray-300">
          Product Image
        </label>

        <div className="flex items-center gap-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              className="w-24 h-24 object-cover rounded-lg border border-white/10"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs">
              Preview
            </div>
          )}

          <input
            type="file"
            onChange={uploadFileHandler}
            className="text-sm text-gray-300"
          />
        </div>
      </div>

      {/* BASIC INFO */}
      <div className="grid md:grid-cols-2 gap-4">

        <div>
          <label className="label">Product Name</label>
          <input className="input" value={name} onChange={(e)=>setName(e.target.value)} />
        </div>

        <div>
          <label className="label">Price</label>
          <input type="number" className="input" value={price} onChange={(e)=>setPrice(e.target.value)} />
        </div>

        <div>
          <label className="label">Quantity</label>
          <input className="input" value={quantity} onChange={(e)=>setQuantity(e.target.value)} />
        </div>

        <div>
          <label className="label">Brand</label>
          <input className="input" value={brand} onChange={(e)=>setBrand(e.target.value)} />
        </div>

      </div>

      {/* DESCRIPTION */}
      <div className="mt-5">
        <label className="label">Description</label>
        <textarea
          className="input min-h-[100px]"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />
      </div>

      {/* STOCK + CATEGORY */}
      <div className="grid md:grid-cols-2 gap-4 mt-5">

        <div>
          <label className="label">Stock</label>
          <input className="input" value={stock} onChange={(e)=>setStock(e.target.value)} />
        </div>

        <div>
          <label className="label">Category</label>
          <select className="input" onChange={(e)=>setCategory(e.target.value)}>
            <option>Select category</option>
            {categories?.map((c)=>(
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        className="mt-6 w-full rounded-2xl bg-sky-500 py-3 font-semibold transition hover:bg-sky-400"
      >
        Create Product
      </button>

    </div>
  </div>
</div>
  );
};

export default ProductList;