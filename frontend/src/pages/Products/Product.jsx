import { Link } from "react-router-dom";
import HeartIcon from "./Heart";

const Product = ({ product }) => {
  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-sky-400/50 hover:bg-white/5">
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={product.image}
          alt={product.name}
          className="h-64 w-full rounded-xl object-cover transition duration-500 group-hover:scale-105"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-3">
        <Link to={`/product/${product._id}`} className="block">
          <h2 className="flex items-center justify-between gap-3">
            <span className="line-clamp-1 text-base font-semibold text-zinc-100 sm:text-lg">
              {product.name}
            </span>
            <span className="whitespace-nowrap rounded-full border border-sky-400/40 bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-200 sm:text-sm">
              $ {product.price}
            </span>
          </h2>
        </Link>
      </div>
    </article>
  );
};

export default Product;