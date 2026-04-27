import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "./redux/api/productApiSlice";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Product from "./pages/Products/Product";
import Message from "./components/Message";
import ProductCarousel from "./pages/Products/ProductCrousel";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError, error } = useGetProductsQuery({ keyword });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#111111] text-white">
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <div className="py-12">
          <Loader />
        </div>
      ) : isError ? (
        <div className="mx-auto mt-10 w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <Message variant="danger">
            {error?.data?.message || error?.error || "Failed to load products"}
          </Message>
        </div>
      ) : (
        <div className="mx-auto mt-8 w-full max-w-7xl px-4 pb-10 sm:mt-10 sm:px-6 lg:px-8 xl:pl-24">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-300">
                  Curated Collection
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl md:text-4xl">
                  Special Products
                </h1>
              </div>

              <Link
                to="/shop"
                className="inline-flex w-fit rounded-full border border-sky-400/60 bg-sky-500/90 px-6 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 sm:text-base"
              >
                Explore Shop
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-xl border border-white/10 bg-black/20 p-3 sm:mt-8 sm:p-4">
              <ProductCarousel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;