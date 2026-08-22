import { useEffect, useState, type FormEvent } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";

import Reveal from "../components/Reveal";
import { API } from "../utils/api";

interface CarOption {
  _id: string;
  brand: string;
  model: string;
  year?: number;
  image?: string;
  sellerEmail?: string;
}

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const BookTestDrive = () => {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, getToken } = useAuth();

  const [cars, setCars] = useState<CarOption[]>([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [selectedCarId, setSelectedCarId] = useState("");

  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setCarsLoading(true);

        const response = await fetch(`${API}/cars`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load cars."
          );
        }

        setCars(
          Array.isArray(data.cars)
            ? data.cars
            : []
        );
      } catch (error) {
        console.error("Book Test Drive Cars Error:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load cars."
        );
      } finally {
        setCarsLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!userLoaded || !authLoaded) {
      toast.info(
        "Checking your login status. Please try again."
      );
      return;
    }

    if (!user) {
      toast.warning("Please login to book a test drive.");
      return;
    }

    const selectedCar = cars.find(
      (car) => car._id === selectedCarId
    );

    if (!selectedCar) {
      toast.warning("Please select a car.");
      return;
    }

    const cleanPhone = phone.trim();

    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      toast.warning(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (!preferredDate) {
      toast.warning("Please select a preferred date.");
      return;
    }

    const selectedDate = new Date(
      `${preferredDate}T00:00:00`
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.warning(
        "Please select today or a future date."
      );
      return;
    }

    if (!preferredTime) {
      toast.warning("Please select a preferred time.");
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();

      if (!token) {
        throw new Error(
          "Authentication token not available. Please login again."
        );
      }

      const response = await fetch(`${API}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          carId: selectedCar._id,
          carBrand: selectedCar.brand,
          carModel: selectedCar.model,
          carImage: selectedCar.image || "",
          sellerEmail: selectedCar.sellerEmail || "",
          customerName: user.fullName || "Unknown",
          customerEmail:
            user.primaryEmailAddress?.emailAddress || "",
          customerPhone: cleanPhone,
          preferredDate,
          preferredTime,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to book test drive."
        );
      }

      setIsSubmitted(true);
      setSelectedCarId("");
      setPhone("");
      setPreferredDate("");
      setPreferredTime("");
      setMessage("");

      toast.success(
        "Test drive booked successfully! 🚗"
      );
    } catch (error) {
      console.error(
        "Book Test Drive Error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to book test drive."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!userLoaded || !authLoaded) {
    return (
      <main className="min-h-screen bg-[#f8f8f8] px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-black text-[#111]">
            Checking Login...
          </h1>
          <p className="mt-3 text-gray-500">
            Please wait while we check your login status.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 pb-16 pt-24 sm:px-6 lg:pt-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ff4054]">
              AutoLux Test Drive
            </p>

            <h1 className="mt-3 text-4xl font-black leading-[1.05] text-[#111] sm:text-5xl md:text-6xl">
              Book Your{" "}
              <span className="text-[#ff4054]">
                Test Drive.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
              Select your preferred car, date and time. Your request will be sent directly to the AutoLux booking system.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            {isSubmitted ? (
              <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                  ✓
                </div>

                <h2 className="mt-6 text-2xl font-black text-[#111] sm:text-3xl">
                  Test Drive Booked Successfully!
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
                  Your request has been saved. Our team will contact you to confirm the appointment.
                </p>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 rounded-xl bg-[#111] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#ff4054]"
                >
                  Book Another Test Drive
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-black text-[#111] sm:text-3xl">
                    Book Test Drive
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Your account name and email will be used automatically.
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-gray-700">
                    Select Car
                  </label>

                  <select
                    required
                    value={selectedCarId}
                    onChange={(e) =>
                      setSelectedCarId(e.target.value)
                    }
                    disabled={carsLoading}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054]"
                  >
                    <option value="">
                      {carsLoading
                        ? "Loading cars..."
                        : "Select a car"}
                    </option>

                    {cars.map((car) => (
                      <option
                        key={car._id}
                        value={car._id}
                      >
                        {car.brand} {car.model}
                        {car.year
                          ? ` (${car.year})`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10)
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-gray-700">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      min={getToday()}
                      value={preferredDate}
                      onChange={(e) =>
                        setPreferredDate(e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-gray-700">
                    Preferred Time
                  </label>

                  <select
                    required
                    value={preferredTime}
                    onChange={(e) =>
                      setPreferredTime(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054]"
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
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-gray-700">
                    Message (Optional)
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Anything you would like us to know..."
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || carsLoading}
                  className="w-full rounded-xl bg-[#ff4054] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ff4054]/20 transition hover:bg-[#e9364a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Booking..."
                    : "Book Test Drive →"}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </main>
  );
};

export default BookTestDrive;
