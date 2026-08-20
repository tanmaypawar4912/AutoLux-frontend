import { useState } from "react";
import { toast } from "sonner";
import Reveal from "../components/Reveal";
import type { Car } from "../types";
import { API } from "../utils/api";

const ENQUIRIES_API = `${API}/enquiries`;

interface CarEnquiryWidgetProps {
  car: Car;
}

const CarEnquiryWidget = ({
  car,
}: CarEnquiryWidgetProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState(
    `Hi, I'm interested in the ${car.brand} ${car.model}. Is it still available?`
  );

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [sent, setSent] = useState(false);

  // =========================================
  // SUBMIT ENQUIRY
  // =========================================

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError(null);

    // =======================================
    // VALIDATION
    // =======================================

    if (
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      const errorMessage =
        "Please fill in every field.";

      setError(errorMessage);

      toast.warning(errorMessage);

      return;
    }

    // =======================================
    // EMAIL VALIDATION
    // =======================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      const errorMessage =
        "Please enter a valid email address.";

      setError(errorMessage);

      toast.warning(errorMessage);

      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        ENQUIRIES_API,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            carId: car._id,
            carBrand: car.brand,
            carModel: car.model,
            sellerEmail: car.sellerEmail,
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
          }),
        }
      );

      const data =
        await response.json();

      // =====================================
      // SUCCESS
      // =====================================

      if (data.success) {
        setSent(true);

        toast.success(
          "Enquiry sent successfully!"
        );
      }

      // =====================================
      // SERVER ERROR
      // =====================================

      else {
        const errorMessage =
          data.message ||
          "Something went wrong. Please try again.";

        setError(errorMessage);

        toast.error(errorMessage);
      }
    } catch (err) {
      console.error(
        "Enquiry submission error:",
        err
      );

      const errorMessage =
        "Unable to send enquiry. Please try again.";

      setError(errorMessage);

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Reveal>
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-[#111]">
          Enquire about this car
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Send a message directly to{" "}
          {car.sellerName} — they'll get it by
          email.
        </p>

        {sent ? (
          <div className="mt-5 rounded-2xl bg-green-50 p-5 text-center">
            <p className="font-bold text-green-700">
              Enquiry sent!
            </p>

            <p className="mt-1 text-sm text-green-600">
              The seller will get back to you
              soon.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-5 space-y-3"
          >
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#ff4054]"
            />

            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#ff4054]"
            />

            <textarea
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#ff4054]"
            />

            {error && (
              <p className="text-sm font-semibold text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-[#ff4054] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#e63b4d] disabled:opacity-50"
            >
              {submitting
                ? "Sending..."
                : "Send Enquiry"}
            </button>
          </form>
        )}
      </div>
    </Reveal>
  );
};

export default CarEnquiryWidget;