import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProductDetailsQuery ,useCreateReviewMutation} from "../../redux/api/productApiSlice";
import Ratings from "./ratingsStar";
import { useSelector } from "react-redux";
import HeartIcon from "./Heart";
import {toast} from "react-toastify"
import RecommendProducts from "./recommendProducts";
import PostReview from "./postReview";
import {addToCart} from "../../redux/features/Cart/cartSlice"
import { useDispatch } from "react-redux";
export default function ProductDetails() {
  const { id } = useParams();
  const { data: product, error, isLoading } = useGetProductDetailsQuery(id);
  const [createReview] = useCreateReviewMutation();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  
  const [comment, setComment] = useState("");
  const userInfo = useSelector((state) => state.auth.userInfo);
const dispatch = useDispatch();
 const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;


  function handleAddReview() {
    if (rating === 0 || comment.trim() === "") {
      toast.error("Please provide a rating and comment for your review.");
      return;
    }
     createReview({ productId: id, rating, comment })
      .unwrap()
      .then(() => {
        toast.success("Review added successfully!");
        setRating(0);
        setComment("");
        setWriteReview(false);
      })
      .catch((err) => {
        toast.error(
          err.data 
        );
      });
  }

  if (isLoading) {
    return (
      <div className="container py-5 d-flex justify-content-center align-items-center">
        <div className="text-center p-4 border rounded-4 shadow-sm bg-white">
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
      <div className="container py-5">
        <div className="alert alert-danger mb-0" role="alert">
          Error:{" "}
          {error?.data?.message ||
            error?.message ||
            "Unable to load product details."}
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const isInStock = product.countInStock > 0;
  const reviewCount = product.reviews?.length || 0;

  return (
    <div className="container py-5">
      <div className="row g-4 align-items-start">
        <div className="col-md-6">
          <div className="position-relative border rounded-4 shadow-sm overflow-hidden bg-white p-3">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid rounded-3 w-100"
            />
            <HeartIcon product={product} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex flex-column gap-3">
            <div>
              <h2 className="mb-2">{product.name}</h2>
                  <Ratings
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
            </div>

            <p className="text-muted mb-0">{product.description}</p>

            <div className="d-flex align-items-center gap-3 flex-wrap">
              <h4 className="mb-0">₹{product.price}</h4>
              <span
                className={`badge ${isInStock ? "bg-success" : "bg-danger"}`}
              >
                {isInStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {isInStock && (
              <div>
                <label htmlFor="qty" className="form-label fw-semibold">
                  Quantity
                </label>
                <select
                  id="qty"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="form-select w-auto"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="d-flex gap-2 flex-wrap">
              {cartItems.some((item) => item._id === product._id) ? (
                <button className="btn btn-secondary" disabled>
                  Added to Cart
                </button>
              ) : (
                <button className="btn btn-primary" disabled={!isInStock} onClick={() => dispatch(addToCart({ ...product, qty }))}>
                  Add to Cart
                </button>
              )}
            </div>
            {userInfo?(
              <PostReview/>):(
                <p className="text-muted mb-0">Please log in to write a review.</p>
              )
            }

            
          </div>
        </div>
        <div className="border-top pt-3">
              <h5 className="mb-3">Reviews ({reviewCount})</h5>
              {reviewCount === 0 ? (
                <p className="text-muted mb-0">No reviews yet.</p>
              ) : (
                <ul className="list-unstyled mb-0 d-grid gap-3">
                  {product.reviews.map((review) => (
                    <li
                      key={review._id}
                      className="border rounded-3 p-3 bg-white"
                    >
                      <div className="d-flex justify-content-between gap-3 flex-wrap">
                        <strong>{review.name}</strong>
                        <Ratings value={review.rating} />
                      </div>
                      <p className="mb-0 mt-2 text-muted">{review.comment}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
      </div>    
      <RecommendProducts currentProductId={product._id} />
    </div>
  );
}
