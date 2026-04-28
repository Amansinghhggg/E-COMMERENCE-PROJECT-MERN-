import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../../redux/api/productApiSlice";
import { useGetAllCategoriesQuery } from "../../redux/api/category";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../../redux/features/shop/shopSlice";
import ProductCard from "../Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  const categoriesQuery = useGetAllCategoriesQuery();
  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, categoriesQuery.isLoading, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      let filteredProducts = filteredProductsQuery.data;

      if (priceFilter.trim()) {
        filteredProducts = filteredProducts.filter((product) =>
          product.price.toString().includes(priceFilter.trim())
        );
      }

      dispatch(setProducts(filteredProducts));
    }
  }, [filteredProductsQuery.data, filteredProductsQuery.isLoading, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    if (selectedBrand === brand) {
      setSelectedBrand("");
      dispatch(setProducts(filteredProductsQuery.data || []));
    } else {
      setSelectedBrand(brand);
      const productsByBrand = filteredProductsQuery.data?.filter(
        (product) => product.brand === brand
      );
      dispatch(setProducts(productsByBrand || []));
    }
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...new Set(
      filteredProductsQuery.data
        ?.map((product) => product.brand)
        .filter(Boolean)
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const resetFilters = () => {
    window.location.reload();
  };

  return (
    <div className="shop-page min-h-screen bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#111111] text-white">
      <div className="mx-auto w-full max-w-[1600px] px-3 pb-10 pt-4 sm:px-4 lg:px-6 xl:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-sm sm:p-5 lg:p-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-sky-200/80">
                Shop Now
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                Browse by category, brand, and price
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
                Use the filters to narrow down your products and discover the
                best match faster.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-1 text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                Showing 
              </p>
              <h2 className="text-xl font-semibold text-white">
                {products?.length || 0} Products
              </h2>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="sticky top-24 self-start rounded-2xl border border-white/10 bg-[#0b1220]/80 p-5 backdrop-blur-md">
              {/* CATEGORY */}
              <section className="mb-6">
                <h2 className="text-sm font-semibold text-gray-300 mb-3">
                  Categories
                </h2>

                <div className="flex flex-wrap gap-2">
                  {categories?.map((c) => (
                    <label
                      key={c._id}
                      className={`cursor-pointer px-3 py-1.5 text-xs rounded-full border transition focus:outline-none focus:ring-2 focus:ring-sky-400 
          ${
            checked.includes(c._id)
              ? "bg-sky-500 text-white border-sky-400"
              : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
          }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked.includes(c._id)}
                        onChange={(e) => handleCheck(e.target.checked, c._id)}
                        className="hidden"
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              </section>

              {/* BRANDS */}
              <section className="mb-6">
                <h2 className="text-sm font-semibold text-gray-300 mb-3">
                  Brands
                </h2>

                <div className="flex flex-wrap gap-2">
                  {uniqueBrands?.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => handleBrandClick(brand)}
                      aria-pressed={selectedBrand === brand}
                      className={`px-3 py-1.5 text-xs rounded-full border transition focus:outline-none focus:ring-2 focus:ring-sky-400 ` +
                        (selectedBrand === brand
                          ? "bg-sky-500 text-white border-sky-400"
                          : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10")
                      }
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </section>

              {/* PRICE */}
              <section className="mb-6">
                <h2 className="text-sm font-semibold text-gray-300 mb-3">
                  Price
                </h2>

                <input
                  type="text"
                  placeholder="e.g. 50000"
                  value={priceFilter}
                  onChange={handlePriceChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-sky-400 focus:outline-none"
                />
              </section>

              {/* RESET */}
              <button
                onClick={resetFilters}
                className="w-full rounded-xl bg-sky-500 py-2 text-sm font-semibold text-white hover:bg-sky-400 transition"
              >
                Reset Filters
              </button>
            </aside>

            <main className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 shadow-xl">
              {products.length === 0 ? (
                <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-sm text-zinc-300">
                  No products found
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                  {products.map((p) => (
                    <ProductCard key={p._id} p={p} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
