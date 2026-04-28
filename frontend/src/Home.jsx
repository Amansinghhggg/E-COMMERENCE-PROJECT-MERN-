import { Link } from "react-router-dom";
import { useGetProductsQuery } from "./redux/api/productApiSlice";
import Loader from "./components/Loader";
import Product from "./pages/Products/Product";
import Message from "./components/Message";
import ProductCarousel from "./pages/Products/ProductCrousel";

const Home = () => {
  const keyword = "";
  const { data, isLoading, isError, error } = useGetProductsQuery({ keyword });

  return (
    <div className="home-page min-h-screen bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#111111] text-white">
      {isLoading ? (
        <div className="py-12">
          <Loader />
        </div>
      ) : isError ? (
        <div className="mx-auto mt-10 w-full max-w-5xl px-4">
          <Message variant="danger">
            {error?.data?.message || error?.error || "Failed to load products"}
          </Message>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[1600px] px-3 pb-10 sm:px-4 lg:px-6 xl:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-sm sm:p-5 lg:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.28em] text-sky-200/80">
                  Curated Collection
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl lg:text-5xl">
                  Special Products
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">
                  Handpicked products, featured offers, and the best picks with the best prices.
                </p>
              </div>

              <Link
                to="/shop"
                className="inline-flex w-fit items-center rounded-full border border-sky-400/60 bg-sky-500/90 px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-400"
              >
                Explore Shop
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-3">
                {data.products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>

              <div className="xl:col-span-2 xl:self-stretch">
                <div className="sticky top-28 rounded-[1.5rem] border border-white/10 bg-black/25 p-3 shadow-2xl backdrop-blur-md sm:p-4">
                  <div className="mb-3 flex items-center justify-between px-1">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-sky-200/80">
                        Featured
                      </p>
                      <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                        Top Picks
                      </h2>
                    </div>
                    <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                      Live
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#0b1220]">
                    <ProductCarousel />
                  </div>

                  <div className="mt-4 rounded-[1.25rem] border border-sky-500/20 bg-gradient-to-br from-sky-500/15 via-transparent to-transparent p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-sky-200/70">
                      Limited Offer
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">
                      Up to 40% OFF
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      Discover the best deals .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;