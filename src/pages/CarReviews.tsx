import { useEffect, useState } from "react";
import Reveal from "../components/Reveal";
import type { Car } from "../types";
import { API } from "../utils/api";

const REVIEWS_API = `${API}/reviews`;

interface Review {
  _id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface CarReviewsProps {
  car: Car;
}

const StarRow = ({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        viewBox="0 0 24 24"
        className={size}
        fill={star <= Math.round(rating) ? "#f5b700" : "none"}
        stroke={star <= Math.round(rating) ? "#f5b700" : "#d1d5db"}
        strokeWidth={1.5}
      >
        <path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6L12 17l-5.9 3.5 1.3-6.6-4.9-4.6 6.6-.7L12 2.5z" />
      </svg>
    ))}
  </div>
);

const CarReviews = ({ car }: CarReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${REVIEWS_API}/car/${car._id}`);
      const data = (await response.json()) as {
        success: boolean;
        reviews: Review[];
        averageRating: number;
      };
      if (data.success) {
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
      }
    } catch (error) {
      console.error("Failed to load reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car._id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim() || !comment.trim()) {
      setFormError("Please fill in every field.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(REVIEWS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car._id,
          reviewerName: name.trim(),
          reviewerEmail: email.trim(),
          rating,
          comment: comment.trim(),
        }),
      });
      const data = await response.json();

      if (data.success) {
        setFormSuccess(true);
        setName("");
        setEmail("");
        setRating(5);
        setComment("");
        setShowForm(false);
        loadReviews();
        window.setTimeout(() => setFormSuccess(false), 4000);
      } else {
        setFormError(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Reveal>
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#111] sm:text-2xl">Reviews & Ratings</h2>
            {reviews.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <StarRow rating={averageRating} />
                <span className="text-sm font-bold text-[#111]">{averageRating}</span>
                <span className="text-sm text-gray-400">
                  ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="rounded-full border border-gray-200 px-5 py-3 text-sm font-bold text-[#111] transition hover:border-[#ff4054]"
          >
            {showForm ? "Cancel" : "Write a Review"}
          </button>
        </div>

        {formSuccess && (
          <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            Thanks! Your review was submitted.
          </p>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl bg-[#f8f8f8] p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ff4054]"
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ff4054]"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-[#111]">Your rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} stars`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      fill={star <= rating ? "#f5b700" : "none"}
                      stroke={star <= rating ? "#f5b700" : "#d1d5db"}
                      strokeWidth={1.5}
                    >
                      <path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6L12 17l-5.9 3.5 1.3-6.6-4.9-4.6 6.6-.7L12 2.5z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <textarea
              placeholder="Share your experience with this car or seller..."
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ff4054]"
            />

            {formError && <p className="text-sm font-semibold text-red-600">{formError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[#ff4054] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#e63b4d] disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        <div className="mt-6 space-y-5">
          {loading ? (
            <p className="text-sm text-gray-400">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-gray-400">
              No reviews yet — be the first to share your experience.
            </p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="border-t border-gray-100 pt-5 first:border-t-0 first:pt-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-[#111]">{review.reviewerName}</p>
                  <StarRow rating={review.rating} />
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-500">{review.comment}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </Reveal>
  );
};

export default CarReviews;
