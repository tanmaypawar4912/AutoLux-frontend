import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { API } from "../utils/api";

interface Booking {
    _id: string;
    carId: string;
    carBrand: string;
    carModel: string;
    carImage: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    message: string;
    status: string;
    createdAt: string;
}
const MyBookings = () => {
const { user } = useUser();

const [bookings, setBookings] = useState<Booking[]>([]);
const [loading, setLoading] = useState(true);
const [successMessage, setSuccessMessage] = useState("");


const deleteBooking = async (id: string) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to cancel this booking?"
    );

    if (!confirmDelete) return;

    try {
        const response = await fetch(
            `${API}/bookings/${id}`,
            {
                method: "DELETE",
            }
        );

        const data = await response.json();

        if (data.success) {
            setBookings((prev) =>
                prev.filter((booking) => booking._id !== id)
            );

            setSuccessMessage("Booking cancelled successfully!");

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong.");
    }
};

useEffect(() => {
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
        setLoading(false);
        return;
    }

    const fetchBookings = async () => {
        try {
            const response = await fetch(
                `${API}/bookings/my/${email}`
            );

            const data = await response.json();

            if (data.success) {
                setBookings(data.bookings);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    fetchBookings();
}, [user]);

return (
    <main className="min-h-screen bg-[#f8f8f8] px-6 pt-36 pb-24">

        <div className="mx-auto max-w-7xl">

            <div className="mb-12">

                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ff4054]">
                    Dashboard
                </p>

                <h1 className="mt-4 text-5xl font-black text-[#111]">
                    My Bookings
                </h1>

                <p className="mt-4 text-lg text-gray-500">
                    View and manage all your booked cars.
                </p>

            </div>

            {loading ? (

                <div className="mt-24 text-center">

                    <div className="text-6xl animate-bounce">
                        🚗
                    </div>

                    <h2 className="mt-6 text-3xl font-black">
                        Loading Bookings...
                    </h2>

                </div>

            ) : bookings.length === 0 ? (

                <div className="rounded-3xl bg-white p-16 text-center shadow">

                    <div className="text-7xl">
                        📅
                    </div>

                    <h2 className="mt-6 text-3xl font-black">
                        No Bookings Yet
                    </h2>

                    <p className="mt-3 text-gray-500">
                        Book your first premium car.
                    </p>

                </div>

            ) : (

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                    {bookings.map((booking) => (

                        <div
                            key={booking._id}
                            className="
                overflow-hidden
                rounded-3xl
                bg-white
                shadow-sm
                transition
                hover:-translate-y-2
                hover:shadow-xl
              "
                        >

                            <img
                                src={booking.carImage}
                                alt={booking.carModel}
                                className="h-60 w-full object-cover"
                            />

                            <div className="p-6">

                                <h2 className="text-2xl font-black">
                                    {booking.carBrand}
                                </h2>

                                <p className="mt-2 text-gray-500">
                                    {booking.carModel}
                                </p>

                                <div className="mt-6 flex items-center justify-between">

                                    <span
                                        className={`
                      rounded-full
                      px-4
                      py-2
                      text-xs
                      font-bold

                      ${booking.status === "approved"
                                                ? "bg-green-100 text-green-700"
                                                : booking.status === "rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : booking.status === "completed"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                            }
                    `}
                                    >{
                                            booking.status === "approved"
                                                ? "🟢 Approved"
                                                : booking.status === "rejected"
                                                    ? "🔴 Rejected"
                                                    : booking.status === "completed"
                                                        ? "🔵 Completed"
                                                        : "🟡 Pending"
                                        }
                                    </span>

                                    <span className="text-sm text-gray-500">
                                        {new Date(
                                            booking.createdAt
                                        ).toLocaleDateString()}
                                    </span>

                                </div>

                                <div className="mt-6">

                                    <p className="text-sm text-gray-500">
                                        Phone
                                    </p>

                                    <p className="font-bold">
                                        {booking.customerPhone}
                                    </p>

                                </div>

                                <div className="mt-6">

                                    <p className="text-sm text-gray-500">
                                        Message
                                    </p>

                                    <p className="mt-1 text-sm">
                                        {booking.message}
                                    </p>

                                </div>
                                <div className="mt-8">
                                    <Link
                                        to={`/cars/${booking.carId}`}
                                        className="
    mb-4
    block
    w-full
    rounded-xl
    bg-[#ff4054]
    px-6
    py-4
    text-center
    font-bold
    text-white
    transition
    hover:bg-[#e63b4d]
  "
                                    >
                                        View Car
                                    </Link>
                                    <button
                                        onClick={() => deleteBooking(booking._id)}
                                        className="
      w-full
      rounded-xl
      bg-red-500
      px-6
      py-4
      font-bold
      text-white
      transition
      hover:bg-red-600
    "
                                    >
                                        Cancel Booking
                                    </button>

                                </div>
                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
        {successMessage && (

            <div
                className="
      fixed
      right-8
      top-24
      z-50
      rounded-2xl
      bg-green-500
      px-8
      py-4
      font-bold
      text-white
      shadow-2xl
      animate-pulse
    "
            >
                ✅ {successMessage}
            </div>

        )}
    </main>
);
};

export default MyBookings;