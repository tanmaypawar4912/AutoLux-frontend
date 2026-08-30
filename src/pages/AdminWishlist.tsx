import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  Heart,
  Trash2,
  RefreshCw,
  User,
  Mail,
  CalendarDays,
  Car,
} from "lucide-react";

import { API } from "../utils/api";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

interface WishlistCar {
  _id: string;
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  image?: string;
}

interface WishlistItem {
  _id: string;
  carId?: WishlistCar | null;
  userEmail: string;
  userName: string;
  createdAt?: string;
}

const AdminWishlist = () => {
  const {
    isLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  const [wishlist, setWishlist] =
    useState<WishlistItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [loadingId, setLoadingId] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [activeSection, setActiveSection] =
    useState("wishlist");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // =====================================
  // FETCH ADMIN WISHLIST
  // =====================================

  const fetchWishlist = async () => {
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
        "ADMIN WISHLIST TOKEN: TOKEN RECEIVED ✅"
      );

      const response = await fetch(
        `${API}/wishlist/admin`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
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
            "Failed to load wishlist"
        );
      }

      setWishlist(
        Array.isArray(data.wishlist)
          ? data.wishlist
          : []
      );
    } catch (error) {
      console.error(
        "Admin Wishlist Error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load wishlist"
      );
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
      return;
    }

    fetchWishlist();
  }, [
    isLoaded,
    isSignedIn,
    getToken,
  ]);

  // =====================================
  // DELETE WISHLIST
  // =====================================

  const deleteWishlist = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to remove this wishlist item?"
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
        `${API}/wishlist/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
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
            "Failed to remove wishlist item"
        );
      }

      setWishlist((previous) =>
        previous.filter(
          (item) =>
            item._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete Wishlist Error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete wishlist item."
      );
    } finally {
      setLoadingId("");
    }
  };

  // =====================================
  // FORMAT DATE
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
  // FILTER
  // =====================================

  const searchValue =
    search.trim().toLowerCase();

  const filteredWishlist =
    wishlist.filter((item) => {
      const car = item.carId;

      return (
        item.userName
          ?.toLowerCase()
          .includes(searchValue) ||
        item.userEmail
          ?.toLowerCase()
          .includes(searchValue) ||
        car?.brand
          ?.toLowerCase()
          .includes(searchValue) ||
        car?.model
          ?.toLowerCase()
          .includes(searchValue)
      );
    });

  // =====================================
  // UI
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
              justify-between
              gap-5
              sm:flex-row
              sm:items-end
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
                  sm:text-sm
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
                Wishlist
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Manage cars saved by customers.
              </p>

            </div>

            <button
              type="button"
              onClick={fetchWishlist}
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
                disabled:cursor-not-allowed
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

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-50
                    text-[#ff4054]
                  "
                >
                  <Heart size={21} />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Total Wishlist
                  </p>

                  <p className="mt-1 text-2xl font-black text-gray-900">
                    {wishlist.length}
                  </p>

                </div>

              </div>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                  "
                >
                  <User size={21} />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Customers
                  </p>

                  <p className="mt-1 text-2xl font-black text-gray-900">
                    {
                      new Set(
                        wishlist.map(
                          (item) =>
                            item.userEmail
                        )
                      ).size
                    }
                  </p>

                </div>

              </div>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-green-50
                    text-green-600
                  "
                >
                  <Car size={21} />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Cars Saved
                  </p>

                  <p className="mt-1 text-2xl font-black text-gray-900">
                    {
                      new Set(
                        wishlist
                          .map(
                            (item) =>
                              item.carId?._id
                          )
                          .filter(Boolean)
                      ).size
                    }
                  </p>

                </div>

              </div>

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
                Failed to load wishlist
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchWishlist}
                className="
                  mt-4
                  rounded-lg
                  bg-red-600
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-white
                  hover:bg-red-700
                "
              >
                Try Again
              </button>

            </div>
          )}

          {/* SEARCH */}

          <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm sm:p-5">

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search by user, email, brand or car model..."
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                py-3
                text-sm
                font-medium
                text-gray-900
                outline-none
                transition
                focus:border-[#ff4054]
                focus:bg-white
                focus:ring-2
                focus:ring-[#ff4054]/10
              "
            />

          </div>

          {/* LOADING */}

          {loading ? (

            <div
              className="
                rounded-2xl
                bg-white
                p-12
                text-center
                shadow-sm
              "
            >

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
                Loading wishlist...
              </p>

            </div>

          ) : filteredWishlist.length === 0 ? (

            <div
              className="
                rounded-2xl
                bg-white
                p-10
                text-center
                shadow-sm
                sm:p-14
              "
            >

              <Heart
                size={42}
                className="mx-auto text-gray-300"
              />

              <h2 className="mt-4 text-xl font-black text-gray-800">
                No Wishlist Found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? "Try changing your search."
                  : "There are currently no wishlist items."}
              </p>

            </div>

          ) : (

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

              <div className="border-b border-gray-100 px-5 py-5">

                <h2 className="text-xl font-black text-gray-900">
                  Customer Wishlist
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {filteredWishlist.length} item
                  {filteredWishlist.length !==
                  1
                    ? "s"
                    : ""}{" "}
                  found
                </p>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead className="bg-gray-50">

                    <tr>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Customer
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Car
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Price
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Added
                      </th>

                      <th className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredWishlist.map(
                      (item) => {

                        const car =
                          item.carId;

                        const isDeleting =
                          loadingId ===
                          item._id;

                        return (
                          <tr
                            key={item._id}
                            className="
                              border-t
                              border-gray-100
                              transition
                              hover:bg-gray-50
                            "
                          >

                            {/* CUSTOMER */}

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-3">

                                <div
                                  className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#ff4054]/10
                                    text-[#ff4054]
                                  "
                                >
                                  <User
                                    size={18}
                                  />
                                </div>

                                <div className="min-w-0">

                                  <p className="font-bold text-gray-900">
                                    {item.userName ||
                                      "User"}
                                  </p>

                                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">

                                    <Mail
                                      size={12}
                                    />

                                    <span className="max-w-[220px] truncate">
                                      {item.userEmail}
                                    </span>

                                  </p>

                                </div>

                              </div>

                            </td>

                            {/* CAR */}

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-3">

                                <img
                                  src={
                                    car?.image ||
                                    "/default-car.jpg"
                                  }
                                  alt={`${car?.brand || "Car"} ${car?.model || ""}`}
                                  className="
                                    h-14
                                    w-20
                                    shrink-0
                                    rounded-lg
                                    object-cover
                                  "
                                  onError={(
                                    event
                                  ) => {
                                    event.currentTarget.src =
                                      "/default-car.jpg";
                                  }}
                                />

                                <div>

                                  <p className="font-bold text-gray-900">
                                    {car?.brand ||
                                      "Unknown Brand"}
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    {car?.model ||
                                      "Unknown Model"}

                                    {car?.year
                                      ? ` • ${car.year}`
                                      : ""}
                                  </p>

                                </div>

                              </div>

                            </td>

                            {/* PRICE */}

                            <td className="px-5 py-4">

                              <p className="font-bold text-[#ff4054]">
                                ₹
                                {Number(
                                  car?.price ||
                                    0
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </p>

                            </td>

                            {/* DATE */}

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-2 text-sm text-gray-600">

                                <CalendarDays
                                  size={16}
                                  className="text-gray-400"
                                />

                                {formatDate(
                                  item.createdAt
                                )}

                              </div>

                            </td>

                            {/* DELETE */}

                            <td className="px-5 py-4">

                              <div className="flex justify-center">

                                <button
                                  type="button"
                                  disabled={
                                    isDeleting
                                  }
                                  onClick={() =>
                                    deleteWishlist(
                                      item._id
                                    )
                                  }
                                  title="Remove Wishlist"
                                  className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-gray-800
                                    text-white
                                    transition
                                    hover:bg-black
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                  "
                                >

                                  {isDeleting ? (
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

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </div>

      </main>

    </div>
  );
};

export default AdminWishlist;