import { useState } from "react";
import { API } from "../../utils/api";

interface Car {
  _id: string;
  brand: string;
  model: string;
  sellerName: string;
  sellerEmail: string;
  year: number;
  price: number;
  fuelType: string;
  transmission: string;
  status: string;
  image: string;
}

interface Props {
  cars: Car[];
  setCars: React.Dispatch<React.SetStateAction<Car[]>>;
}

const AdminTable = ({ cars, setCars }: Props) => {
  const [loadingId, setLoadingId] = useState("");

  // ==========================
  // UPDATE STATUS
  // ==========================

  const updateStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setLoadingId(id);

      const response = await fetch(`${API}/cars/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        setCars((prev) =>
          prev.map((car) =>
            car._id === id
              ? { ...car, status }
              : car
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoadingId("");
    }
  };

  // ==========================
  // DELETE CAR
  // ==========================

  const deleteCar = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this car?"
    );

    if (!confirmDelete) return;

    try {
      setLoadingId(id);

      const response = await fetch(`${API}/cars/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setCars((prev) =>
          prev.filter((car) => car._id !== id)
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoadingId("");
    }
  };

  if (cars.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow">
        <h2 className="text-xl font-bold">
          No Cars Found
        </h2>
      </div>
    );
  }

  return (
    <div className="mt-10 overflow-hidden rounded-2xl bg-white shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">Image</th>
              <th className="px-6 py-4 text-left">Car</th>
              <th className="px-6 py-4 text-left">Seller</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {cars.map((car) => (

              <tr
                key={car._id}
                className="border-b hover:bg-gray-50"
              >

                {/* IMAGE */}

                <td className="px-6 py-4">
                  <img
                    src={car.image || "https://via.placeholder.com/150"}
                    alt={car.model}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/150";
                    }}
                    className="h-20 w-28 rounded-lg object-cover"
                  />
                </td>

                {/* CAR */}

                <td className="px-6 py-4">
                  <h3 className="text-lg font-bold">
                    {car.brand} {car.model}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {car.year}
                  </p>
                </td>

                {/* SELLER */}

                <td className="px-6 py-4">
                  <p className="font-semibold">
                    {car.sellerName}
                  </p>

                  <p className="text-sm text-gray-500">
                    {car.sellerEmail}
                  </p>
                </td>

                {/* PRICE */}

                <td className="px-6 py-4 font-bold text-[#ff4054]">
                  ₹{Number(car.price).toLocaleString("en-IN")}
                </td>

                {/* STATUS */}

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-bold text-white ${
                      car.status === "approved"
                        ? "bg-green-500"
                        : car.status === "rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {car.status.charAt(0).toUpperCase() +
                      car.status.slice(1)}
                  </span>
                </td>

                {/* ACTIONS */}

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">

                    <button
                      disabled={loadingId === car._id}
                      onClick={() =>
                        updateStatus(
                          car._id,
                          "approved"
                        )
                      }
                      className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
                    >
                      {loadingId === car._id ? "..." : "✓"}
                    </button>

                    <button
                      disabled={loadingId === car._id}
                      onClick={() =>
                        updateStatus(
                          car._id,
                          "rejected"
                        )
                      }
                      className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      {loadingId === car._id ? "..." : "✕"}
                    </button>

                    <button
                      disabled={loadingId === car._id}
                      onClick={() =>
                        deleteCar(car._id)
                      }
                      className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-black disabled:opacity-50"
                    >
                      {loadingId === car._id ? "..." : "🗑"}
                    </button>

                  </div>
                </td>

              </tr>

            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AdminTable;