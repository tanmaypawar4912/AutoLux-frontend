import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    fetch(`${API}/cars/my/${user.primaryEmailAddress.emailAddress}`)
      .then((res) => res.json())
      .then((data) => {
        setCars(data.cars || []);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const deleteCar = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this car?"
    );

    if (!confirmDelete) return;

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
        setCars((prev) => prev.filter((car) => car._id !== id));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500";

      case "rejected":
        return "bg-red-500";

      default:
        return "bg-yellow-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-32 flex items-center justify-center">
        <h2 className="text-2xl font-bold">
          Loading your cars...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-32 px-6">

      <div className="mx-auto max-w-7xl">

        <div className="mb-10 flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-black">
              My Cars
            </h1>

            <p className="mt-2 text-gray-500">
              Manage all your listed cars.
            </p>

          </div>

          <h2 className="rounded-xl bg-[#ff4054] px-5 py-3 font-bold text-white">
            Total Cars : {cars.length}
          </h2>

        </div>

        {cars.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow">
            <h2 className="text-2xl font-bold">
              No Cars Listed
            </h2>

            <p className="mt-3 text-gray-500">
              Sell your first car to see it here.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {cars.map((car) => (

              <div
                key={car._id}
                className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
              >

                <img
                  src={car.image}
                  alt={car.model}
                  className="h-56 w-full object-cover"
                />

                <div className="p-6">

                  <h2 className="text-2xl font-black">
                    {car.brand} {car.model}
                  </h2>

                  {car.year && (
                    <p className="mt-1 text-gray-500">
                      {car.year}
                    </p>
                  )}

                  <p className="mt-4 text-2xl font-black text-[#ff4054]">
                    ₹{car.price.toLocaleString("en-IN")}
                  </p>

                  <div className="mt-4">

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-bold text-white ${getStatusColor(
                        car.status
                      )}`}
                    >
                      {car.status.toUpperCase()}
                    </span>

                  </div>

                  <div className="mt-6 flex gap-3">

                    <Link
                      to={`/edit-car/${car._id}`}
                      className="flex-1 rounded-xl bg-blue-600 py-3 text-center font-bold text-white transition hover:bg-blue-700"
                    >
                      Edit
                    </Link>

                    <button
                      disabled={deletingId === car._id}
                      onClick={() => deleteCar(car._id)}
                      className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                      {deletingId === car._id
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

    </div>
  );
};

export default MyCars;