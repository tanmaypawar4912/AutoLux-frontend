import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import Reveal from "../components/Reveal";
import { API } from "../utils/api";

interface CarOption {
  _id: string;
  brand: string;
  model: string;
  year?: number;
}

const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Car Information",
  "Book a Test Drive",
  "Sell My Car",
  "Car Financing / EMI",
  "Booking Related",
  "Website / Technical Issue",
  "Complaint",
  "Feedback / Suggestion",
  "Other",
];

const Contact = () => {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, getToken } = useAuth();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cars, setCars] = useState<CarOption[]>([]);
  const [carsLoading, setCarsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [interestedCar, setInterestedCar] = useState("");
  const [preferredContact, setPreferredContact] = useState("Any");
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  // =========================================
  // PREFILL LOGGED-IN USER DETAILS
  // =========================================

  useEffect(() => {
    if (!user) {
      return;
    }

    setName((current) =>
      current || user.fullName || ""
    );

    setEmail((current) =>
      current ||
      user.primaryEmailAddress?.emailAddress ||
      ""
    );
  }, [user]);

  // =========================================
  // LOAD APPROVED CARS
  // Used only for optional Interested Car.
  // =========================================

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setCarsLoading(true);

        const response = await fetch(
          `${API}/cars`
        );

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
        console.error(
          "Contact Cars Error:",
          error
        );
      } finally {
        setCarsLoading(false);
      }
    };

    fetchCars();
  }, []);

  // =========================================
  // SUBMIT CONTACT MESSAGE
  // =========================================

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
      toast.warning(
        "Please login to send us a message."
      );
      return;
    }

    const cleanPhone = phone.trim();

    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      toast.warning(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (!subject) {
      toast.warning("Please select a subject.");
      return;
    }

    if (!message.trim()) {
      toast.warning("Please enter your message.");
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

      const response = await fetch(
        `${API}/contacts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: cleanPhone,
            subject,
            interestedCar: interestedCar.trim(),
            preferredContact,
            message: message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to send your message."
        );
      }

      setIsSubmitted(true);
      setPhone("");
      setSubject("");
      setInterestedCar("");
      setPreferredContact("Any");
      setMessage("");

      toast.success(
        "Message sent successfully!"
      );
    } catch (error) {
      console.error(
        "Contact Submit Error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to send your message."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setPhone("");
    setSubject("");
    setInterestedCar("");
    setPreferredContact("Any");
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 pb-16 pt-20 sm:px-6 lg:pt-24">
      <div className="mx-auto max-w-7xl">
        {/* ================================
            PAGE HEADER
        ================================= */}

        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ff4054]">
              Get In Touch
            </p>

            <h1 className="mt-3 text-4xl font-black leading-[1.05] text-[#111] sm:text-5xl md:text-6xl">
              Let's Start Your{" "}
              <span className="text-[#ff4054]">
                Dream Drive.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
              Have a question about a vehicle, want to book a test drive,
              or simply want to talk cars? Our team is here to help.
            </p>
          </div>
        </Reveal>

        {/* ================================
            CONTACT SECTION
        ================================= */}

        <div className="mt-7 grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
          {/* CONTACT INFORMATION */}

          <div className="order-2 lg:order-1">
            <Reveal>
            <div className="h-full rounded-3xl bg-[#111] p-7 text-white sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ff4054]">
                Contact AutoLux
              </p>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                We Are Here To Help.
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400 sm:text-base">
                Our automotive experts are ready to help you find the
                perfect vehicle or answer any questions you may have.
              </p>

              <div className="mt-7 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff4054] text-lg">
                    ✉
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      Email Us
                    </p>
                    <p className="mt-1 text-sm font-bold sm:text-base">
                      hello@autolux.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff4054] text-lg">
                    ☎
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      Call Us
                    </p>
                    <p className="mt-1 text-sm font-bold sm:text-base">
                      +91 98765 43210
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff4054] text-lg">
                    ⌖
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      Visit Us
                    </p>
                    <p className="mt-1 text-sm font-bold sm:text-base">
                      Pune, Maharashtra
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 border-t border-white/10 pt-6">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff4054]">
                  Opening Hours
                </p>

                <div className="mt-4 space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-400">
                      Monday - Saturday
                    </span>
                    <span className="font-semibold text-white">
                      9:00 AM - 8:00 PM
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-400">
                      Sunday
                    </span>
                    <span className="font-semibold text-white">
                      10:00 AM - 6:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
            </Reveal>
          </div>

          {/* CONTACT FORM */}

          <div className="order-1 lg:order-2">
            <Reveal>
            <div className="h-full rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              {isSubmitted ? (
                <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                    ✓
                  </div>

                  <h2 className="mt-6 text-2xl font-black text-[#111] sm:text-3xl">
                    Message Sent Successfully!
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
                    Thank you for contacting AutoLux. Our team will
                    get back to you as soon as possible.
                  </p>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-6 rounded-xl bg-[#111] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#ff4054]"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : !userLoaded || !authLoaded ? (
                <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                  <h2 className="text-2xl font-black text-[#111] sm:text-3xl">
                    Checking Login...
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
                    Please wait while we check your login status.
                  </p>
                </div>
              ) : !user ? (
                <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff4054]/10 text-2xl">
                    🔒
                  </div>

                  <h2 className="mt-6 text-2xl font-black text-[#111] sm:text-3xl">
                    Login Required
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
                    Please login to send us a message. You can continue viewing AutoLux and our cars without logging in.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-2xl font-black text-[#111] sm:text-3xl">
                      Send Us A Message
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Fill in the details below and we will get back to you.
                    </p>
                  </div>

                  {/* NAME + EMAIL */}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-700">
                        Full Name
                      </label>

                      <input
                        type="text"
                        placeholder="Your name"
                        required
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-700">
                        Email Address
                      </label>

                      <input
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                      />
                    </div>
                  </div>

                  {/* PHONE + SUBJECT */}

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
                            e.target.value.replace(/\D/g, "").slice(0, 10)
                          )
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-700">
                        Subject
                      </label>

                      <select
                        required
                        value={subject}
                        onChange={(e) =>
                          setSubject(e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054]"
                      >
                        <option value="" disabled>
                          Select a subject
                        </option>

                        {SUBJECT_OPTIONS.map((option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* CAR + CONTACT METHOD */}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-700">
                        Interested Car (Optional)
                      </label>

                      <select
                        value={interestedCar}
                        onChange={(e) =>
                          setInterestedCar(e.target.value)
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
                            value={`${car.brand} ${car.model}${car.year ? ` (${car.year})` : ""}`}
                          >
                            {car.brand} {car.model}
                            {car.year
                              ? ` (${car.year})`
                              : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-700">
                        Preferred Contact Method
                      </label>

                      <select
                        value={preferredContact}
                        onChange={(e) =>
                          setPreferredContact(e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054]"
                      >
                        <option value="Any">Any</option>
                        <option value="Email">Email</option>
                        <option value="Phone">Phone</option>
                        <option value="WhatsApp">WhatsApp</option>
                      </select>
                    </div>
                  </div>

                  {/* MESSAGE */}

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-gray-700">
                      Message
                    </label>

                    <textarea
                      rows={4}
                      placeholder="Write your message..."
                      required
                      value={message}
                      onChange={(e) =>
                        setMessage(e.target.value)
                      }
                      className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[#ff4054] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ff4054]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#e9364a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Sending..."
                      : "Send Message →"}
                  </button>
                </form>
              )}
            </div>
            </Reveal>
          </div>
          
        </div>
      </div>
    </main>
  );
};

export default Contact;