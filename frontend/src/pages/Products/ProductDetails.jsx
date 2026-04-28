import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProductDetailsQuery } from "../../redux/api/productApiSlice";
import Ratings from "./ratingsStar";
import { useSelector, useDispatch } from "react-redux";
import HeartIcon from "./Heart";
import RecommendProducts from "./recommendProducts";
import PostReview from "./postReview";
import { addToCart } from "../../redux/features/Cart/cartSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const { data: product, error, isLoading } = useGetProductDetailsQuery(id);
  const [qty, setQty] = useState(1);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  if (isLoading) {
    return (
      <div className="product-details-page container py-5 d-flex justify-content-center align-items-center">
        <div className="product-details-surface text-center p-4 shadow-sm bg-white">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
            aria-hidden="true"
          ></div>
          <div className="fw-semibold">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-details-page container py-5">
        <div className="alert alert-danger mb-0 product-details-alert" role="alert">
          Error: {error?.data?.message || error?.message || "Unable to load product details."}
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const isInStock = product.countInStock > 0;
  const reviewCount = product.reviews?.length || 0;
  const priceValue = Number(product.price || 0).toLocaleString("en-IN");

  return (<div className="min-h-screen bg-[#0b1220] text-white px-4 py-10">
  <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">

    {/* LEFT: IMAGE */}
    <div className="relative">
      <div className="bg-[#111827] rounded-2xl border border-white/10 p-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[400px] object-cover rounded-xl"
        />
      </div>

      <div className="absolute top-4 left-4 flex gap-2">
        <span className={`px-3 py-1 text-xs rounded-full ${
          isInStock
            ? "bg-emerald-500/20 text-emerald-300"
            : "bg-red-500/20 text-red-300"
        }`}>
          {isInStock ? "In Stock" : "Out of Stock"}
        </span>

        <span className="px-3 py-1 text-xs rounded-full bg-white/10 text-gray-300">
          {reviewCount} reviews
        </span>
      </div>

      <HeartIcon product={product} />
    </div>

    {/* RIGHT: DETAILS */}
    <div className="bg-[#111827] p-6 rounded-2xl border border-white/10 flex flex-col gap-5">

      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <Ratings value={product.rating} text={`${reviewCount} reviews`} />
      </div>

      <p className="text-gray-400 text-sm leading-6">
        {product.description}
      </p>

      {/* PRICE */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-400">Price</p>
          <p className="text-2xl font-bold text-sky-400">
            ₹ {priceValue}
          </p>
        </div>

        <span className="text-sm text-gray-300">
          {isInStock ? "Ready to ship" : "Unavailable"}
        </span>
      </div>

      {/* QUANTITY */}
      {isInStock && (
        <div>
          <p className="text-sm mb-2 text-gray-300">Quantity</p>

          <div className="flex items-center border border-white/10 rounded-lg overflow-hidden w-fit">

            <button
              onClick={() => qty > 1 && setQty(qty - 1)}
              className="px-3 py-1 bg-white/5 hover:bg-white/10"
            >
              -
            </button>

            <span className="px-4">{qty}</span>

            <button
              onClick={() =>
                qty < product.countInStock && setQty(qty + 1)
              }
              className="px-3 py-1 bg-white/5 hover:bg-white/10"
            >
              +
            </button>

          </div>
        </div>
      )}

      {/* BUTTON */}
      {cartItems.some((item) => item._id === product._id) ? (
        <button  style={{ borderRadius: "9999px" }} className="w-full py-2 rounded-xl bg-white/10 text-gray-300">
          Already in Cart
        </button>
      ) : (
        <button
          disabled={!isInStock}
          style={{ borderRadius: "9999px" }}
          onClick={() => dispatch(addToCart({ ...product, qty }))}
          className="w-full py-2 rounded-xl bg-sky-500 hover:bg-sky-400 transition font-semibold"
        >
          Add to Cart
        </button>
      )}

      {/* REVIEW */}
      <div className="border-t border-white/10 pt-4">
        {userInfo ? (
          <PostReview />
        ) : (
          <p className="text-gray-400 text-sm">
            Login to write a review
          </p>
        )}
      </div>

    </div>
  </div>

  {/* REVIEWS */}
  <div className="max-w-6xl mx-auto mt-10 bg-[#111827] p-6 rounded-2xl border border-white/10">

    <h2 className="text-lg font-semibold mb-4">
      Reviews ({reviewCount})
    </h2>

    {reviewCount === 0 ? (
      <p className="text-gray-400">No reviews yet</p>
    ) : (
      <div className="space-y-4">
        {product.reviews.map((review) => (
          <div
            key={review._id}
            className="border border-white/10 p-4 rounded-xl"
          >
            <div className="flex justify-between">
              <strong>{review.name}</strong>
              <Ratings value={review.rating} />
            </div>
            <p className="text-gray-400 text-sm mt-2">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* RECOMMENDED */}
  <div className="max-w-6xl mx-auto mt-10">
    <RecommendProducts currentProductId={product._id} />
  </div>
</div>
  );
}
