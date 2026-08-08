import { useMemo, useState } from "react";
import Reveal from "../components/Reveal";
import type { Car } from "../types";

interface CarAboutFeaturesProps {
  car: Car;
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="#ff4054" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
  </svg>
);

const DESCRIPTION_PREVIEW_LENGTH = 220;

const STANDARD_FEATURES = [
  "Power Steering",
  "Power Windows",
  "Air Conditioning",
  "ABS with EBD",
  "Dual Front Airbags",
  "Central Locking",
  "Alloy Wheels",
  "Music System with Bluetooth",
];

const CarAboutFeatures = ({ car }: CarAboutFeaturesProps) => {
  const [expanded, setExpanded] = useState(false);

  const inspectionReport = useMemo<{ title: string; status: string; note: string }[]>(
    () => [
      { title: "Engine", status: "Excellent", note: "No leaks detected." },
      { title: "Interior", status: "Very Good", note: "Clean cabin and seats." },
      { title: "Brakes", status: "Good", note: "Brake pads healthy." },
      { title: "Tires", status: "Fair", note: "Some tread wear on rear tires." },
    ],
    []
  );

  const isLongDescription = car.description.length > DESCRIPTION_PREVIEW_LENGTH;
  const displayedDescription =
    expanded || !isLongDescription
      ? car.description
      : `${car.description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}…`;

  return (
    <Reveal>
      <div className="space-y-6">
        {/* About this car */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-[#111]">About this car</h2>
          <p className="mt-4 text-base leading-7 text-gray-500">{displayedDescription}</p>
          {isLongDescription && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="mt-3 text-sm font-bold text-[#ff4054] hover:underline"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* Features */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-[#111]">Features & Comfort</h2>
          <p className="mt-1 text-sm text-gray-400">
            Standard for this segment — confirm exact trim details with the seller.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {STANDARD_FEATURES.map((feature) => (
              <div key={feature} className="flex items-center gap-2 rounded-2xl bg-[#f8f8f8] px-4 py-3">
                <CheckIcon />
                <span className="text-sm font-semibold text-[#111]">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inspection Report */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#111]">Inspection Report</h2>
            <span className="rounded-full bg-[#ff4054]/10 px-3 py-1 text-xs font-bold text-[#ff4054]">
              Verified
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {inspectionReport.map((item) => (
              <div key={item.title} className="rounded-2xl bg-[#f8f8f8] p-5">
                <p className="text-sm font-semibold text-[#111]">{item.title}</p>
                <p className="mt-2 text-2xl font-black text-[#ff4054]">{item.status}</p>
                <p className="mt-2 text-sm text-gray-500">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
};

export default CarAboutFeatures;
