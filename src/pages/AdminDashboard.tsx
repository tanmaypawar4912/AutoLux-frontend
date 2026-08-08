import { useEffect, useState } from "react";
import { API } from "../utils/api";
import AdminTable from "../components/admin/AdminTable";
import AdminSearch from "../components/admin/AdminSearch";
import AdminStats from "../components/admin/AdminStats";
import AdminFilter from "../components/admin/AdminFilter";

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

const AdminDashboard = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const carsPerPage = 10;

  // ===============================
  // Fetch Cars
  // ===============================

  const fetchCars = async () => {
    try {
      const response = await fetch(`${API}/cars/admin`);

      const data = await response.json();

      if (data.success) {
        setCars(data.cars);
      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // ===============================
  // Reset Pagination
  // ===============================

  useEffect(() => {
    setCurrentPage(1);
  }, [search, status]);

  // ===============================
  // Statistics
  // ===============================

  const totalCars = cars.length;

  const pendingCars = cars.filter(
    (car) => car.status === "pending"
  ).length;

  const approvedCars = cars.filter(
    (car) => car.status === "approved"
  ).length;

  const rejectedCars = cars.filter(
    (car) => car.status === "rejected"
  ).length;

  // ===============================
  // Search + Filter
  // ===============================

  const filteredCars = cars.filter((car) => {

    const matchesSearch =
      car.brand.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase()) ||
      car.sellerName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "all" ||
      car.status === status;

    return matchesSearch && matchesStatus;

  });

  // ===============================
  // Pagination
  // ===============================

  const indexOfLastCar =
    currentPage * carsPerPage;

  const indexOfFirstCar =
    indexOfLastCar - carsPerPage;

  const currentCars =
    filteredCars.slice(
      indexOfFirstCar,
      indexOfLastCar
    );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCars.length / carsPerPage)
  );

  return (

    <main className="min-h-screen bg-gray-100 pt-32 pb-20">

      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <h1 className="mb-8 text-4xl font-black">
          Admin Dashboard
        </h1>

        {/* Stats */}

        <AdminStats
          total={totalCars}
          pending={pendingCars}
          approved={approvedCars}
          rejected={rejectedCars}
        />

        {/* Search */}

        <div className="mt-8">

          <AdminSearch
            search={search}
            setSearch={setSearch}
          />

        </div>

        {/* Filter */}

        <div className="mt-5">

          <AdminFilter
            status={status}
            setStatus={setStatus}
          />

        </div>

        {/* Table */}

        <div className="mt-8">

          {loading ? (

            <div className="rounded-2xl bg-white p-10 text-center shadow">

              <h2 className="text-xl font-bold">
                Loading Cars...
              </h2>

            </div>

          ) : filteredCars.length === 0 ? (

            <div className="rounded-2xl bg-white p-10 text-center shadow">

              <h2 className="text-xl font-bold">
                No Cars Found
              </h2>

            </div>

          ) : (

            <>
              <AdminTable
                cars={currentCars}
                setCars={setCars}
              />

              {/* Pagination */}

              <div className="mt-8 flex items-center justify-center gap-4">

                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => prev - 1)
                  }
                  className="rounded-lg bg-gray-800 px-5 py-2 text-white disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="font-bold">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => prev + 1)
                  }
                  className="rounded-lg bg-[#ff4054] px-5 py-2 text-white disabled:opacity-40"
                >
                  Next
                </button>

              </div>

            </>

          )}

        </div>

      </div>

    </main>

  );
};

export default AdminDashboard;