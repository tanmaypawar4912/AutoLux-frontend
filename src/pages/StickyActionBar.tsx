import { Link } from "react-router-dom";
import type { Car } from "../types";

interface StickyActionBarProps {
  car: Car;
  onBookTestDrive: () => void;
}

const StickyActionBar = ({ car, onBookTestDrive }: StickyActionBarProps) => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs text-gray-400">
            {car.brand} {car.model}
          </p>
          <p className="text-lg font-black text-[#111]">
            ₹{Number(car.price).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <Link
            to="/contact"
            className="rounded-full border border-gray-200 px-4 py-3 text-sm font-bold text-[#111] transition hover:border-[#ff4054]"
          >
            Contact
          </Link>
          <button
            type="button"
            onClick={onBookTestDrive}
            className="rounded-full bg-[#ff4054] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e63b4d]"
          >
            Book Test Drive
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyActionBar;
