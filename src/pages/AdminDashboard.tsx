import {
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

import {
  Menu,
  RefreshCw,
  Car,
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { API } from "../utils/api";

import AdminTable from "../components/admin/AdminTable";
import AdminSearch from "../components/admin/AdminSearch";
import AdminFilter from "../components/admin/AdminFilter";
import AdminSidebar from "../components/admin/AdminSidebar";

// =====================================================
// TYPES
// =====================================================

interface CarData {
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

interface DashboardStats {
  cars: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };

  bookings: {
    total: number;
    pending: number;
    approved: number;
    completed: number;
    rejected: number;
  };
}

interface RecentCar {
  _id: string;

  brand: string;
  model: string;

  year: number;
  price: number;

  status: string;
  image: string;

  createdAt?: string;
}

interface SectionPlaceholderProps {
  title: string;
  description: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;

  color:
    | "blue"
    | "orange"
    | "green"
    | "red"
    | "purple";
}

// =====================================================
// DEFAULT DATA
// =====================================================

const defaultDashboardStats: DashboardStats = {
  cars: {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  },

  bookings: {
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    rejected: 0,
  },
};

// =====================================================
// ADMIN DASHBOARD
// =====================================================

const AdminDashboard = () => {

  // ===================================================
  // CLERK AUTH
  // ===================================================

  const {
    isLoaded: authLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  // ===================================================
  // SIDEBAR
  // ===================================================

  const [activeSection, setActiveSection] =
    useState("dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // ===================================================
  // CARS
  // ===================================================

  const [cars, setCars] =
    useState<CarData[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [brand, setBrand] =
    useState("all");

  const [fuelType, setFuelType] =
    useState("all");

  const [transmission, setTransmission] =
    useState("all");

  const [year, setYear] =
    useState("all");

  // ===================================================
  // FILTER OPTIONS
  // ===================================================

  const [brands, setBrands] =
    useState<string[]>([]);

  const [fuelTypes, setFuelTypes] =
    useState<string[]>([]);

  const [transmissions, setTransmissions] =
    useState<string[]>([]);

  const [years, setYears] =
    useState<number[]>([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const carsPerPage = 10;

  // ===================================================
  // DASHBOARD
  // ===================================================

  const [dashboardStats, setDashboardStats] =
    useState<DashboardStats>(
      defaultDashboardStats
    );

  const [recentCars, setRecentCars] =
    useState<RecentCar[]>([]);

  const [dashboardLoading, setDashboardLoading] =
    useState(true);

  const [dashboardError, setDashboardError] =
    useState("");

  // ===================================================
  // GET CLERK TOKEN
  // ===================================================

  const getAuthToken = async () => {

    if (
      !authLoaded ||
      !isSignedIn
    ) {
      throw new Error(
        "Please login first."
      );
    }

    const token =
      await getToken();

    if (!token) {
      throw new Error(
        "Clerk token not available."
      );
    }

    return token;
  };

  // ===================================================
  // FETCH ADMIN CARS
  // ===================================================

  const fetchCars = async () => {

    try {
      setLoading(true);

      const token =
        await getAuthToken();

      const response =
        await fetch(
          `${API}/cars/admin`,
          {
            method: "GET",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
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
            "Failed to fetch cars"
        );
      }

      setCars(
        Array.isArray(data.cars)
          ? data.cars
          : []
      );

    } catch (error) {

      console.error(
        "Failed to fetch admin cars:",
        error
      );

      setCars([]);

      toast.error("Failed to load cars.", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to fetch admin cars.",
      });

    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // FETCH CAR FILTERS
  // ===================================================

  const fetchCarFilters = async () => {

    try {

      // ===============================================
      // AUTH TOKEN
      // ===============================================

      const token =
        await getAuthToken();

      // ===============================================
      // BRAND + YEAR
      // ===============================================

      const filtersResponse =
        await fetch(
          `${API}/admin/car-filters`,
          {
            method: "GET",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            credentials:
              "include",
          }
        );

      const filtersData =
        await filtersResponse.json();

      if (
        filtersResponse.ok &&
        filtersData.success
      ) {

        setBrands(
          Array.isArray(
            filtersData.filters?.brands
          )
            ? filtersData.filters.brands
            : []
        );

        setYears(
          Array.isArray(
            filtersData.filters?.years
          )
            ? filtersData.filters.years
            : []
        );
      }

      // ===============================================
      // DYNAMIC FUEL TYPES
      // PUBLIC OPTIONS API
      // ===============================================

      const fuelResponse =
        await fetch(
          `${API}/options/fuel-types`
        );

      const fuelData =
        await fuelResponse.json();

      if (
        fuelResponse.ok &&
        fuelData.success &&
        Array.isArray(
          fuelData.fuelTypes
        )
      ) {

        setFuelTypes(
          fuelData.fuelTypes
            .map(
              (item: {
                name: string;
              }) =>
                item.name
            )
            .filter(
              (name: string) =>
                Boolean(name?.trim())
            )
            .map(
              (name: string) =>
                name.trim()
            )
        );

      } else {
        setFuelTypes([]);
      }

      // ===============================================
      // DYNAMIC TRANSMISSIONS
      // PUBLIC OPTIONS API
      // ===============================================

      const transmissionResponse =
        await fetch(
          `${API}/options/transmissions`
        );

      const transmissionData =
        await transmissionResponse.json();

      if (
        transmissionResponse.ok &&
        transmissionData.success &&
        Array.isArray(
          transmissionData.transmissions
        )
      ) {

        setTransmissions(
          transmissionData.transmissions
            .map(
              (item: {
                name: string;
              }) =>
                item.name
            )
            .filter(
              (name: string) =>
                Boolean(name?.trim())
            )
            .map(
              (name: string) =>
                name.trim()
            )
        );

      } else {
        setTransmissions([]);
      }

    } catch (error) {

      console.error(
        "Failed to fetch car filters:",
        error
      );

      setFuelTypes([]);
      setTransmissions([]);

      toast.error("Failed to load car filters.", {
        description:
          error instanceof Error
            ? error.message
            : "Fuel types and transmissions could not be loaded.",
      });
    }
  };

  // ===================================================
  // FETCH DASHBOARD STATS
  // ===================================================

  const fetchDashboardStats =
    async () => {

      try {

        setDashboardLoading(
          true
        );

        setDashboardError("");

        const token =
          await getAuthToken();

        const response =
          await fetch(
            `${API}/admin/dashboard`,
            {
              method: "GET",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
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
              "Failed to load dashboard"
          );
        }

        setDashboardStats(
          data.stats ||
            defaultDashboardStats
        );

        setRecentCars(
          Array.isArray(
            data.recentCars
          )
            ? data.recentCars
            : []
        );

      } catch (error) {

        console.error(
          "Dashboard API Error:",
          error
        );

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load dashboard statistics.";

        setDashboardError(message);

        toast.error("Dashboard data failed to load.", {
          description: message,
        });

      } finally {

        setDashboardLoading(
          false
        );
      }
    };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {

    if (
      !authLoaded ||
      !isSignedIn
    ) {
      return;
    }

    fetchCars();
    fetchCarFilters();
    fetchDashboardStats();

  }, [
    authLoaded,
    isSignedIn,
    getToken,
  ]);

  // ===================================================
  // RESET PAGE SCROLL WHEN CHANGING ADMIN SECTIONS
  // ===================================================

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [activeSection]);

  // ===================================================
  // RESET PAGINATION
  // ===================================================

  useEffect(() => {

    setCurrentPage(1);

  }, [
    search,
    status,
    brand,
    fuelType,
    transmission,
    year,
  ]);

  // ===================================================
  // FILTER CARS
  // ===================================================

  const filteredCars =
    cars.filter(
      (car) => {

        const searchValue =
          search
            .trim()
            .toLowerCase();

        const matchesSearch =
          !searchValue ||
          car.brand
            ?.toLowerCase()
            .includes(
              searchValue
            ) ||
          car.model
            ?.toLowerCase()
            .includes(
              searchValue
            ) ||
          car.sellerName
            ?.toLowerCase()
            .includes(
              searchValue
            ) ||
          car.sellerEmail
            ?.toLowerCase()
            .includes(
              searchValue
            );

        const matchesStatus =
          status === "all" ||
          car.status ===
            status;

        const matchesBrand =
          brand === "all" ||
          car.brand ===
            brand;

        const matchesFuelType =
          fuelType === "all" ||
          car.fuelType ===
            fuelType;

        const matchesTransmission =
          transmission ===
            "all" ||
          car.transmission ===
            transmission;

        const matchesYear =
          year === "all" ||
          car.year
            ?.toString() ===
            year;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesBrand &&
          matchesFuelType &&
          matchesTransmission &&
          matchesYear
        );
      }
    );

  // ===================================================
  // PAGINATION
  // ===================================================

  const indexOfLastCar =
    currentPage *
    carsPerPage;

  const indexOfFirstCar =
    indexOfLastCar -
    carsPerPage;

  const currentCars =
    filteredCars.slice(
      indexOfFirstCar,
      indexOfLastCar
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredCars.length /
          carsPerPage
      )
    );

  // ===================================================
  // REFRESH
  // ===================================================

  const refreshDashboard =
    async () => {

      if (
        !authLoaded ||
        !isSignedIn
      ) {
        return;
      }

      try {
        await Promise.all([
          fetchCars(),
          fetchCarFilters(),
          fetchDashboardStats(),
        ]);

        toast.success("Dashboard refreshed successfully.");
      } catch (error) {
        toast.error("Dashboard refresh failed.", {
          description:
            error instanceof Error
              ? error.message
              : "Please try again.",
        });
      }
    };

  // ===================================================
  // DASHBOARD CONTENT
  // ===================================================

  const renderDashboard = () => {

    const {
      total,
      pending,
      approved,
      rejected,
    } = dashboardStats.cars;

    const {
      total: totalBookings,
      pending: pendingBookings,
      approved: approvedBookings,
      completed:
        completedBookings,
      rejected:
        rejectedBookings,
    } =
      dashboardStats.bookings;

    return (
      <div className="w-full max-w-full overflow-hidden">

        {/* ADMIN HERO */}
        <section className="relative mb-8 overflow-hidden rounded-[2rem] bg-[#111] px-6 py-8 text-white shadow-xl sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#ff4054]/15 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-[#ff4054]/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#ff4054] sm:text-xs">
              AutoLux Management
            </p>

            <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Welcome to your
              <span className="text-[#ff4054]"> Admin Dashboard.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
              Keep track of your cars, bookings and dealership activity
              from one powerful place.
            </p>

          
          </div>
        </section>

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">

          <div className="min-w-0">

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff4054] sm:text-sm">
              Overview
            </p>

            <h1 className="mt-1 truncate text-2xl font-black text-gray-900 sm:text-3xl lg:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              Manage your AutoLux
              dealership from one
              place.
            </p>

          </div>

          <button
            type="button"
            onClick={
              refreshDashboard
            }
            disabled={
              dashboardLoading ||
              loading
            }
            className="
              flex
              w-full
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gray-900
              px-4
              py-3
              text-sm
              font-bold
              text-white
              transition
              hover:bg-gray-800
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto
            "
          >
            <RefreshCw
              size={17}
              className={
                dashboardLoading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

        </div>

        {/* ERROR */}

        {dashboardError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {dashboardError}
          </div>
        )}

        {/* CAR STATS */}

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Cars"
            value={total}
            icon={
              <Car size={21} />
            }
            color="blue"
          />

          <StatCard
            title="Pending Cars"
            value={pending}
            icon={
              <Clock size={21} />
            }
            color="orange"
          />

          <StatCard
            title="Approved Cars"
            value={approved}
            icon={
              <CheckCircle
                size={21}
              />
            }
            color="green"
          />

          <StatCard
            title="Rejected Cars"
            value={rejected}
            icon={
              <XCircle size={21} />
            }
            color="red"
          />

        </div>

        {/* BOOKING STATS */}

        <div className="mt-7 min-w-0 sm:mt-8">

          <h2 className="mb-4 text-xl font-black text-gray-900 sm:mb-5 sm:text-2xl">
            Booking Overview
          </h2>

          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">

            <StatCard
              title="Total Bookings"
              value={
                totalBookings
              }
              icon={
                <CalendarCheck
                  size={21}
                />
              }
              color="blue"
            />

            <StatCard
              title="Pending"
              value={
                pendingBookings
              }
              icon={
                <Clock size={21} />
              }
              color="orange"
            />

            <StatCard
              title="Approved"
              value={
                approvedBookings
              }
              icon={
                <CheckCircle
                  size={21}
                />
              }
              color="green"
            />

            <StatCard
              title="Completed"
              value={
                completedBookings
              }
              icon={
                <CheckCircle
                  size={21}
                />
              }
              color="purple"
            />

            <StatCard
              title="Rejected"
              value={
                rejectedBookings
              }
              icon={
                <XCircle
                  size={21}
                />
              }
              color="red"
            />

          </div>

        </div>

        {/* RECENT CARS */}

        <div className="mt-7 w-full max-w-full overflow-hidden rounded-2xl bg-white shadow-sm sm:mt-8">

          <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">

            <div className="min-w-0">

              <h2 className="truncate text-xl font-black text-gray-900 sm:text-2xl">
                Recent Cars
              </h2>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Latest cars added to
                AutoLux.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "cars"
                )
              }
              className="self-start text-sm font-bold text-[#ff4054] hover:underline sm:self-auto"
            >
              View All
            </button>

          </div>

          {dashboardLoading ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Loading recent
              cars...
            </div>
          ) : recentCars.length === 0 ? (
            <div className="m-4 rounded-xl bg-gray-50 py-10 text-center text-sm text-gray-500 sm:m-6">
              No cars available.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">

              {recentCars.map(
                (car) => (
                  <div
                    key={car._id}
                    className="flex min-w-0 items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4"
                  >

                    <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-16 sm:w-20">

                      <img
                        src={
                          car.image ||
                          "/default-car.jpg"
                        }
                        alt={`${car.brand} ${car.model}`}
                        className="h-full w-full object-cover"
                        onError={(
                          event
                        ) => {
                          event.currentTarget.src =
                            "/default-car.jpg";
                        }}
                      />

                    </div>

                    <div className="min-w-0 flex-1">

                      <h3 className="truncate text-sm font-bold text-gray-900 sm:text-base">
                        {car.brand}{" "}
                        {car.model}
                      </h3>

                      <p className="truncate text-xs text-gray-500 sm:text-sm">
                        {car.year} • ₹
                        {Number(
                          car.price
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>

                    <div className="shrink-0">

                      <StatusBadge
                        status={
                          car.status
                        }
                      />

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

        {/* CAR MANAGEMENT */}

        <div className="mt-8 w-full max-w-full min-w-0 sm:mt-10">

          <div className="mb-5">

            <h2 className="text-xl font-black text-gray-900 sm:text-2xl">
              Car Management
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Search, filter and
              manage dealership
              cars.
            </p>

          </div>

          {/* SEARCH */}

          <div className="w-full min-w-0">

            <AdminSearch
              search={search}
              setSearch={setSearch}
            />

          </div>

          {/* FILTER */}

          <div className="mt-4 w-full min-w-0">

            <AdminFilter
              status={status}
              setStatus={setStatus}

              brand={brand}
              setBrand={setBrand}

              fuelType={fuelType}
              setFuelType={
                setFuelType
              }

              transmission={
                transmission
              }

              setTransmission={
                setTransmission
              }

              year={year}
              setYear={setYear}

              brands={brands}

              fuelTypes={
                fuelTypes
              }

              transmissions={
                transmissions
              }

              years={years}

              onReset={() => {
                setStatus("all");
                setBrand("all");
                setFuelType("all");
                setTransmission(
                  "all"
                );
                setYear("all");
                setSearch("");
              }}
            />

          </div>

          {/* TABLE */}

          <div className="mt-6 w-full min-w-0 max-w-full overflow-hidden sm:mt-8">

            {loading ? (

              <div className="rounded-2xl bg-white p-8 text-center shadow-sm sm:p-10">

                <h2 className="text-lg font-bold sm:text-xl">
                  Loading Cars...
                </h2>

              </div>

            ) : filteredCars.length === 0 ? (

              <div className="rounded-2xl bg-white p-8 text-center shadow-sm sm:p-10">

                <h2 className="text-lg font-bold sm:text-xl">
                  No Cars Found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing
                  your search or
                  filter.
                </p>

              </div>

            ) : (

              <>

                <div
                  className="
                    w-full
                    min-w-0
                    max-w-full
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    shadow-sm

                    [&_table]:w-full
                    [&_table]:max-w-full
                    [&_table]:table-fixed
                    [&_table]:text-sm

                    [&_th]:truncate
                    [&_td]:truncate
                    [&_th]:px-2
                    [&_td]:px-2
                    [&_th]:py-3
                    [&_td]:py-3

                    sm:[&_th]:px-3
                    sm:[&_td]:px-3
                  "
                >

                  <AdminTable
                    cars={
                      currentCars
                    }
                    setCars={
                      setCars
                    }
                  />

                </div>

                {/* PAGINATION */}

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">

                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      1
                    }
                    onClick={() =>
                      setCurrentPage(
                        (prev) =>
                          prev - 1
                      )
                    }
                    className="
                      rounded-lg
                      bg-gray-800
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-gray-700
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    Previous
                  </button>

                  <span className="whitespace-nowrap text-sm font-bold text-gray-700">
                    Page{" "}
                    {
                      currentPage
                    }{" "}
                    of{" "}
                    {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        (prev) =>
                          prev + 1
                      )
                    }
                    className="
                      rounded-lg
                      bg-[#ff4054]
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-[#e9364a]
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    Next
                  </button>

                </div>

              </>
            )}

          </div>

        </div>

      </div>
    );
  };

  // ===================================================
  // OTHER SECTIONS
  // ===================================================

  const renderSection = () => {

    switch (
      activeSection
    ) {

      case "dashboard":
      case "cars":
        return renderDashboard();

      case "bookings":
        return (
          <SectionPlaceholder
            title="Bookings"
            description="Booking management will be added here."
          />
        );

      case "users":
        return (
          <SectionPlaceholder
            title="Users"
            description="User management will be added here."
          />
        );

      case "wishlist":
        return (
          <SectionPlaceholder
            title="Wishlist"
            description="Wishlist management will be added here."
          />
        );

      case "reviews":
        return (
          <SectionPlaceholder
            title="Reviews"
            description="Review management will be added here."
          />
        );

      case "enquiries":
        return (
          <SectionPlaceholder
            title="Enquiries"
            description="Enquiry management will be added here."
          />
        );

      default:
        return renderDashboard();
    }
  };

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-100">

      <AdminSidebar
        activeSection={
          activeSection
        }
        setActiveSection={
          setActiveSection
        }
        isOpen={
          sidebarOpen
        }
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div className="min-h-screen w-full min-w-0 lg:ml-64 lg:w-[calc(100%-16rem)]">

        {/* MOBILE HEADER */}

        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-gray-200 bg-white/95 px-4 shadow-sm backdrop-blur lg:hidden">

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(true)
            }
            className="rounded-xl bg-gray-100 p-2.5 text-gray-700 transition hover:bg-gray-200"
            aria-label="Open admin menu"
          >
            <Menu size={22} />
          </button>

          <div className="ml-4 min-w-0">

            <h2 className="font-black text-gray-900">
              Auto
              <span className="text-[#ff4054]">
                Lux
              </span>
            </h2>

            <p className="text-xs text-gray-500">
              Admin Panel
            </p>

          </div>

        </header>

        {/* MAIN */}

        <main className="min-h-screen w-full min-w-0 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

          <div className="mx-auto w-full max-w-[1600px] min-w-0">

            {renderSection()}

          </div>

        </main>

      </div>

    </div>
  );
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
  title,
  value,
  icon,
  color,
}: StatCardProps) => {

  const colors = {

    blue: {
      box: "bg-blue-50",
      icon: "text-blue-600",
    },

    orange: {
      box: "bg-orange-50",
      icon: "text-orange-600",
    },

    green: {
      box: "bg-green-50",
      icon: "text-green-600",
    },

    red: {
      box: "bg-red-50",
      icon: "text-red-600",
    },

    purple: {
      box: "bg-purple-50",
      icon: "text-purple-600",
    },

  };

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl bg-white p-4 shadow-sm sm:p-5">

      <div
        className={`
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          ${colors[color].box}
          ${colors[color].icon}
        `}
      >
        {icon}
      </div>

      <p className="mt-4 truncate text-sm font-semibold text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">
        {value.toLocaleString(
          "en-IN"
        )}
      </p>

    </div>
  );
};

// =====================================================
// STATUS BADGE
// =====================================================

const StatusBadge = ({
  status,
}: {
  status: string;
}) => {

  const normalized =
    status?.toLowerCase() ||
    "";

  const styles: Record<
    string,
    string
  > = {

    approved:
      "bg-green-100 text-green-700",

    pending:
      "bg-orange-100 text-orange-700",

    rejected:
      "bg-red-100 text-red-700",

    completed:
      "bg-blue-100 text-blue-700",

    cancelled:
      "bg-gray-100 text-gray-700",

  };

  return (
    <span
      className={`
        inline-flex
        max-w-full
        whitespace-nowrap
        rounded-full
        px-3
        py-1
        text-[10px]
        font-bold
        uppercase
        sm:text-xs
        ${
          styles[normalized] ||
          "bg-gray-100 text-gray-600"
        }
      `}
    >
      {normalized ||
        "unknown"}
    </span>
  );
};

// =====================================================
// PLACEHOLDER
// =====================================================

const SectionPlaceholder = ({
  title,
  description,
}: SectionPlaceholderProps) => {

  return (
    <div className="w-full min-w-0">

      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff4054] sm:text-sm">
        Management
      </p>

      <h1 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl lg:text-4xl">
        {title}
      </h1>

      <p className="mt-2 text-sm text-gray-500 sm:text-base">
        {description}
      </p>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">

        <h2 className="text-xl font-black text-gray-900 sm:text-2xl">
          {title}
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm text-gray-500">
          This section is ready
          for the next
          implementation step.
        </p>

      </div>

    </div>
  );
};

export default AdminDashboard;