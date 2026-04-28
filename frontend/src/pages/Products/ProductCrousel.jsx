import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import { FiEye } from "react-icons/fi";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 1500,
    pauseOnHover: true,
  };

  return (
    <div className="px-1 py-1 sm:px-2 sm:py-2">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings} className="featured-slider mx-auto max-w-5xl">
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id} className="px-0.5 sm:px-1">
                <div className="overflow-hidden rounded-[1.35rem] bg-[#0b1220] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                  <Link to={`/product/${_id}`} className="block relative">
                    <img
                      src={image}
                      alt={name}
                      className="h-[220px] w-full object-cover transition duration-500 hover:scale-[1.02] sm:h-[280px] lg:h-[320px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-4">
                      <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-100 backdrop-blur-sm">
                        Featured
                      </span>
                      <span className="rounded-full border border-sky-400/30 bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-100 backdrop-blur-sm">
                        Top Pick
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h2 className="line-clamp-1 text-xl font-semibold tracking-tight text-white transition hover:text-sky-300 sm:text-2xl">
                        {name}
                      </h2>
                      <p className="mt-1 text-lg font-bold text-emerald-400">
                        Rs {price.toLocaleString()}
                      </p>
                    </div>
                  </Link>

                  <div className="space-y-4 p-4 sm:p-5">
                    <p className="line-clamp-3 text-sm leading-6 text-zinc-300 sm:text-[15px]">
                      {description}
                    </p>

                    <Link
                      to={`/product/${_id}`}
                      aria-label={`View ${name}`}
                      className="inline-flex items-center justify-center w-10 h-10 border border-sky-400/40 bg-sky-500/15 text-sky-200 transition hover:bg-sky-500/25"
                      style={{ borderRadius: "9999px", textDecoration: "none" }}
                    >
                      <FiEye className="text-lg" aria-hidden="true" />
                      <span className="sr-only">View product</span>
                    </Link>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <h3 className="mb-2 flex items-center text-sm font-semibold text-zinc-100">
                          <FaStore className="mr-2 text-sky-300" /> Brand
                        </h3>
                        <p className="text-sm text-zinc-300">{brand}</p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <h3 className="mb-2 flex items-center text-sm font-semibold text-zinc-100">
                          <FaClock className="mr-2 text-sky-300" /> Added
                        </h3>
                        <p className="text-sm text-zinc-300">
                          {moment(createdAt).fromNow()}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <h3 className="mb-2 flex items-center text-sm font-semibold text-zinc-100">
                          <FaStar className="mr-2 text-sky-300" /> Reviews
                        </h3>
                        <p className="text-sm text-zinc-300">{numReviews}</p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <h3 className="mb-2 flex items-center text-sm font-semibold text-zinc-100">
                          <FaStar className="mr-2 text-sky-300" /> Rating
                        </h3>
                        <p className="text-sm text-zinc-300">
                          {Math.round(rating)} / 5
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:col-span-2">
                        <h3 className="mb-2 flex items-center text-sm font-semibold text-zinc-100">
                          <FaShoppingCart className="mr-2 text-sky-300" /> Stock
                        </h3>
                        <p className="text-sm text-zinc-300">
                          {countInStock > 0
                            ? countInStock <= 5
                              ? `Hurry, few pieces left (${countInStock})`
                              : `${countInStock} pieces available`
                            : "Out of stock"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
