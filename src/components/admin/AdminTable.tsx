import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
  featured?: boolean;
  stock?: boolean;
}

interface Props {
  cars: Car[];
  setCars: React.Dispatch<React.SetStateAction<Car[]>>;
}

const AdminTable = ({ cars, setCars }: Props) => {
  const {
    isLoaded: authLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  const [loadingId, setLoadingId] = useState("");

  // ==========================================
  // GET CLERK AUTH HEADERS
  // ==========================================

  const getAuthHeaders = async () => {
    if (!authLoaded) {
      throw new Error(
        "Clerk authentication is still loading."
      );
    }

    if (!isSignedIn) {
      throw new Error("Please login first.");
    }

    const token = await getToken();

    console.log(
      "ADMIN TABLE TOKEN:",
      token
        ? "TOKEN RECEIVED ✅"
        : "TOKEN NOT RECEIVED ❌"
    );

    if (!token) {
      throw new Error(
        "Authentication token not available."
      );
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const updateStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setLoadingId(id);

      const headers = await getAuthHeaders();

      const response = await fetch(
        `${API}/cars/${id}/status`,
        {
          method: "PUT",
          headers,
          credentials: "include",
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          "Failed to update status."
        );
      }

      setCars((previous) =>
        previous.map((car) =>
          car._id === id
            ? {
              ...car,
              ...data.car,
              status:
                data.car?.status || status,
            }
            : car
        )
      );

      toast.success(
        status === "approved"
          ? "Car approved successfully! 🚗"
          : "Car rejected successfully.",
        {
          description:
            status === "approved"
              ? "The car is now approved and visible in the system."
              : "The car status has been updated to rejected.",
        }
      );
    } catch (error) {
      console.error(
        "Update status error:",
        error
      );

      toast.error(
        "Failed to update car status.",
        {
          description:
            error instanceof Error
              ? error.message
              : "Something went wrong.",
        }
      );
    }
  }
  // ==========================================
  // DELETE CAR
  // ==========================================

  const deleteCar = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this car?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoadingId(id);

      const headers = await getAuthHeaders();

      const response = await fetch(
        `${API}/cars/${id}`,
        {
          method: "DELETE",
          headers,
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          "Failed to delete car."
        );
      }

      setCars((previous) =>
        previous.filter(
          (car) => car._id !== id
        )
      );

      toast.success(
        "Car deleted successfully! 🗑️",
        {
          description:
            "The car has been removed from the dealership.",
        }
      );
    }
   catch (error) {
  console.error(
    "Delete car error:",
    error
  );

  toast.error(
    "Failed to delete car.",
    {
      description:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    }
  );
}
}
  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (cars.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <h2 className="text-xl font-black text-gray-900">
          No Cars Found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          There are no cars available.
        </p>
      </div>
    );
  }

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ==========================================
  // AUTH LOADING
  // ==========================================

  if (!authLoaded) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <p className="font-semibold text-gray-500">
          Loading authentication...
        </p>
      </div>
    );
  }

  // ==========================================
  // TABLE
  // ==========================================

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1050px] table-auto">

          {/* =================================
              HEADER
          ================================= */}

          <thead>
            <tr className="border-b bg-gray-50">

              <th className="w-[30%] whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Car
              </th>

              <th className="w-[22%] whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Seller
              </th>

              <th className="w-[14%] whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Price
              </th>

              <th className="w-[13%] whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Status
              </th>

              {/* IMPORTANT:
                  Fixed enough width for actions
              */}
              <th className="w-[21%] min-w-[220px] whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                Actions
              </th>

            </tr>
          </thead>

          {/* =================================
              BODY
          ================================= */}

          <tbody>
            {cars.map((car) => (
              <tr
                key={car._id}
                className="border-b last:border-0 hover:bg-gray-50"
              >

                {/* ===========================
                    CAR
                =========================== */}

                <td className="px-5 py-5">
                  <div className="flex min-w-0 items-center gap-4">

                    {car.image ? (
                      <img
                        src={car.image}
                        alt={`${car.brand} ${car.model}`}
                        className="h-16 w-24 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">
                        No Image
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-black text-gray-900">
                        {car.brand}{" "}
                        {car.model}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {car.year}
                      </p>

                      <p className="mt-1 whitespace-nowrap text-xs text-gray-400">
                        {car.fuelType} •{" "}
                        {car.transmission}
                      </p>
                    </div>

                  </div>
                </td>

                {/* ===========================
                    SELLER
                =========================== */}

                <td className="px-5 py-5">
                  <p className="truncate font-semibold text-gray-900">
                    {car.sellerName}
                  </p>

                  <p className="mt-1 max-w-[220px] truncate text-xs text-gray-500">
                    {car.sellerEmail}
                  </p>
                </td>

                {/* ===========================
                    PRICE
                =========================== */}

                <td className="whitespace-nowrap px-5 py-5">
                  <p className="font-black text-[#ff4054]">
                    ₹
                    {Number(
                      car.price
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </td>

                {/* ===========================
                    STATUS
                =========================== */}

                <td className="whitespace-nowrap px-5 py-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(
                      car.status
                    )}`}
                  >
                    {car.status}
                  </span>
                </td>

                {/* ===========================
                    ACTIONS
                =========================== */}

                <td className="min-w-[220px] whitespace-nowrap px-5 py-5">

                  {/* IMPORTANT:
                      flex-nowrap prevents overlap
                  */}

                  <div className="flex w-max flex-nowrap items-center gap-2">

                    {/* APPROVE */}

                    <button
                      type="button"
                      title="Approve"
                      disabled={
                        loadingId === car._id
                      }
                      onClick={() =>
                        updateStatus(
                          car._id,
                          "approved"
                        )
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Check size={17} />
                    </button>

                    {/* REJECT */}

                    <button
                      type="button"
                      title="Reject"
                      disabled={
                        loadingId === car._id
                      }
                      onClick={() =>
                        updateStatus(
                          car._id,
                          "rejected"
                        )
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <X size={17} />
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      title="Delete"
                      disabled={
                        loadingId === car._id
                      }
                      onClick={() =>
                        deleteCar(car._id)
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={17} />
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