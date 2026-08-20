import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

import Reveal from "../components/Reveal";
import { API } from "../utils/api";

import {
  clearWishlist,
  replaceWishlist,
  removeFromWishlist,
  type WishlistCar as LocalWishlistCar,
} from "../utils/storage";

// ======================================
// CAR TYPE
// ======================================

interface WishlistCar {
  _id: string;
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  image?: string;
  fuelType?: string;
  transmission?: string;
  description?: string;
  city?: string;
}

// ======================================
// WISHLIST ITEM
// ======================================

interface WishlistItem {
  _id: string;
  carId?: WishlistCar | null;
  userEmail?: string;
  userName?: string;
  createdAt?: string;
}

// ======================================
// API RESPONSE
// ======================================

interface WishlistResponse {
  success: boolean;
  count?: number;
  wishlist?: WishlistItem[];
  message?: string;
}

// ======================================
// COMPONENT
// ======================================

const Wishlist = () => {
  const {
    isLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  const [cars, setCars] =
    useState<WishlistItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ======================================
  // FETCH PERSONAL WISHLIST
  // ======================================

  const fetchWishlist = async () => {
    // --------------------------------------
    // NOT LOGGED IN
    // --------------------------------------

    if (!isSignedIn) {
      clearWishlist();

      setCars([]);
      setError("");
      setLoading(false);

      return;
    }

    try {
      setLoading(true);
      setError("");

      // --------------------------------------
      // GET CLERK TOKEN
      // --------------------------------------

      const token =
        await getToken();

      if (!token) {
        throw new Error(
          "Please login again."
        );
      }

      console.log(
        "WISHLIST TOKEN: TOKEN RECEIVED ✅"
      );

      // --------------------------------------
      // GET CURRENT USER WISHLIST
      // --------------------------------------

      const response =
        await fetch(
          `${API}/wishlist/me`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
              Accept:
                "application/json",
            },

            credentials:
              "include",
          }
        );

      const data =
        (await response.json()) as WishlistResponse;

      // --------------------------------------
      // ERROR
      // --------------------------------------

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to load wishlist."
        );
      }

      // --------------------------------------
      // PERSONAL WISHLIST
      // --------------------------------------

      const wishlist =
        Array.isArray(
          data.wishlist
        )
          ? data.wishlist
          : [];

      setCars(wishlist);

      // --------------------------------------
      // UPDATE LOCAL CACHE
      // Used by existing heart components
      // --------------------------------------

      const localCars: LocalWishlistCar[] =
        wishlist
          .filter(
            (item) =>
              item.carId &&
              item.carId._id
          )
          .map(
            (item) => ({
              _id:
                item.carId!._id,
              brand:
                item.carId!.brand ||
                "",
              model:
                item.carId!.model ||
                "",
              image:
                item.carId!.image ||
                "",
              price:
                Number(
                  item.carId!.price ||
                    0
                ),
            })
          );

      replaceWishlist(
        localCars
      );
    } catch (error) {
      console.error(
        "Wishlist Error:",
        error
      );

      setCars([]);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load wishlist."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // LOAD WISHLIST
  // ======================================

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    fetchWishlist();
  }, [
    isLoaded,
    isSignedIn,
  ]);

  // ======================================
  // REMOVE WISHLIST
  // ======================================

  const handleRemove = async (
    wishlistId: string
  ) => {
    try {
      const token =
        await getToken();

      if (!token) {
        alert(
          "Please login again."
        );

        return;
      }

      const response =
        await fetch(
          `${API}/wishlist/${wishlistId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
              Accept:
                "application/json",
            },

            credentials:
              "include",
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
            "Failed to remove wishlist item."
        );
      }

      // --------------------------------------
      // Remove from page
      // --------------------------------------

      setCars(
        (previous) =>
          previous.filter(
            (item) =>
              item._id !==
              wishlistId
          )
      );

      // --------------------------------------
      // Remove local cache item
      // --------------------------------------

      const removedItem =
        cars.find(
          (item) =>
            item._id ===
            wishlistId
        );

      if (
        removedItem?.carId?._id
      ) {
        removeFromWishlist(
          removedItem.carId._id
        );
      }

      // --------------------------------------
      // Notify navbar / other components
      // --------------------------------------

      window.dispatchEvent(
        new Event(
          "autolux-wishlist-updated"
        )
      );

      console.log(
        "Wishlist item removed ✅"
      );
    } catch (error) {
      console.error(
        "Remove Wishlist Error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to remove wishlist item."
      );
    }
  };

  // ======================================
  // LOADING CLERK
  // ======================================

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#f8f8f8] px-6 pb-24 pt-36">
        <div className="mx-auto max-w-7xl text-center">
          <p className="font-semibold text-gray-500">
            Loading wishlist...
          </p>
        </div>
      </main>
    );
  }

  // ======================================
  // PAGE
  // ======================================

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-6 pb-24 pt-36">
      <div className="mx-auto max-w-7xl">

        {/* ==================================
            HEADER
        ================================== */}

        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ff4054]">
              Saved for later
            </p>

            <h1 className="mt-3 text-4xl font-black text-[#111]">
              My Wishlist
            </h1>

            <p className="mt-2 text-gray-500">
              Cars you've saved to compare or revisit.
            </p>

          </div>

          <span className="rounded-xl bg-[#ff4054] px-5 py-3 font-bold text-white">
            {isSignedIn
              ? cars.length
              : 0}{" "}
            {isSignedIn &&
            cars.length === 1
              ? "Car"
              : "Cars"}{" "}
            Saved
          </span>

        </div>

        {/* ==================================
            NOT LOGGED IN
        ================================== */}

        {!isSignedIn ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

            <div className="text-5xl">
              🤍
            </div>

            <h2 className="mt-4 text-2xl font-bold text-[#111]">
              Please login first
            </h2>

            <p className="mt-2 text-gray-500">
              Login to view your personal wishlist.
            </p>

          </div>

        ) : loading ? (

          /* ==================================
             LOADING
          ================================== */

          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

            <p className="font-semibold text-gray-500">
              Loading wishlist...
            </p>

          </div>

        ) : error ? (

          /* ==================================
             ERROR
          ================================== */

          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

            <h2 className="text-2xl font-bold text-[#111]">
              Unable to load wishlist
            </h2>

            <p className="mt-2 text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={
                fetchWishlist
              }
              className="mt-6 rounded-xl bg-[#ff4054] px-7 py-4 font-bold text-white transition hover:bg-[#e63b4d]"
            >
              Try Again
            </button>

          </div>

        ) : cars.length === 0 ? (

          /* ==================================
             EMPTY
          ================================== */

          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

            <div className="text-5xl">
              🤍
            </div>

            <h2 className="mt-4 text-2xl font-bold text-[#111]">
              Your wishlist is empty
            </h2>

            <p className="mt-2 text-gray-500">
              Tap the heart icon on any car to save it here for later.
            </p>

            <Link
              to="/cars"
              className="mt-6 inline-block rounded-xl bg-[#ff4054] px-7 py-4 font-bold text-white transition hover:bg-[#e63b4d]"
            >
              Browse Cars →
            </Link>

          </div>

        ) : (

          /* ==================================
             WISHLIST CARDS
          ================================== */

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {cars.map(
              (item) => {
                const car =
                  item.carId;

                if (!car) {
                  return null;
                }

                return (
                  <Reveal
                    key={
                      item._id
                    }
                  >

                    <div className="group overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">

                      {/* IMAGE */}

                      <div className="relative">

                        <img
                          src={
                            car.image
                              ?.split(
                                ","
                              )[0]
                              ?.trim() ||
                            "https://placehold.co/700x500?text=Car+Image"
                          }
                          alt={
                            car.model ||
                            "Car"
                          }
                          className="h-56 w-full object-cover"
                        />

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(
                              item._id
                            )
                          }
                          aria-label="Remove from wishlist"
                          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#ff4054] shadow-md transition hover:scale-105"
                        >
                          ♥
                        </button>

                      </div>

                      {/* DETAILS */}

                      <div className="p-6">

                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff4054]">
                          {car.brand}
                        </p>

                        <h2 className="mt-2 text-2xl font-black text-[#111]">
                          {car.model}
                        </h2>

                        {car.year && (
                          <p className="mt-1 text-sm text-gray-500">
                            {car.year}
                          </p>
                        )}

                        <div className="mt-4 flex items-center justify-between">

                          <p className="text-2xl font-black text-[#ff4054]">
                            ₹
                            {Number(
                              car.price ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>

                          <Link
                            to={`/cars/${car._id}`}
                            className="rounded-full bg-gray-100 px-5 py-3 text-sm font-bold text-[#111] transition group-hover:bg-[#ff4054] group-hover:text-white"
                          >
                            View →
                          </Link>

                        </div>

                      </div>

                    </div>

                  </Reveal>
                );
              }
            )}

          </div>
        )}

      </div>
    </main>
  );
};

export default Wishlist;