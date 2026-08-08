import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import { getWishlist, removeFromWishlist, type WishlistCar } from "../utils/storage";
import { useEffect, useState } from "react";

const Wishlist = () => {
  const [cars, setCars] = useState<WishlistCar[]>([]);

  useEffect(() => {
    setCars(getWishlist());
  }, []);

  const handleRemove = (id: string) => {
    removeFromWishlist(id);
    setCars(getWishlist());
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-6 pb-24 pt-36">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ff4054]">
              Saved for later
            </p>
            <h1 className="mt-3 text-4xl font-black text-[#111]">My Wishlist</h1>
            <p className="mt-2 text-gray-500">Cars you've saved to compare or revisit.</p>
          </div>

          <span className="rounded-xl bg-[#ff4054] px-5 py-3 font-bold text-white">
            {cars.length} {cars.length === 1 ? "Car" : "Cars"} Saved
          </span>
        </div>

        {cars.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
            <div className="text-5xl">🤍</div>
            <h2 className="mt-4 text-2xl font-bold text-[#111]">Your wishlist is empty</h2>
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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <Reveal key={car._id}>
                <div className="group overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
                  <div className="relative">
                    <img
                      src={car.image.split(",")[0]?.trim() || "https://placehold.co/700x500?text=Car+Image"}
                      alt={car.model}
                      className="h-56 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemove(car._id)}
                      aria-label="Remove from wishlist"
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#ff4054] shadow-md transition hover:scale-105"
                    >
                      ♥
                    </button>
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff4054]">
                      {car.brand}
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-[#111]">{car.model}</h2>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-2xl font-black text-[#ff4054]">
                        ₹{Number(car.price).toLocaleString("en-IN")}
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
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Wishlist;
