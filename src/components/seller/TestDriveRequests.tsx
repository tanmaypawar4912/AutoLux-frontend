import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { API } from "../../utils/api";

interface Booking {
  _id: string;
  carBrand: string;
  carModel: string;
  carImage: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
}

const TestDriveRequests = () => {
  const { user, isLoaded } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!email) {
      setLoading(false);
      return;
    }

    fetch(`${API}/bookings/seller/${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookings(data.bookings);
        }
      })
      .finally(() => setLoading(false));
  }, [email, isLoaded]);

  const updateStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    const response = await fetch(
      `${API}/bookings/${id}/status`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (data.success) {
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id
            ? { ...booking, status }
            : booking
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="mt-10 rounded-3xl bg-white p-10 shadow-lg">
        Loading Requests...
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-3xl bg-white p-8 shadow-lg">

      <h2 className="mb-8 text-3xl font-black">
        Test Drive Requests
      </h2>

      {bookings.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          No Test Drive Requests Yet.
        </div>
      ) : (
        <div className="space-y-6">

          {bookings.map((booking) => (

            <div
              key={booking._id}
              className="flex items-center justify-between rounded-2xl border p-5"
            >

              <div className="flex items-center gap-5">

                <img
                  src={booking.carImage}
                  className="h-24 w-32 rounded-xl object-cover"
                />

                <div>

                  <h3 className="text-xl font-black">
                    {booking.carBrand}{" "}
                    {booking.carModel}
                  </h3>

                  <p>{booking.customerName}</p>

                  <p className="text-gray-500">
                    {booking.customerEmail}
                  </p>

                  <p>{booking.customerPhone}</p>

                  <p className="mt-2">
                    📅 {booking.preferredDate}
                  </p>

                  <p>
                    🕒 {booking.preferredTime}
                  </p>

                </div>

              </div>

              <div className="text-right">

                <span
                  className={`rounded-full px-5 py-2 text-white font-bold ${
                    booking.status === "approved"
                      ? "bg-green-500"
                      : booking.status === "rejected"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>

                <div className="mt-5 flex gap-3">

                  <button
                    onClick={() =>
                      updateStatus(
                        booking._id,
                        "approved"
                      )
                    }
                    className="rounded-xl bg-green-500 px-5 py-2 text-white"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        booking._id,
                        "rejected"
                      )
                    }
                    className="rounded-xl bg-red-500 px-5 py-2 text-white"
                  >
                    Reject
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default TestDriveRequests;