import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
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
    autoplaySpeed: 2000,
  };

  return (
    <div className="mb-6 px-2 sm:px-3 md:px-4">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="mx-auto max-w-5xl rounded-xl border border-zinc-800/70 bg-zinc-900/40 p-2 sm:p-3"
        >
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
              <div key={_id} className="px-1 sm:px-2">
                <img
                  src={image}
                  alt={name}
                  className="h-64 w-full rounded-lg object-cover sm:h-80 md:h-[26rem]"
                />

                <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
                    <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
                      {name}
                    </h2>
                    <p className="mt-2 text-lg font-bold text-emerald-400">$ {price}</p>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
                      {description.substring(0, 170)} ...
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
                      <h1 className="mb-4 flex items-center text-sm text-zinc-200 sm:text-base">
                        <FaStore className="mr-2 text-zinc-400" /> Brand: {brand}
                      </h1>
                      <h1 className="mb-4 flex items-center text-sm text-zinc-200 sm:text-base">
                        <FaClock className="mr-2 text-zinc-400" /> Added:{" "}
                        {moment(createdAt).fromNow()}
                      </h1>
                      <h1 className="flex items-center text-sm text-zinc-200 sm:text-base">
                        <FaStar className="mr-2 text-zinc-400" /> Reviews:
                        {numReviews}
                      </h1>
                    </div>

                    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
                      <h1 className="mb-4 flex items-center text-sm text-zinc-200 sm:text-base">
                        <FaStar className="mr-2 text-zinc-400" /> Ratings:{" "}
                        {Math.round(rating)}
                      </h1>
                      <h1 className="mb-4 flex items-center text-sm text-zinc-200 sm:text-base">
                        <FaShoppingCart className="mr-2 text-zinc-400" /> Quantity:{" "}
                        {quantity}
                      </h1>
                      <h1 className="flex items-center text-sm text-zinc-200 sm:text-base">
                        <FaBox className="mr-2 text-zinc-400" /> In Stock:{" "}
                        {countInStock}
                      </h1>
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