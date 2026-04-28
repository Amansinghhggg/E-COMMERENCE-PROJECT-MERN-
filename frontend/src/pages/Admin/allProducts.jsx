import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery(undefined, {
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
});

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div className="p-6 text-center text-red-400">Error loading products</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0f172a] to-[#111111] px-4 py-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-200/80">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              All Products
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              Review every product, check its price, and jump into editing with one click.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 px-5 py-4 shadow-lg">
              <p className="text-xs uppercase tracking-[0.25em] text-sky-200/80">Inventory</p>
              <h2 className="mt-2 text-2xl font-semibold">All Products ({products.length})</h2>
            </div>

            <div className="grid gap-4">
              {products.map((product) => (
                <article
                  key={product._id}
                  className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-lg transition hover:-translate-y-0.5 hover:border-sky-400/30 hover:bg-white/7"
                >
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch">
                    <div className="relative sm:w-[12rem]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-56 w-full rounded-[1.25rem] object-cover sm:h-full"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-4 sm:p-1">
                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <h3 className="text-xl font-semibold text-white transition group-hover:text-sky-300">
                            {product?.name}
                          </h3>
                          <p className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-300">
                            {moment(product.createdAt).format("MMMM Do YYYY")}
                          </p>
                        </div>

                        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-300">
                          {product?.description?.substring(0, 180)}...
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-lg font-semibold text-sky-300">
                          ₹ {product?.price?.toLocaleString("en-IN")}
                        </p>

                        <Link
                          to={`/admin/product/update/${product._id}`}
                          className="inline-flex items-center justify-center rounded-full bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white no-underline transition hover:bg-pink-400"
                        >
                          Update Product
                          <svg
                            className="ml-2 h-3.5 w-3.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;