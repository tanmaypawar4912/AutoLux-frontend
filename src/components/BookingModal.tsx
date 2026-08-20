import {
  useState,
  type FormEvent,
} from "react";
import {
  useUser,
  useAuth,
} from "@clerk/clerk-react";
import { toast } from "sonner";
import { API } from "../utils/api";

interface Props {
  car: {
    _id: string;
    brand: string;
    model: string;
    image: string;
    sellerEmail: string;
  };

  onClose: () => void;
}

const BookingModal = ({
  car,
  onClose,
}: Props) => {
  const {
    user,
    isLoaded: userLoaded,
  } = useUser();

  const {
    isLoaded: authLoaded,
    getToken,
  } = useAuth();

  const [phone, setPhone] =
    useState("");

  const [preferredDate, setPreferredDate] =
    useState("");

  const [preferredTime, setPreferredTime] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================================
  // BOOK TEST DRIVE
  // =========================================

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    // =======================================
    // AUTHENTICATION CHECK
    // =======================================

    if (
      !userLoaded ||
      !authLoaded
    ) {
      toast.info(
        "Checking your login status. Please try again."
      );
      return;
    }

    if (!user) {
      toast.warning(
        "Please login to book a test drive."
      );
      return;
    }

    // =======================================
    // GET CLERK TOKEN
    // =======================================

    const token =
      await getToken();

    if (!token) {
      toast.warning(
        "Your login session is not available. Please login again."
      );
      return;
    }

    // =======================================
    // PHONE VALIDATION
    // =======================================

    const cleanPhone =
      phone.trim();

    if (!cleanPhone) {
      toast.warning(
        "Please enter your phone number."
      );
      return;
    }

    const phoneRegex =
      /^[0-9]{10}$/;

    if (
      !phoneRegex.test(cleanPhone)
    ) {
      toast.warning(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    // =======================================
    // DATE VALIDATION
    // =======================================

    if (!preferredDate) {
      toast.warning(
        "Please select a preferred date."
      );
      return;
    }

    // =======================================
    // PREVENT PAST DATE
    // =======================================

    const selectedDate =
      new Date(
        `${preferredDate}T00:00:00`
      );

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    if (
      selectedDate < today
    ) {
      toast.warning(
        "Please select today or a future date."
      );
      return;
    }

    // =======================================
    // TIME VALIDATION
    // =======================================

    if (!preferredTime) {
      toast.warning(
        "Please select a preferred time."
      );
      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          `${API}/bookings`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              // IMPORTANT:
              // Booking is authenticated at
              // the backend as well.
              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              carId: car._id,

              carBrand:
                car.brand,

              carModel:
                car.model,

              carImage:
                car.image,

              sellerEmail:
                car.sellerEmail,

              customerName:
                user.fullName ||
                "Unknown",

              customerEmail:
                user
                  .primaryEmailAddress
                  ?.emailAddress,

              customerPhone:
                cleanPhone,

              preferredDate,

              preferredTime,

              message:
                message.trim(),
            }),
          }
        );

      const data =
        await response.json();

      // =====================================
      // SUCCESS
      // =====================================

      if (data.success) {
        toast.success(
          "Test drive booked successfully! 🚗"
        );

        onClose();
      }

      // =====================================
      // SERVER ERROR
      // =====================================

      else {
        toast.error(
          data.message ||
            "Unable to book test drive. Please try again."
        );
      }
    } catch (error) {
      console.error(
        "Test Drive Booking Error:",
        error
      );

      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // WAIT FOR CLERK AUTH STATE
  // =========================================

  if (
    !userLoaded ||
    !authLoaded
  ) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8">
          <h2 className="mb-4 text-3xl font-black">
            Book Test Drive
          </h2>

          <p className="text-gray-600">
            Checking your login status...
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl border py-4 font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // LOGGED-OUT USERS: VIEW ONLY
  // =========================================

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8">
          <h2 className="mb-4 text-3xl font-black">
            Login Required
          </h2>

          <p className="text-gray-600">
            Please login to book a test drive.
            You can continue viewing cars without
            logging in.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-[#ff4054] py-4 font-bold text-white"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // AUTHENTICATED BOOKING FORM
  // =========================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

      <div className="w-full max-w-lg rounded-3xl bg-white p-8">

        <h2 className="mb-6 text-3xl font-black">
          Book Test Drive
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            placeholder="Phone Number"
            required
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            className="w-full rounded-xl border p-4"
          />

          <input
            type="date"
            required
            value={preferredDate}
            min={
              new Date()
                .toISOString()
                .split("T")[0]
            }
            onChange={(e) =>
              setPreferredDate(
                e.target.value
              )
            }
            className="w-full rounded-xl border p-4"
          />

          <select
            required
            value={preferredTime}
            onChange={(e) =>
              setPreferredTime(
                e.target.value
              )
            }
            className="w-full rounded-xl border p-4"
          >
            <option value="">
              Select Time
            </option>

            <option>
              10:00 AM
            </option>

            <option>
              11:00 AM
            </option>

            <option>
              12:00 PM
            </option>

            <option>
              02:00 PM
            </option>

            <option>
              03:00 PM
            </option>

            <option>
              04:00 PM
            </option>
          </select>

          <textarea
            rows={4}
            placeholder="Message (Optional)"
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            className="w-full rounded-xl border p-4"
          />

          <div className="flex gap-4">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border py-4 font-bold disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-[#ff4054] py-4 font-bold text-white disabled:opacity-50"
            >
              {loading
                ? "Booking..."
                : "Book Now"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default BookingModal;
