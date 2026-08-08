import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import type { Car } from "../types";

interface CarSellerCardProps {
  car: Car;
}

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill={filled ? "#f5b700" : "none"}
    stroke={filled ? "#f5b700" : "currentColor"}
    strokeWidth={filled ? 0 : 1.5}
  >
    <path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6L12 17l-5.9 3.5 1.3-6.6-4.9-4.6 6.6-.7L12 2.5z" />
  </svg>
);

const CheckBadge = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 2l2.4 2.1 3.1-.5 1 3 2.9 1.3-.7 3.1 1.7 2.7-2.3 2.2.4 3.1-3.1.3-1.6 2.7-2.8-1.2-2.8 1.2-1.6-2.7-3.1-.3.4-3.1L3.5 14 5.2 11.3l-.7-3.1L6.4 6.9l1-3 3.1.5L12 2z" />
    <path d="M9.3 12.4l1.8 1.8 3.6-3.9" fill="none" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const getInitials = (name?: string) =>
  (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const CarSellerCard = ({ car }: CarSellerCardProps) => {
  return (
    <Reveal>
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-[#111]">Seller Information</h2>
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
            <CheckBadge />
            Verified Seller
          </span>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ff4054]/10 text-lg font-black text-[#ff4054]">
            {getInitials(car.sellerName) || "S"}
          </div>

          <div className="min-w-0">
            <p className="truncate font-bold text-[#111]">{car.sellerName}</p>
            <p className="truncate text-sm text-gray-500">{car.sellerEmail}</p>
            <div className="mt-1 flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((index) => (
                <StarIcon key={index} filled={index < 5} />
              ))}
              <span className="ml-1 text-sm font-semibold text-gray-500">4.9</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-[#f8f8f8] p-4">
            <p className="text-xs uppercase tracking-widest text-gray-400">Response Time</p>
            <p className="mt-2 font-bold text-[#111]">Within 30 mins</p>
          </div>
          <div className="rounded-2xl bg-[#f8f8f8] p-4">
            <p className="text-xs uppercase tracking-widest text-gray-400">Listing For</p>
            <p className="mt-2 font-bold text-[#111]">
              {car.brand} {car.model}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={`mailto:${car.sellerEmail}?subject=${encodeURIComponent(
              `Enquiry: ${car.brand} ${car.model}`
            )}`}
            className="flex-1 rounded-full border border-gray-200 px-5 py-3 text-center text-sm font-bold text-[#111] transition hover:border-[#ff4054]"
          >
            Email Seller
          </a>
          <Link
            to="/contact"
            className="flex-1 rounded-full bg-[#ff4054] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#e63b4d]"
          >
            Contact Seller
          </Link>
        </div>
      </div>
    </Reveal>
  );
};

export default CarSellerCard;
