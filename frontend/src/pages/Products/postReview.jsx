import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCreateReviewMutation } from "../../redux/api/productApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
export default function PostReview() {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [createReview] = useCreateReviewMutation();
    const { id } = useParams();
    const userInfo = useSelector((state) => state.auth.userInfo);
    function handleAddReview() {
        if (rating === 0 || comment.trim() === "") {
          toast.error("Please provide a rating and comment for your review.");
          return;
        }
            createReview({ productId: id, rating, comment })
        .unwrap()   .then(() => {
            toast.success("Review added successfully!");
            setRating(0);
            setComment("");
          })
        .catch((err) => {
            toast.error(
              err.data 
            );
          });
        }
  return (<>
  <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
   Write a Review
</button>

<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Write a Review</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
           <div className="border rounded-4 p-3 bg-light">
                <h5 className="mb-3">Write a review</h5>
                <div className="border rounded-4 p-3 bg-light">
  <h5 className="mb-3">Write a review</h5>

  <div className="mb-3">
    <label className="form-label">Rating</label>
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            cursor: "pointer",
            fontSize: "1.8rem",
            color: star <= rating ? "#ffc107" : "#e4e5e9",
          }}
          onClick={() => setRating(star)}
        >
          ★
        </span>
      ))}
    </div>
  </div>
    </div>
                <textarea
                  className="form-control mb-3"
                  rows="4"
                  placeholder="Write your review here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>

                <button className="btn btn-outline-primary" data-bs-dismiss="modal" onClick={handleAddReview}>
                  Add Review
                </button>
              </div>
      </div>
    </div>
  </div>
</div>
  </>
    );
}
    