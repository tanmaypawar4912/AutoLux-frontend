import { useState, type FormEvent } from "react";
import { useUser } from "@clerk/clerk-react";
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

const BookingModal = ({ car, onClose }: Props) => {
  const { user } = useUser();

  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        `${API}/bookings`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            carId: car._id,
            carBrand: car.brand,
            carModel: car.model,
            carImage: car.image,

            sellerEmail: car.sellerEmail,

            customerName:
              user?.fullName || "Unknown",

            customerEmail:
              user?.primaryEmailAddress
                ?.emailAddress,

            customerPhone: phone,

            preferredDate,

            preferredTime,

            message,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Test Drive Booked Successfully 🚗");

        onClose();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);

      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

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
              setPhone(e.target.value)
            }
            className="w-full rounded-xl border p-4"
          />

          <input
            type="date"
            required
            value={preferredDate}
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

            <option>10:00 AM</option>
            <option>11:00 AM</option>
            <option>12:00 PM</option>
            <option>02:00 PM</option>
            <option>03:00 PM</option>
            <option>04:00 PM</option>

          </select>

          <textarea
            rows={4}
            placeholder="Message (Optional)"
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            className="w-full rounded-xl border p-4"
          />

          <div className="flex gap-4">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border py-4 font-bold"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="flex-1 rounded-xl bg-[#ff4054] py-4 font-bold text-white"
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