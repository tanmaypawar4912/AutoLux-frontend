import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

import { API } from "../utils/api";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminBookingTable from "../components/admin/AdminBookingTable";

interface Booking {
  _id: string;
  carId: string;

  carBrand: string;
  carModel: string;
  carImage?: string;

  sellerEmail: string;

  customerName: string;
  customerEmail: string;
  customerPhone: string;

  preferredDate: string;
  preferredTime: string;

  message?: string;

  status: string;
  createdAt?: string;
}

const AdminBookings = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const [activeSection, setActiveSection] =
    useState("bookings");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================
  // FETCH BOOKINGS
  // =====================================

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      // =====================================
      // CHECK CLERK
      // =====================================

      if (!isLoaded || !isSignedIn) {
        throw new Error("Please login first.");
      }

      // =====================================
      // GET CLERK TOKEN
      // =====================================

      const token = await getToken();

      if (!token) {
        throw new Error(
          "Authentication token not available."
        );
      }

      console.log(
        "ADMIN BOOKINGS TOKEN: TOKEN RECEIVED ✅"
      );

      // =====================================
      // API REQUEST
      // =====================================

      const response = await fetch(
        `${API}/bookings`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load bookings"
        );
      }

      setBookings(
        Array.isArray(data.bookings)
          ? data.bookings
          : []
      );
    } catch (error) {
      console.error(
        "Fetch Bookings Error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to load bookings.";

      setError(message);

      toast.error("Failed to load bookings.", {
        description: message,
      });
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
      toast.warning("Please login first.", {
        description:
          "You need to be signed in to view admin bookings.",
      });
      return;
    }

    fetchBookings();
  }, [
    isLoaded,
    isSignedIn,
    getToken,
  ]);

  // =====================================
  // STATISTICS
  // =====================================

  const totalBookings =
    bookings.length;

  const pendingBookings =
    bookings.filter(
      (booking) =>
        booking.status?.toLowerCase() ===
        "pending"
    ).length;

  const approvedBookings =
    bookings.filter(
      (booking) =>
        booking.status?.toLowerCase() ===
        "approved"
    ).length;

  const completedBookings =
    bookings.filter(
      (booking) =>
        booking.status?.toLowerCase() ===
        "completed"
    ).length;

  const cancelledBookings =
    bookings.filter((booking) => {
      const currentStatus =
        booking.status?.toLowerCase();

      return (
        currentStatus === "cancelled" ||
        currentStatus === "rejected"
      );
    }).length;

  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">

      {/* =================================
          SIDEBAR
      ================================= */}

      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={
          setActiveSection
        }
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* =================================
          MAIN CONTENT
      ================================= */}

      <div
        className="
          min-h-screen
          min-w-0
          w-full
          overflow-x-hidden
          lg:ml-64
          lg:w-[calc(100%-16rem)]
        "
      >
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
        />
        {/* =================================
            MAIN
        ================================= */}

        <main
          className="
            min-h-screen
            min-w-0
            w-full
            overflow-x-hidden
            px-4
            py-6
            sm:px-6
            sm:py-8
            lg:px-6
            lg:py-8
            xl:px-8
          "
        >

          <div className="mx-auto w-full min-w-0 max-w-[1600px]">

            {/* =================================
                PAGE HEADER
            ================================= */}

            <div
              className="
                mb-6
                flex
                min-w-0
                flex-col
                gap-4
                sm:mb-8
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >

              <div className="min-w-0">

                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-[#ff4054]
                    sm:text-sm
                  "
                >
                  Management
                </p>

                <h1
                  className="
                    mt-1
                    text-2xl
                    font-black
                    text-gray-900
                    sm:text-3xl
                    lg:text-4xl
                  "
                >
                  Bookings
                </h1>

                <p
                  className="
                    mt-1
                    max-w-2xl
                    text-sm
                    text-gray-500
                    sm:text-base
                  "
                >
                  Manage customer car
                  bookings from your
                  dealership.
                </p>

              </div>

              {/* REFRESH */}

              <button
                type="button"
                onClick={fetchBookings}
                disabled={loading}
                className="
                  flex
                  w-full
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gray-900
                  px-5
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

            {/* =================================
                STATISTICS
            ================================= */}

            <div
              className="
                mb-6
                grid
                min-w-0
                grid-cols-1
                gap-4
                sm:grid-cols-2
                lg:grid-cols-4
                2xl:grid-cols-5
              "
            >

              <StatCard
                label="Total"
                value={totalBookings}
                color="gray"
              />

              <StatCard
                label="Pending"
                value={pendingBookings}
                color="yellow"
              />

              <StatCard
                label="Approved"
                value={approvedBookings}
                color="green"
              />

              <StatCard
                label="Completed"
                value={completedBookings}
                color="blue"
              />

              <StatCard
                label="Cancelled"
                value={cancelledBookings}
                color="red"
              />

            </div>

            {/* =================================
                ERROR
            ================================= */}

            {error && (
              <div
                className="
                  mb-6
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  p-4
                  sm:p-5
                "
              >

                <p className="font-bold text-red-700">
                  Failed to load bookings
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await fetchBookings();

                      if (isSignedIn) {
                        toast.success("Bookings refreshed successfully.");
                      }
                    } catch {
                      toast.error("Failed to refresh bookings.");
                    }
                  }}
                  className="
                    mt-4
                    rounded-lg
                    bg-red-600
                    px-4
                    py-2
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-red-700
                  "
                >
                  Try Again
                </button>

              </div>
            )}

            {/* =================================
                BOOKINGS
            ================================= */}

            {loading ? (
              <div
                className="
                  rounded-2xl
                  bg-white
                  p-8
                  text-center
                  shadow-sm
                  sm:p-12
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

                <p className="mt-4 text-sm font-semibold text-gray-600 sm:text-base">
                  Loading bookings...
                </p>

              </div>
            ) : bookings.length === 0 ? (
              <div
                className="
                  rounded-2xl
                  bg-white
                  p-8
                  text-center
                  shadow-sm
                  sm:p-12
                "
              >

                <h2 className="text-xl font-black text-gray-900 sm:text-2xl">
                  No Bookings Found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                  There are currently no
                  customer bookings available.
                </p>

              </div>
            ) : (
              <div className="min-w-0 w-full overflow-hidden">

                <AdminBookingTable
                  bookings={bookings}
                  setBookings={
                    setBookings
                  }
                />

              </div>
            )}

          </div>
        </main>

      </div>
    </div>
  );
};

// =====================================
// STAT CARD
// =====================================

interface StatCardProps {
  label: string;
  value: number;
  color:
    | "gray"
    | "yellow"
    | "green"
    | "blue"
    | "red";
}

const StatCard = ({
  label,
  value,
  color,
}: StatCardProps) => {

  const colors = {
    gray: "bg-gray-50 text-gray-700",
    yellow:
      "bg-yellow-50 text-yellow-700",
    green:
      "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div
      className="
        min-w-0
        w-full
        rounded-2xl
        bg-white
        p-4
        shadow-sm
        transition
        hover:shadow-md
        sm:p-5
      "
    >

      <span
        className={`
          inline-flex
          rounded-lg
          px-3
          py-1
          text-xs
          font-bold
          uppercase
          ${colors[color]}
        `}
      >
        {label}
      </span>

      <p
        className="
          mt-4
          text-3xl
          font-black
          text-gray-900
          sm:text-4xl
        "
      >
        {value.toLocaleString("en-IN")}
      </p>

    </div>
  );
};

export default AdminBookings;