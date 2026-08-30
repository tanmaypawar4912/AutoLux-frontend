import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import {
  Star,
  Trash2,
  RefreshCw,
  User,
  Mail,
  CalendarDays,
  Car,
} from "lucide-react";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import { API } from "../utils/api";

interface Review {
  _id: string;

  // IMPORTANT:
  // Backend Review model uses reviewerName/reviewerEmail
  reviewerName: string;
  reviewerEmail: string;

  rating: number;
  comment: string;
  createdAt: string;

  carId?: {
    _id: string;
    brand?: string;
    model?: string;
    year?: number;
    image?: string;
  } | null;
}

interface ReviewsResponse {
  success: boolean;
  message?: string;
  reviews?: Review[];
  averageRating?: number;
  ratingBreakdown?: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
}

const AdminReviews = () => {
  const {
    isLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [averageRating, setAverageRating] =
    useState(0);

  const [breakdown, setBreakdown] =
    useState({
      fiveStar: 0,
      fourStar: 0,
      threeStar: 0,
      twoStar: 0,
      oneStar: 0,
    });

  const [loadingId, setLoadingId] =
    useState("");

  const [activeSection, setActiveSection] =
    useState("reviews");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // =====================================
  // FETCH REVIEWS
  // =====================================

  const fetchReviews = async (): Promise <boolean> => {
    try {
      setLoading(true);
      setError("");

      if (!isLoaded || !isSignedIn) {
        throw new Error(
          "Please login first."
        );
      }

      const token = await getToken();

      if (!token) {
        throw new Error(
          "Authentication token not available."
        );
      }

      console.log(
        "ADMIN REVIEWS TOKEN: TOKEN RECEIVED ✅"
      );

      const response = await fetch(
        `${API}/reviews/admin`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data: ReviewsResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to load reviews"
        );
      }

      setReviews(
        Array.isArray(data.reviews)
          ? data.reviews
          : []
      );

      setAverageRating(
        data.averageRating || 0
      );

      setBreakdown(
        data.ratingBreakdown || {
          fiveStar: 0,
          fourStar: 0,
          threeStar: 0,
          twoStar: 0,
          oneStar: 0,
        }
      );
      return true;
      
    } catch (error) {
      console.error(
        "Fetch Reviews Error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to load reviews";

      setError(message);

      toast.error("Failed to load reviews.", {
        description: message,
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setLoading(false);
      setError("Please login first.");
      toast.warning("Please login first.");
      return;
    }

    fetchReviews();
  }, [
    isLoaded,
    isSignedIn,
    getToken,
  ]);

  // =====================================
  // DELETE REVIEW
  // =====================================

  const deleteReview = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this review?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setLoadingId(id);

      const token =
        await getToken();

      if (!token) {
        throw new Error(
          "Authentication token not available."
        );
      }

      const response = await fetch(
        `${API}/reviews/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to delete review"
        );
      }

      setReviews((previous) =>
        previous.filter(
          (review) =>
            review._id !== id
        )
      );

      toast.success("Review deleted successfully.", {
        description: "The customer review has been removed.",
      });
    } catch (error) {
      console.error(
        "Delete Review Error:",
        error
      );

      toast.error("Unable to delete review.", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    } finally {
      setLoadingId("");
    }
  };

  // =====================================
  // DATE
  // =====================================

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================
  // RATING STARS
  // =====================================

  const renderStars = (
    rating: number
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <Star
              key={star}
              size={15}
              fill={
                star <= rating
                  ? "currentColor"
                  : "none"
              }
              className={
                star <= rating
                  ? "text-yellow-400"
                  : "text-gray-300"
              }
            />
          )
        )}
      </div>
    );
  };

  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* SIDEBAR */}

      <AdminSidebar
        activeSection={
          activeSection
        }
        setActiveSection={
          setActiveSection
        }
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* MAIN */}

      <main className="min-h-screen lg:ml-64">

        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* HEADER */}

          <div
            className="
              mb-8
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#ff4054]
                "
              >
                Management
              </p>

              <h1
                className="
                  mt-2
                  text-3xl
                  font-black
                  text-gray-900
                  sm:text-4xl
                "
              >
                Reviews
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Manage customer reviews and ratings.
              </p>

            </div>

            <button
              type="button"
              onClick={async () => {
                const refreshed = await fetchReviews();

                if (refreshed) {
                  toast.success("Reviews refreshed successfully.");
                }
              }}
              disabled={loading}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#ff4054]
                px-5
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-[#e9364a]
                disabled:opacity-50
              "
            >
              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              {loading
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>

          {/* STATS */}

          <div
            className="
              mb-6
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <p className="text-sm font-semibold text-gray-500">
                Total Reviews
              </p>

              <p className="mt-2 text-3xl font-black text-gray-900">
                {reviews.length}
              </p>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <p className="text-sm font-semibold text-gray-500">
                Average Rating
              </p>

              <div className="mt-2 flex items-center gap-3">

                <p className="text-3xl font-black text-gray-900">
                  {Number(
                    averageRating || 0
                  ).toFixed(1)}
                </p>

                {renderStars(
                  Math.round(
                    averageRating || 0
                  )
                )}

              </div>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <p className="text-sm font-semibold text-gray-500">
                5 Star Reviews
              </p>

              <p className="mt-2 text-3xl font-black text-gray-900">
                {breakdown.fiveStar}
              </p>

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div
              className="
                mb-6
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-5
              "
            >
              <p className="font-bold text-red-700">
                Failed to load reviews
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* LOADING */}

          {loading ? (

            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

              <div
                className="
                  mx-auto
                  h-10
                  w-10
                  animate-spin
                  rounded-full
                  border-4
                  border-gray-200
                  border-t-[#ff4054]
                "
              />

              <p className="mt-4 font-semibold text-gray-600">
                Loading reviews...
              </p>

            </div>

          ) : reviews.length === 0 ? (

            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

              <Star
                size={42}
                className="mx-auto text-gray-300"
              />

              <h2 className="mt-4 text-xl font-black text-gray-800">
                No Reviews Found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                There are currently no customer reviews.
              </p>

            </div>

          ) : (

            /* REVIEWS */

            <div className="space-y-4">

              {reviews.map(
                (review) => {

                  const car =
                    review.carId;

                  const deleting =
                    loadingId ===
                    review._id;

                  return (
                    <div
                      key={review._id}
                      className="
                        rounded-2xl
                        bg-white
                        p-5
                        shadow-sm
                        sm:p-6
                      "
                    >

                      <div
                        className="
                          flex
                          flex-col
                          gap-5
                          lg:flex-row
                          lg:items-start
                          lg:justify-between
                        "
                      >

                        {/* USER */}

                        <div className="flex min-w-0 gap-4">

                          <div
                            className="
                              flex
                              h-11
                              w-11
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-[#ff4054]/10
                              text-[#ff4054]
                            "
                          >
                            <User
                              size={19}
                            />
                          </div>

                          <div className="min-w-0">

                            {/* REVIEWER NAME */}

                            <p className="font-bold text-gray-900">
                              {review.reviewerName ||
                                "User"}
                            </p>

                            {/* REVIEWER EMAIL */}

                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">

                              <Mail
                                size={12}
                              />

                              <span className="truncate">
                                {review.reviewerEmail ||
                                  "Email not available"}
                              </span>

                            </p>

                            <div className="mt-2 flex items-center gap-3">

                              {renderStars(
                                review.rating
                              )}

                              <span className="text-sm font-bold text-gray-600">
                                {review.rating}/5
                              </span>

                            </div>

                          </div>

                        </div>

                        {/* DATE + DELETE */}

                        <div className="flex items-center justify-between gap-4 lg:justify-end">

                          <div className="flex items-center gap-2 text-xs text-gray-500">

                            <CalendarDays
                              size={15}
                            />

                            {formatDate(
                              review.createdAt
                            )}

                          </div>

                          <button
                            type="button"
                            disabled={
                              deleting
                            }
                            onClick={() =>
                              deleteReview(
                                review._id
                              )
                            }
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              bg-gray-900
                              text-white
                              transition
                              hover:bg-black
                              disabled:opacity-50
                            "
                            title="Delete review"
                          >

                            {deleting ? (
                              <RefreshCw
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2
                                size={16}
                              />
                            )}

                          </button>

                        </div>

                      </div>

                      {/* COMMENT */}

                      <div className="mt-5 rounded-xl bg-gray-50 p-4">

                        <p className="text-sm leading-6 text-gray-700">
                          {review.comment ||
                            "No comment provided."}
                        </p>

                      </div>

                      {/* CAR */}

                      {car && (
                        <div className="mt-5 flex items-center gap-3 rounded-xl border border-gray-100 p-3">

                          {car.image ? (
                            <img
                              src={car.image}
                              alt={`${car.brand || ""} ${car.model || ""}`}
                              className="
                                h-14
                                w-20
                                shrink-0
                                rounded-lg
                                object-cover
                              "
                            />
                          ) : (
                            <div
                              className="
                                flex
                                h-14
                                w-20
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-gray-100
                                text-gray-400
                              "
                            >
                              <Car size={20} />
                            </div>
                          )}

                          <div>

                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                              Car
                            </p>

                            <p className="font-bold text-gray-900">
                              {car.brand ||
                                "Unknown Brand"}{" "}
                              {car.model ||
                                "Unknown Model"}
                            </p>

                            {car.year && (
                              <p className="text-xs text-gray-500">
                                {car.year}
                              </p>
                            )}

                          </div>

                        </div>
                      )}

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>

      </main>

    </div>
  );
};

export default AdminReviews;