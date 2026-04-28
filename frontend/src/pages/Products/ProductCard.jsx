import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import HeartIcon from "./Heart";
import { CheckCircleIcon, ShoppingCartIcon, ChevronRightIcon } from "@heroicons/react/solid";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-[#0f172a] border border-white/5 hover:border-sky-400/30 transition duration-300 hover:-translate-y-1">

      {/* IMAGE */}
      <div className="relative">
        <Link to={`/product/${p._id}`}>
          <img
            src={p.image}
            alt={p.name}
            className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="absolute left-3 top-3 text-xs bg-black/50 px-2 py-1 rounded-full text-gray-200">
          {p?.brand}
        </div>

        <HeartIcon product={p} />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-3 p-4">

        {/* TITLE + PRICE */}
        <div className="flex items-start justify-between gap-2">
          <Link to={`/product/${p._id}`} className="flex-1">
            <h5 className="text-base font-semibold text-white leading-tight line-clamp-2 hover:text-sky-400 transition">
              {p.name}
            </h5>
          </Link>

          <span className="text-sm font-semibold text-sky-400 whitespace-nowrap">
            ₹ {p.price.toLocaleString("en-IN")}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-xs text-gray-400 line-clamp-2">
          {p.description}
        </p>

        {/* ACTIONS */}
        <div className="mt-2 flex items-center justify-between gap-2">

          <Link
            to={`/product/${p._id}`}
            aria-label={`View ${p.name}`}
            className="text-gray-300 hover:text-white transition inline-flex items-center p-1.5"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Link>

          {cart.cartItems.some((item) => item._id === p._id) ? (
            <button
              disabled
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400"
              style={{ borderRadius: "9999px" }}
            >
              <CheckCircleIcon className="h-4 w-4" />
              Added
            </button>
          ) : (
            <button
              onClick={() => addToCartHandler(p, 1)}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-sky-500 text-white hover:bg-sky-400 transition"
              style={{ borderRadius: "9999px" }}
            >
              <ShoppingCartIcon className="h-4 w-4" />
              Add
            </button>
          )}

        </div>
      </div>
    </article>
  );
};

export default ProductCard;