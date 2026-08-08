import { useMemo } from "react";
import Reveal from "../components/Reveal";
import type { Car } from "../types";

interface CarSpecsPriceProps {
  car: Car;
  onBookTestDrive: () => void;
}

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path strokeLinecap="round" d="M16 3v4M8 3v4M3 10h18" />
  </svg>
);

const FuelIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V8a2 2 0 012-2h6a2 2 0 012 2v13M4 21h10M4 11h8" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 9l3.5 2.2c.3.2.5.6.5 1V17a1.5 1.5 0 003 0v-6l-2.5-3" />
  </svg>
);

const GearIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="3" />
    <path strokeLinecap="round" d="M12 3v3M12 18v3M21 12h-3M6 12H3M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7L5.6 5.6" />
  </svg>
);

const RoadIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3L4 21M15 3l5 18M12 8v1.5M12 13v1.5M12 18v1" />
  </svg>
);

const estimateMonthlyEmi = (price: number) => {
  const downPayment = price * 0.2;
  const principal = price - downPayment;
  const monthlyRate = 0.11 / 12;
  const tenureMonths = 60;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
};

const CarSpecsPrice = ({ car, onBookTestDrive }: CarSpecsPriceProps) => {
  const indicativeEmi = useMemo(() => estimateMonthlyEmi(car.price), [car.price]);

  const specPills = [
    { label: `${car.year}` },
    { label: car.fuelType },
    { label: car.transmission },
    { label: `${Number(car.kilometers).toLocaleString()} km` },
  ];

  const statCards = [
    { label: "Year", value: `${car.year}`, icon: <CalendarIcon /> },
    { label: "Fuel Type", value: car.fuelType, icon: <FuelIcon /> },
    { label: "Transmission", value: car.transmission, icon: <GearIcon /> },
    { label: "Kilometers", value: `${Number(car.kilometers).toLocaleString()} km`, icon: <RoadIcon /> },
  ];

  return (
    <Reveal>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ff4054]">
          {car.brand}
        </p>

        <h1 className="mt-3 text-4xl font-black leading-tight text-[#111] md:text-6xl">
          {car.model}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {specPills.map((pill, index) => (
            <span key={pill.label} className="flex items-center gap-2 text-sm font-semibold text-gray-500">
              {index > 0 && <span className="text-gray-300">•</span>}
              {pill.label}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[#ff4054]/20 bg-[#ff4054]/5 p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Selling Price</p>
              <p className="mt-1 text-4xl font-black text-[#ff4054] md:text-5xl">
                ₹{Number(car.price).toLocaleString("en-IN")}
              </p>
            </div>

            <a
              href="#emi-calculator"
              className="rounded-xl bg-white px-4 py-3 text-sm shadow-sm transition hover:shadow-md"
            >
              <span className="block text-gray-500">EMI starts at</span>
              <span className="font-black text-[#111]">
                ₹{indicativeEmi.toLocaleString("en-IN")}/mo →
              </span>
            </a>
          </div>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={onBookTestDrive}
            className="w-full rounded-full bg-[#ff4054] px-6 py-4 text-base font-bold text-white transition hover:bg-[#e63b4d] sm:w-auto"
          >
            Book Test Drive
          </button>
        </div>

        <p className="mt-6 text-lg leading-8 text-gray-500">{car.description}</p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {statCards.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400">
                {stat.icon}
                <p className="text-xs uppercase tracking-widest">{stat.label}</p>
              </div>
              <p className="mt-2 text-2xl font-black text-[#111] md:text-3xl">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
};

export default CarSpecsPrice;
