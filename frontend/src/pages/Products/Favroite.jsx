import { useSelector } from "react-redux";
import Product from "./Product";
import { Link } from "react-router-dom";

const Favorites = () => {
  const favorites = useSelector((state) => state.favorites);

  return (
    <div className="min-h-screen bg-[#0b1220] text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Your Collection
          </p>
          <h1 className="text-3xl font-semibold">
            Favorite Products
          </h1>
        </div>

        {/* EMPTY STATE */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <h2 className="text-xl font-semibold mb-2">
              No favorites yet ❤️
            </h2>
            <p className="text-gray-400 mb-4">
              Start adding products you love.
            </p>
            <Link
              to="/shop"
              className="block bg-sky-500 text-decoration-none text-center py-2 text-white font-semibold border border-white/20 rounded-lg hover:bg-sky-200 transition"

  >
              Explore Products
            </Link>
          </div>
        ) : (
          /* GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {favorites.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;