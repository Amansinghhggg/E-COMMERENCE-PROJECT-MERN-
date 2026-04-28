import { Link } from "react-router-dom";
import HeartIcon from "./Heart";
import { FiEye } from "react-icons/fi";

const Product = ({ product }) => {
  const lowStock = product.countInStock > 0 && product.countInStock <= 5;

  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-sky-400/50 hover:bg-white/5">
      <div className="relative overflow-hidden rounded-xl">
        <Link to={`/product/${product._id}`} className="block">
          <img
            src={product.image}
            alt={product.name}
            className="h-64 w-full rounded-xl object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        <HeartIcon product={product} />
      </div>

      <div className="space-y-3 p-3">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/product/${product._id}`} className="block flex-1">
            <h2 className="line-clamp-1 text-base font-semibold text-zinc-100 transition hover:text-sky-300 sm:text-lg">
              {product.name}
            </h2>
          </Link>
          <span className="whitespace-nowrap rounded-full border border-sky-400/40 bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-200 sm:text-sm">
            Rs {product.price.toLocaleString()}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-zinc-300">
          {product.description}
        </p>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 sm:text-sm">
          <span>
            {lowStock ? "Hurry, few pieces left" : "In stock and ready to ship"}
          </span>
          <Link
            to={`/product/${product._id}`}
            aria-label={`View ${product.name}`}
            className="inline-flex items-center justify-center w-9 h-9 text-sky-300 transition hover:text-sky-200"
            style={{ borderRadius: "9999px", textDecoration: "none" }}
          >
            <FiEye aria-hidden="true" />
            <span className="sr-only">View product</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Product;