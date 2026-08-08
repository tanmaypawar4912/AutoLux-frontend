import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { API } from "../utils/api";

import Analytics from "../components/seller/Analytics";
import StatusChart from "../components/seller/StatusChart";
import TestDriveRequests from "../components/seller/TestDriveRequests";

interface Car {
    _id: string;
    brand: string;
    model: string;
    image: string;
    price: number;
    status: string;
    year: number;
    views?: number;
}

const SellerDashboard = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [cars, setCars] = useState<Car[]>([]);
    const [enquiryCount, setEnquiryCount] = useState(0);

    useEffect(() => {
        const email = user?.primaryEmailAddress?.emailAddress;
        if (!email) return;

        const fetchCars = async () => {
            try {
                const response = await fetch(
                    `${API}/cars/my/${email}`
                );

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

        const fetchEnquiries = async () => {
            try {
                const response = await fetch(`${API}/enquiries/seller/${email}`);
                const data = await response.json();
                if (data.success) {
                    setEnquiryCount(data.count);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchCars();
        fetchEnquiries();
    }, [user]);

    // ===========================
    // Statistics
    // ===========================

    const totalCars = cars.length;

    const approvedCars = cars.filter(
        (car) => car.status === "approved"
    ).length;

    const pendingCars = cars.filter(
        (car) => car.status === "pending"
    ).length;

    const rejectedCars = cars.filter(
        (car) => car.status === "rejected"
    ).length;

    const totalValue = cars.reduce(
        (total, car) => total + car.price,
        0
    );

    const totalViews = cars.reduce(
        (total, car) => total + (car.views || 0),
        0
    );

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <h2 className="text-2xl font-bold">
                    Loading Dashboard...
                </h2>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 px-6 pt-32 pb-10">
            <div className="mx-auto max-w-7xl">

                {/* Welcome Banner */}

                <div className="mb-10 rounded-3xl bg-gradient-to-r from-[#ff4054] to-[#ff6f61] p-8 text-white shadow-xl">

                    <h1 className="text-4xl font-black">
                        Welcome {user?.firstName || "Seller"} 👋
                    </h1>

                    <p className="mt-3 text-lg text-white/90">
                        Manage all your listed cars from one dashboard.
                    </p>

                </div>

                {/* Statistics Cards */}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">

                    <div className="rounded-3xl bg-white p-6 shadow-lg">
                        <p className="text-gray-500">Total Cars</p>
                        <h2 className="mt-3 text-4xl font-black">
                            {totalCars}
                        </h2>
                    </div>

                    <div className="rounded-3xl bg-green-500 p-6 text-white shadow-lg">
                        <p>Approved</p>
                        <h2 className="mt-3 text-4xl font-black">
                            {approvedCars}
                        </h2>
                    </div>

                    <div className="rounded-3xl bg-yellow-500 p-6 text-white shadow-lg">
                        <p>Pending</p>
                        <h2 className="mt-3 text-4xl font-black">
                            {pendingCars}
                        </h2>
                    </div>

                    <div className="rounded-3xl bg-red-500 p-6 text-white shadow-lg">
                        <p>Rejected</p>
                        <h2 className="mt-3 text-4xl font-black">
                            {rejectedCars}
                        </h2>
                    </div>

                    <div className="rounded-3xl bg-blue-500 p-6 text-white shadow-lg">
                        <p>Total Views</p>
                        <h2 className="mt-3 text-4xl font-black">
                            {totalViews}
                        </h2>
                    </div>

                    <div className="rounded-3xl bg-gray-900 p-6 text-white shadow-lg">
                        <p>Total Value</p>

                        <h2 className="mt-3 text-3xl font-black">
                            ₹{totalValue.toLocaleString("en-IN")}
                        </h2>

                    </div>

                </div>

                {/* Analytics */}

                <Analytics cars={cars} enquiryCount={enquiryCount} />

                <div className="mt-10">
                    <StatusChart cars={cars} />
                </div>
<TestDriveRequests />
                {/* Recent Listings + Quick Actions */}
                <div className="mt-10 grid gap-8 lg:grid-cols-3">
                    {/* Recent Listings */}

                    <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-lg">

                        <h2 className="mb-6 text-2xl font-black">
                            Recent Listings
                        </h2>

                        {cars.length === 0 ? (

                            <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center">

                                <h3 className="text-xl font-bold text-gray-500">
                                    No Cars Listed Yet
                                </h3>

                            </div>

                        ) : (

                            <div className="space-y-5">

                                {cars.slice(0, 5).map((car) => (

                                    <div
                                        key={car._id}
                                        className="flex items-center justify-between rounded-2xl border border-gray-200 p-4 transition hover:shadow-lg"
                                    >

                                        <div className="flex items-center gap-4">

                                            <img
                                                src={car.image}
                                                alt={car.model}
                                                className="h-20 w-28 rounded-xl object-cover"
                                            />

                                            <div>

                                                <h3 className="text-lg font-bold">
                                                    {car.brand} {car.model}
                                                </h3>

                                                <p className="text-sm text-gray-500">
                                                    {car.year}
                                                </p>

                                                <p className="mt-1 font-bold text-[#ff4054]">
                                                    ₹{car.price.toLocaleString("en-IN")}
                                                </p>

                                            </div>

                                        </div>

                                        <span
                                            className={`rounded-full px-4 py-2 text-sm font-bold text-white ${car.status === "approved"
                                                    ? "bg-green-500"
                                                    : car.status === "pending"
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500"
                                                }`}
                                        >
                                            {car.status.charAt(0).toUpperCase() +
                                                car.status.slice(1)}
                                        </span>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                    {/* Quick Actions */}

                    <div className="rounded-3xl bg-white p-6 shadow-lg">

                        <h2 className="mb-6 text-2xl font-black">
                            Quick Actions
                        </h2>

                        <div className="space-y-4">

                            <button
                                onClick={() => navigate("/sell")}
                                className="w-full rounded-xl bg-[#ff4054] py-4 font-bold text-white transition hover:bg-[#e6374a]"
                            >
                                + Sell New Car
                            </button>

                            <button
                                onClick={() => navigate("/my-cars")}
                                className="w-full rounded-xl bg-gray-900 py-4 font-bold text-white transition hover:bg-black"
                            >
                                My Cars
                            </button>

                            <button
                                onClick={() => navigate("/cars")}
                                className="w-full rounded-xl border-2 border-gray-300 py-4 font-bold transition hover:bg-gray-100"
                            >
                                Browse Cars
                            </button>

                            <button
                                onClick={() => navigate("/")}
                                className="w-full rounded-xl border-2 border-[#ff4054] py-4 font-bold text-[#ff4054] transition hover:bg-[#ff4054] hover:text-white"
                            >
                                Home
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
};

export default SellerDashboard;