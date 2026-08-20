import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  Phone,
  Mail,
  User,
} from "lucide-react";

import { API } from "../../utils/api";
import { toast } from "sonner";

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

interface AdminBookingTableProps {
  bookings: Booking[];
  setBookings: React.Dispatch<
    React.SetStateAction<Booking[]>
  >;
}

const AdminBookingTable = ({
  bookings,
  setBookings,
}: AdminBookingTableProps) => {

  const [loadingId, setLoadingId] =
    useState("");

  // =====================================
  // NORMALIZE STATUS
  // =====================================

  const normalizeStatus = (
    status?: string
  ) => {
    return (
      status?.trim().toLowerCase() ||
      "pending"
    );
  };

  // =====================================
  // UPDATE STATUS
  // =====================================

  const updateBookingStatus = async (
    id: string,
    newStatus:
      | "approved"
      | "rejected"
      | "completed"
      | "cancelled"
  ) => {

    try {

      setLoadingId(id);

      const response = await fetch(
        `${API}/bookings/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
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
            "Failed to update booking status"
        );
      }

      setBookings(
        (previousBookings) =>
          previousBookings.map(
            (booking) =>
              booking._id === id
                ? {
                    ...booking,
                    status:
                      newStatus,
                  }
                : booking
          )
      );

      const statusMessages: Record<string, string> = {
        approved: "Booking approved successfully! 🚗",
        rejected: "Booking rejected successfully.",
        completed: "Booking marked as completed.",
        cancelled: "Booking cancelled successfully.",
      };

      toast.success(
        statusMessages[newStatus] ||
          "Booking status updated successfully."
      );

    } catch (error) {

      console.error(
        "Update Booking Status Error:",
        error
      );

      toast.error(
        "Failed to update booking status.",
        {
          description:
            error instanceof Error
              ? error.message
              : "Unable to update booking status.",
        }
      );

    } finally {

      setLoadingId("");

    }
  };

  // =====================================
  // DELETE BOOKING
  // =====================================

  const deleteBooking = async (
    id: string
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this booking?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setLoadingId(id);

      const response = await fetch(
        `${API}/bookings/${id}`,
        {
          method: "DELETE",
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
            "Failed to delete booking"
        );
      }

      setBookings(
        (previousBookings) =>
          previousBookings.filter(
            (booking) =>
              booking._id !== id
          )
      );

      toast.success("Booking deleted successfully! 🗑️", {
        description:
          "The booking has been removed from the admin list.",
      });

    } catch (error) {

      console.error(
        "Delete Booking Error:",
        error
      );

      toast.error(
        "Failed to delete booking.",
        {
          description:
            error instanceof Error
              ? error.message
              : "Unable to delete booking.",
        }
      );

    } finally {

      setLoadingId("");

    }
  };

  // =====================================
  // STATUS COLOR
  // =====================================

  const getStatusClass = (
    status?: string
  ) => {

    switch (
      normalizeStatus(status)
    ) {

      case "approved":
        return "bg-green-100 text-green-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "cancelled":
        return "bg-gray-100 text-gray-700";

      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // =====================================
  // STATUS LABEL
  // =====================================

  const getStatusLabel = (
    status?: string
  ) => {

    const normalized =
      normalizeStatus(status);

    return (
      normalized.charAt(0).toUpperCase() +
      normalized.slice(1)
    );
  };

  // =====================================
  // FORMAT DATE
  // =====================================

  const formatDate = (
    date?: string
  ) => {

    if (!date) {
      return "Not specified";
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
  // EMPTY STATE
  // =====================================

  if (bookings.length === 0) {

    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm sm:p-12">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <Clock size={28} />
        </div>

        <h2 className="mt-4 text-xl font-black text-gray-800">
          No Bookings Found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          There are currently no customer bookings.
        </p>

      </div>
    );
  }

  // =====================================
  // ACTION BUTTONS
  // =====================================

  const ActionButtons = ({
    booking,
    status,
    mobile = false,
  }: {
    booking: Booking;
    status: string;
    mobile?: boolean;
  }) => {

    const isLoading =
      loadingId === booking._id;

    return (
      <div
        className={`
          flex
          items-center
          ${
            mobile
              ? "w-full justify-end gap-2"
              : "justify-center gap-1.5"
          }
        `}
      >

        {/* PENDING */}

        {status === "pending" && (
          <>
            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                updateBookingStatus(
                  booking._id,
                  "approved"
                )
              }
              title="Approve Booking"
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-green-500
                text-white
                transition
                hover:bg-green-600
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isLoading ? (
                <span className="text-xs">
                  ...
                </span>
              ) : (
                <CheckCircle size={16} />
              )}
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                updateBookingStatus(
                  booking._id,
                  "rejected"
                )
              }
              title="Reject Booking"
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-red-500
                text-white
                transition
                hover:bg-red-600
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isLoading ? (
                <span className="text-xs">
                  ...
                </span>
              ) : (
                <XCircle size={16} />
              )}
            </button>
          </>
        )}

        {/* APPROVED */}

        {status === "approved" && (
          <>
            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                updateBookingStatus(
                  booking._id,
                  "completed"
                )
              }
              title="Mark as Completed"
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-blue-500
                text-white
                transition
                hover:bg-blue-600
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isLoading ? (
                <span className="text-xs">
                  ...
                </span>
              ) : (
                <CheckCircle size={16} />
              )}
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                updateBookingStatus(
                  booking._id,
                  "cancelled"
                )
              }
              title="Cancel Booking"
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-gray-500
                text-white
                transition
                hover:bg-gray-600
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isLoading ? (
                <span className="text-xs">
                  ...
                </span>
              ) : (
                <XCircle size={16} />
              )}
            </button>
          </>
        )}

        {/* COMPLETED / REJECTED / CANCELLED */}

        {(status === "completed" ||
          status === "rejected" ||
          status === "cancelled") && (
          <span className="hidden text-xs font-medium text-gray-400 xl:inline">
            No actions
          </span>
        )}

        {/* DELETE */}

        <button
          type="button"
          disabled={isLoading}
          onClick={() =>
            deleteBooking(
              booking._id
            )
          }
          title="Delete Booking"
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-gray-800
            text-white
            transition
            hover:bg-black
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {isLoading ? (
            <span className="text-xs">
              ...
            </span>
          ) : (
            <Trash2 size={15} />
          )}
        </button>

      </div>
    );
  };

  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="min-w-0 w-full overflow-hidden rounded-2xl bg-white shadow-sm">

      {/* HEADER */}

      <div className="border-b border-gray-100 px-4 py-5 sm:px-5">

        <h2 className="text-xl font-black text-gray-900">
          All Bookings
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {bookings.length} booking
          {bookings.length !== 1
            ? "s"
            : ""}{" "}
          found
        </p>

      </div>

      {/* =====================================
          DESKTOP TABLE

          IMPORTANT:
          table-fixed prevents content
          from expanding page width.
      ===================================== */}

      <div className="hidden w-full overflow-hidden lg:block">

        <table className="w-full table-fixed">

          <colgroup>
            <col className="w-[27%]" />
            <col className="w-[20%]" />
            <col className="w-[22%]" />
            <col className="w-[14%]" />
            <col className="w-[17%]" />
          </colgroup>

          <thead className="bg-gray-50">

            <tr>

              <th className="px-3 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500 xl:px-4">
                Customer
              </th>

              <th className="px-3 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500 xl:px-4">
                Car
              </th>

              <th className="px-3 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500 xl:px-4">
                Date & Time
              </th>

              <th className="px-3 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500 xl:px-4">
                Status
              </th>

              <th className="px-2 py-4 text-center text-[10px] font-bold uppercase tracking-wider text-gray-500 xl:px-3">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {bookings.map(
              (booking) => {

                const status =
                  normalizeStatus(
                    booking.status
                  );

                return (
                  <tr
                    key={booking._id}
                    className="
                      border-t
                      border-gray-100
                      transition-colors
                      hover:bg-gray-50
                    "
                  >

                    {/* CUSTOMER */}

                    <td className="min-w-0 px-3 py-4 xl:px-4">

                      <div className="flex min-w-0 items-start gap-2">

                        <div
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#ff4054]/10
                            text-[#ff4054]
                          "
                        >
                          <User size={17} />
                        </div>

                        <div className="min-w-0">

                          <p className="truncate font-bold text-gray-900">
                            {booking.customerName?.trim() ||
                              "Customer"}
                          </p>

                          <div className="mt-1 flex min-w-0 items-center gap-1 text-[11px] text-gray-500">

                            <Mail
                              size={11}
                              className="shrink-0"
                            />

                            <span className="truncate">
                              {booking.customerEmail?.trim() ||
                                "Email not available"}
                            </span>

                          </div>

                          <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">

                            <Phone
                              size={11}
                              className="shrink-0"
                            />

                            <span className="truncate">
                              {booking.customerPhone?.trim() ||
                                "Phone not available"}
                            </span>

                          </div>

                        </div>

                      </div>

                    </td>

                    {/* CAR */}

                    <td className="min-w-0 px-3 py-4 xl:px-4">

                      <div className="flex min-w-0 items-center gap-2">

                        <img
                          src={
                            booking.carImage?.trim() ||
                            "/default-car.jpg"
                          }
                          alt={`${booking.carBrand || "Car"} ${
                            booking.carModel || ""
                          }`}
                          className="
                            h-12
                            w-16
                            shrink-0
                            rounded-lg
                            object-cover
                            xl:h-14
                            xl:w-20
                          "
                          onError={(
                            event
                          ) => {
                            event.currentTarget.src =
                              "/default-car.jpg";
                          }}
                        />

                        <div className="min-w-0">

                          <p className="truncate text-sm font-bold text-gray-900">
                            {booking.carBrand?.trim() ||
                              "Unknown Brand"}
                          </p>

                          <p className="truncate text-xs text-gray-500">
                            {booking.carModel?.trim() ||
                              "Unknown Model"}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* DATE */}

                    <td className="min-w-0 px-3 py-4 xl:px-4">

                      <div className="flex min-w-0 items-start gap-2">

                        <div
                          className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-red-50
                            text-[#ff4054]
                          "
                        >
                          <Clock size={14} />
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-gray-900">
                            {formatDate(
                              booking.preferredDate
                            )}
                          </p>

                          <p className="mt-1 truncate text-xs text-gray-500">
                            {booking.preferredTime?.trim() ||
                              "Time not specified"}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* STATUS */}

                    <td className="px-3 py-4 xl:px-4">

                      <span
                        className={`
                          inline-flex
                          max-w-full
                          rounded-full
                          px-2.5
                          py-1.5
                          text-[10px]
                          font-bold
                          uppercase
                          ${getStatusClass(
                            status
                          )}
                        `}
                      >
                        {getStatusLabel(
                          status
                        )}
                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="px-2 py-4 xl:px-3">

                      <ActionButtons
                        booking={booking}
                        status={status}
                      />

                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>

      </div>

      {/* =====================================
          MOBILE CARDS
      ===================================== */}

      <div className="divide-y divide-gray-100 lg:hidden">

        {bookings.map(
          (booking) => {

            const status =
              normalizeStatus(
                booking.status
              );

            return (
              <div
                key={booking._id}
                className="p-4 sm:p-5"
              >

                {/* TOP */}

                <div className="flex items-start justify-between gap-3">

                  <div className="flex min-w-0 items-center gap-3">

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
                      <User size={18} />
                    </div>

                    <div className="min-w-0">

                      <h3 className="truncate font-bold text-gray-900">
                        {booking.customerName?.trim() ||
                          "Customer"}
                      </h3>

                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {booking.customerEmail?.trim() ||
                          "Email not available"}
                      </p>

                    </div>

                  </div>

                  <span
                    className={`
                      shrink-0
                      rounded-full
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      ${getStatusClass(
                        status
                      )}
                    `}
                  >
                    {getStatusLabel(
                      status
                    )}
                  </span>

                </div>

                {/* CAR */}

                <div
                  className="
                    mt-4
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    bg-gray-50
                    p-3
                  "
                >

                  <img
                    src={
                      booking.carImage?.trim() ||
                      "/default-car.jpg"
                    }
                    alt={`${booking.carBrand || "Car"} ${
                      booking.carModel || ""
                    }`}
                    className="
                      h-16
                      w-24
                      shrink-0
                      rounded-lg
                      object-cover
                    "
                    onError={(event) => {
                      event.currentTarget.src =
                        "/default-car.jpg";
                    }}
                  />

                  <div className="min-w-0">

                    <p className="truncate text-sm font-black text-gray-900">
                      {booking.carBrand?.trim() ||
                        "Unknown Brand"}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {booking.carModel?.trim() ||
                        "Unknown Model"}
                    </p>

                  </div>

                </div>

                {/* DETAILS */}

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

                  {/* PHONE */}

                  <div className="flex min-w-0 items-center gap-3 rounded-xl bg-gray-50 p-3">

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-blue-50
                        text-blue-600
                      "
                    >
                      <Phone size={16} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Phone
                      </p>

                      <p className="truncate text-sm font-semibold text-gray-800">
                        {booking.customerPhone?.trim() ||
                          "Not available"}
                      </p>

                    </div>

                  </div>

                  {/* DATE */}

                  <div className="flex min-w-0 items-center gap-3 rounded-xl bg-gray-50 p-3">

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-red-50
                        text-[#ff4054]
                      "
                    >
                      <Clock size={16} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Date & Time
                      </p>

                      <p className="truncate text-sm font-semibold text-gray-800">
                        {formatDate(
                          booking.preferredDate
                        )}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {booking.preferredTime?.trim() ||
                          "Time not specified"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* MESSAGE */}

                {booking.message?.trim() && (
                  <div className="mt-3 rounded-xl bg-gray-50 p-3">

                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                      Message
                    </p>

                    <p className="mt-1 text-sm leading-5 text-gray-600">
                      {booking.message}
                    </p>

                  </div>
                )}

                {/* ACTIONS */}

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">

                  <p className="text-xs font-semibold text-gray-400">
                    Booking Actions
                  </p>

                  <ActionButtons
                    booking={booking}
                    status={status}
                    mobile
                  />

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
};

export default AdminBookingTable;