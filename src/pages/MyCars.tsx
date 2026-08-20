import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { API } from "../utils/api";

interface Car {
  _id: string;
  brand: string;
  model: string;
  image: string;
  status: string;
  price: number;
  year?: number;
}

const MyCars = () => {
  const { user } = useUser();

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");

  // =====================================
  // FETCH MY CARS
  // =====================================

  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      setLoading(false);
      return;
    }

    const fetchMyCars = async () => {
      try {
        setLoading(true);

        const email =
          user.primaryEmailAddress?.emailAddress;

        const response = await fetch(
          `${API}/cars/my/${email}`
        );

        const data = await response.json();

        if (data.success) {
          setCars(data.cars || []);
        } else {
          setCars([]);

          toast.error(
            data.message ||
              "Unable to load your cars."
          );
        }
      } catch (error) {
        console.error(
          "Fetch My Cars Error:",
          error
        );

        setCars([]);

        toast.error(
          "Unable to load your cars.",
          {
            description:
              "Please check your connection and try again.",
          }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyCars();
  }, [user]);

  // =====================================
  // DELETE CAR
  // =====================================

  const deleteCar = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this car?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(
        `${API}/cars/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        setCars((previous) =>
          previous.filter(
            (car) => car._id !== id
          )
        );

        toast.success(
          "Car deleted successfully! 🚗",
          {
            description:
              "The car has been removed from your listings.",
          }
        );
      } else {
        toast.error(
          "Unable to delete car.",
          {
            description:
              data.message ||
              "Please try again.",
          }
        );
      }
    } catch (error) {
      console.error(
        "Delete Car Error:",
        error
      );

      toast.error(
        "Something went wrong.",
        {
          description:
            "Unable to delete the car. Please try again.",
        }
      );
    } finally {
      setDeletingId("");
    }
  };

  // =====================================
  // STATUS COLOR
  // =====================================

  const getStatusColor = (
    status: string
  ) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-500";

      case "rejected":
        return "bg-red-500";

      default:
        return "bg-yellow-500";
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] pt-36">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-24">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#ff4054]" />

            <h2 className="mt-5 text-xl font-bold text-[#111]">
              Loading your cars...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">

      {/* =====================================
          HERO SECTION
      ===================================== */}

      <section className="px-6 pb-12 pt-36">
        <div className="mx-auto max-w-7xl">

          <div className="relative overflow-hidden rounded-[2rem] bg-[#111] px-7 py-12 shadow-xl sm:px-10 lg:px-14 lg:py-14">

            {/* Decorative background */}

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ff4054]/10 blur-3xl" />

            <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-[#ff4054]/5 blur-3xl" />

            <div className="relative z-10">

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ff4054]">
                Your Collection
              </p>

              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                Your Cars,
                <span className="text-[#ff4054]">
                  {" "}Your Drive.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
                Manage your listed vehicles, check their
                approval status, update details, or remove
                cars from your collection.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">

                <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3">
                  <p className="text-xs text-gray-400">
                    Total Cars
                  </p>

                  <p className="mt-1 text-2xl font-black text-white">
                    {cars.length}
                  </p>
                </div>

                <Link
                  to="/sell"
                  className="rounded-xl bg-[#ff4054] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#e9364a]"
                >
                  Sell Another Car →
                </Link>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =====================================
          MY CARS CONTENT
      ===================================== */}

      <section className="px-6 pb-24">

        <div className="mx-auto max-w-7xl">

          {/* SECTION HEADER */}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff4054]">
                My Listings
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#111]">
                Manage Your Cars
              </h2>

              <p className="mt-2 text-gray-500">
                Manage all your listed cars.
              </p>
            </div>

            <div className="rounded-xl bg-[#ff4054] px-5 py-3 font-bold text-white shadow-sm">
              Total Cars : {cars.length}
            </div>

          </div>

          {/* =====================================
              NO CARS
          ===================================== */}

          {cars.length === 0 ? (

            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ff4054]/10 text-3xl">
                🚗
              </div>

              <h2 className="mt-5 text-2xl font-black text-[#111]">
                No Cars Listed
              </h2>

              <p className="mt-3 text-gray-500">
                Sell your first car to see it here.
              </p>

              <Link
                to="/sell"
                className="mt-6 inline-block rounded-xl bg-[#ff4054] px-6 py-3 font-bold text-white transition hover:bg-[#e9364a]"
              >
                Sell Your Car →
              </Link>

            </div>

          ) : (

            /* =====================================
               CARS GRID
            ===================================== */

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {cars.map((car) => (

                <div
                  key={car._id}
                  className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                >

                  {/* CAR IMAGE */}

                  <div className="relative">

                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      className="h-56 w-full object-cover"
                    />

                    {/* STATUS */}

                    <span
                      className={`absolute right-4 top-4 rounded-full px-4 py-2 text-xs font-bold text-white shadow ${getStatusColor(
                        car.status
                      )}`}
                    >
                      {car.status?.toUpperCase()}
                    </span>

                  </div>

                  {/* CAR DETAILS */}

                  <div className="p-6">

                    <h2 className="text-2xl font-black text-[#111]">
                      {car.brand} {car.model}
                    </h2>

                    {car.year && (
                      <p className="mt-1 text-gray-500">
                        {car.year}
                      </p>
                    )}

                    <p className="mt-4 text-2xl font-black text-[#ff4054]">
                      ₹
                      {Number(
                        car.price
                      ).toLocaleString("en-IN")}
                    </p>

                    {/* STATUS */}

                    <div className="mt-4">

                      <span
                        className={`rounded-full px-4 py-2 text-sm font-bold text-white ${getStatusColor(
                          car.status
                        )}`}
                      >
                        {car.status?.toUpperCase()}
                      </span>

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-6 flex gap-3">

                      <Link
                        to={`/edit-car/${car._id}`}
                        className="flex-1 rounded-xl bg-blue-600 py-3 text-center font-bold text-white transition hover:bg-blue-700"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        disabled={
                          deletingId === car._id
                        }
                        onClick={() =>
                          deleteCar(car._id)
                        }
                        className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId ===
                        car._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>

    </div>
  );
};

export default MyCars;