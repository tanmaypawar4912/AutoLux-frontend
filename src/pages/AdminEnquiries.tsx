import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import {
  Mail,
  User,
  Car,
  MessageSquare,
  CheckCircle,
  Clock,
  Trash2,
  RefreshCw,
} from "lucide-react";

import AdminSidebar from "../components/admin/AdminSidebar";
import { API } from "../utils/api";

interface CarInfo {
  _id: string;
  brand: string;
  model: string;
  year?: number;
  price?: number;
  image?: string;
}

interface Enquiry {
  _id: string;
  carId: CarInfo | string;
  carBrand: string;
  carModel: string;
  sellerEmail: string;
  name: string;
  email: string;
  message: string;
  status: "New" | "Responded";
  createdAt?: string;
}

interface EnquiryResponse {
  success: boolean;
  count: number;
  stats?: {
    total: number;
    new: number;
    responded: number;
  };
  enquiries: Enquiry[];
}

const AdminEnquiries = () => {
  const {
    isLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  const [enquiries, setEnquiries] =
    useState<Enquiry[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingId, setLoadingId] =
    useState("");

  const [error, setError] =
    useState("");

  const [activeSection, setActiveSection] =
    useState("enquiries");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // =====================================
  // FETCH ENQUIRIES
  // =====================================

  const fetchEnquiries = async (
    showToast = false
  ) => {
    try {
      setLoading(true);
      setError("");

      if (!isLoaded || !isSignedIn) {
        throw new Error(
          "Please login first."
        );
      }

      const token =
        await getToken();

      if (!token) {
        throw new Error(
          "Authentication token not available."
        );
      }

      console.log(
        "ADMIN ENQUIRIES TOKEN: TOKEN RECEIVED ✅"
      );

      const response = await fetch(
        `${API}/enquiries/admin`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      const data: EnquiryResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
            "Failed to load enquiries"
        );
      }

      setEnquiries(
        Array.isArray(data.enquiries)
          ? data.enquiries
          : []
      );

      if (showToast) {
        toast.success("Enquiries refreshed.");
      }
    } catch (error) {
      console.error(
        "Fetch Enquiries Error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to load enquiries";

      setError(message);

      toast.error("Failed to load enquiries.", {
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
      toast.warning("Please login first.");
      return;
    }

    fetchEnquiries();
  }, [
    isLoaded,
    isSignedIn,
    getToken,
  ]);

  // =====================================
  // UPDATE STATUS
  // =====================================

  const updateStatus = async (
    id: string,
    status: "New" | "Responded"
  ) => {
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
        `${API}/enquiries/${id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status,
          }),
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
            "Failed to update enquiry"
        );
      }

      setEnquiries((previous) =>
        previous.map((enquiry) =>
          enquiry._id === id
            ? {
                ...enquiry,
                status,
              }
            : enquiry
        )
      );

      toast.success(
        status === "Responded"
          ? "Enquiry marked as responded."
          : "Enquiry marked as new."
      );
    } catch (error) {
      console.error(
        "Update Enquiry Error:",
        error
      );

      toast.error("Unable to update enquiry.", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    } finally {
      setLoadingId("");
    }
  };

  // =====================================
  // DELETE ENQUIRY
  // =====================================

  const deleteEnquiry = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this enquiry?"
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
        `${API}/enquiries/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
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
            "Failed to delete enquiry"
        );
      }

      setEnquiries((previous) =>
        previous.filter(
          (enquiry) =>
            enquiry._id !== id
        )
      );

      toast.success("Enquiry deleted successfully.", {
        description: "The customer enquiry has been removed.",
      });
    } catch (error) {
      console.error(
        "Delete Enquiry Error:",
        error
      );

      toast.error("Unable to delete enquiry.", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
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
      return "Unknown";
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
  // STATISTICS
  // =====================================

  const total =
    enquiries.length;

  const newCount =
    enquiries.filter(
      (item) =>
        item.status === "New"
    ).length;

  const respondedCount =
    enquiries.filter(
      (item) =>
        item.status ===
        "Responded"
    ).length;

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

        <div className="px-6 py-8 lg:px-8">

          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(true)
            }
            className="
              mb-6
              rounded-xl
              bg-[#111]
              px-4
              py-3
              font-bold
              text-white
              lg:hidden
            "
          >
            ☰ Admin Menu
          </button>

          {/* HEADER */}

          <div
            className="
              mb-8
              flex
              flex-col
              justify-between
              gap-4
              sm:flex-row
              sm:items-center
            "
          >

            <div>

              <p
                className="
                  text-sm
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#ff4054]
                "
              >
                Management
              </p>

              <h1
                className="
                  mt-2
                  text-4xl
                  font-black
                  text-gray-900
                "
              >
                Enquiries
              </h1>

              <p className="mt-2 text-gray-500">
                Manage customer enquiries
                for your vehicles.
              </p>

            </div>

            <button
              type="button"
              onClick={async () => {
                await fetchEnquiries(true);
              }}
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
                font-bold
                text-white
                transition
                hover:bg-[#e9364a]
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
                Failed to load enquiries
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

              <button
                type="button"
               onClick={() => fetchEnquiries()}
               
                className="
                  mt-4
                  rounded-lg
                  bg-red-600
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-white
                "
              >
                Try Again
              </button>

            </div>
          )}

          {/* STATS */}

          <div
            className="
              mb-8
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-3
            "
          >

            {/* TOTAL */}

            <div
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-gray-500">
                    Total Enquiries
                  </p>

                  <p className="mt-2 text-4xl font-black text-gray-900">
                    {total}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-700">

                  <MessageSquare
                    size={22}
                  />

                </div>

              </div>

            </div>

            {/* NEW */}

            <div
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-gray-500">
                    New
                  </p>

                  <p className="mt-2 text-4xl font-black text-yellow-500">
                    {newCount}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">

                  <Clock size={22} />

                </div>

              </div>

            </div>

            {/* RESPONDED */}

            <div
              className="
                rounded-2xl
                bg-white
                p-6
                shadow-sm
              "
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-gray-500">
                    Responded
                  </p>

                  <p className="mt-2 text-4xl font-black text-green-500">
                    {respondedCount}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">

                  <CheckCircle
                    size={22}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* TABLE */}

          <div
            className="
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-sm
            "
          >

            <div className="border-b border-gray-100 px-6 py-5">

              <h2 className="text-xl font-black text-gray-900">
                Customer Enquiries
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {total} enquiry
                {total !== 1
                  ? "ies"
                  : ""}{" "}
                found
              </p>

            </div>

            {loading ? (

              <div className="p-12 text-center">

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
                  Loading enquiries...
                </p>

              </div>

            ) : enquiries.length ===
              0 ? (

              <div className="p-12 text-center">

                <MessageSquare
                  size={42}
                  className="mx-auto text-gray-300"
                />

                <h3 className="mt-4 text-xl font-black text-gray-800">
                  No Enquiries Found
                </h3>

                <p className="mt-2 text-gray-500">
                  There are currently no
                  customer enquiries.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table
                  className="
                    w-full
                    min-w-[1050px]
                  "
                >

                  <thead className="bg-gray-50">

                    <tr>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                        Customer
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                        Car
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                        Message
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                        Date
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {enquiries.map(
                      (enquiry) => {

                        const isLoading =
                          loadingId ===
                          enquiry._id;

                        return (
                          <tr
                            key={
                              enquiry._id
                            }
                            className="
                              border-t
                              border-gray-100
                              transition
                              hover:bg-gray-50
                            "
                          >

                            {/* CUSTOMER */}

                            <td className="px-5 py-5">

                              <div className="flex items-start gap-3">

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

                                <div>

                                  <p className="font-bold text-gray-900">
                                    {
                                      enquiry.name
                                    }
                                  </p>

                                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">

                                    <Mail
                                      size={12}
                                    />

                                    {
                                      enquiry.email
                                    }

                                  </div>

                                </div>

                              </div>

                            </td>

                            {/* CAR */}

                            <td className="px-5 py-5">

                              <div className="flex items-center gap-3">

                                <div
                                  className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-gray-100
                                    text-gray-600
                                  "
                                >

                                  <Car
                                    size={18}
                                  />

                                </div>

                                <div>

                                  <p className="font-bold text-gray-900">
                                    {
                                      enquiry.carBrand
                                    }
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    {
                                      enquiry.carModel
                                    }
                                  </p>

                                </div>

                              </div>

                            </td>

                            {/* MESSAGE */}

                            <td className="max-w-[300px] px-5 py-5">

                              <div className="rounded-xl bg-gray-50 p-3">

                                <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                                  {
                                    enquiry.message
                                  }
                                </p>

                              </div>

                            </td>

                            {/* DATE */}

                            <td className="px-5 py-5">

                              <p className="text-sm font-semibold text-gray-700">
                                {formatDate(
                                  enquiry.createdAt
                                )}
                              </p>

                            </td>

                            {/* STATUS */}

                            <td className="px-5 py-5">

                              <span
                                className={`
                                  inline-flex
                                  rounded-full
                                  px-3
                                  py-1.5
                                  text-xs
                                  font-bold
                                  ${
                                    enquiry.status ===
                                    "Responded"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }
                                `}
                              >
                                {
                                  enquiry.status
                                }
                              </span>

                            </td>

                            {/* ACTIONS */}

                            <td className="px-5 py-5">

                              <div className="flex items-center justify-center gap-2">

                                {enquiry.status ===
                                  "New" && (
                                  <button
                                    type="button"
                                    disabled={
                                      isLoading
                                    }
                                    onClick={() =>
                                      updateStatus(
                                        enquiry._id,
                                        "Responded"
                                      )
                                    }
                                    title="Mark as Responded"
                                    className="
                                      flex
                                      h-9
                                      w-9
                                      items-center
                                      justify-center
                                      rounded-lg
                                      bg-green-500
                                      text-white
                                      transition
                                      hover:bg-green-600
                                      disabled:opacity-50
                                    "
                                  >
                                    <CheckCircle
                                      size={17}
                                    />
                                  </button>
                                )}

                                {enquiry.status ===
                                  "Responded" && (
                                  <button
                                    type="button"
                                    disabled={
                                      isLoading
                                    }
                                    onClick={() =>
                                      updateStatus(
                                        enquiry._id,
                                        "New"
                                      )
                                    }
                                    title="Mark as New"
                                    className="
                                      flex
                                      h-9
                                      w-9
                                      items-center
                                      justify-center
                                      rounded-lg
                                      bg-yellow-500
                                      text-white
                                      transition
                                      hover:bg-yellow-600
                                      disabled:opacity-50
                                    "
                                  >
                                    <Clock
                                      size={17}
                                    />
                                  </button>
                                )}

                                <button
                                  type="button"
                                  disabled={
                                    isLoading
                                  }
                                  onClick={() =>
                                    deleteEnquiry(
                                      enquiry._id
                                    )
                                  }
                                  title="Delete Enquiry"
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
                                    disabled:opacity-50
                                  "
                                >
                                  {isLoading ? (
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

            )}

          </div>

        </div>

      </main>

    </div>
  );
};

export default AdminEnquiries;