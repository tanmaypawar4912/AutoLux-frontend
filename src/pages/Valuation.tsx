import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";

const BRAND_BASE_VALUE: Record<string, number> = {
  Maruti: 700000,
  Hyundai: 800000,
  Honda: 900000,
  Toyota: 1100000,
  Tata: 750000,
  Mahindra: 950000,
  Kia: 950000,
  Volkswagen: 900000,
  Ford: 800000,
  BMW: 3500000,
  Mercedes: 4000000,
  Audi: 3800000,
};

const CONDITION_MULTIPLIER: Record<string, number> = {
  Excellent: 1.0,
  Good: 0.9,
  Fair: 0.78,
  Poor: 0.6,
};

const formatINR = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

const Valuation = () => {
  const [brand, setBrand] = useState("Maruti");
  const [year, setYear] = useState(new Date().getFullYear() - 3);
  const [kilometers, setKilometers] = useState(40000);
  const [fuelType, setFuelType] = useState("Petrol");
  const [condition, setCondition] = useState("Good");
  const [showResult, setShowResult] = useState(false);

  const estimate = useMemo(() => {
    const baseValue = BRAND_BASE_VALUE[brand] ?? 800000;
    const age = Math.max(0, new Date().getFullYear() - year);

    // depreciate ~12% per year, floor at 25% of base value
    const ageFactor = Math.max(0.25, Math.pow(0.88, age));

    // lose value for high mileage, gain a little for very low mileage
    const kmFactor = Math.max(0.7, 1 - kilometers / 300000);

    const fuelFactor = fuelType === "Diesel" ? 1.03 : fuelType === "Electric" ? 1.1 : 1;

    const conditionFactor = CONDITION_MULTIPLIER[condition] ?? 0.9;

    const midPoint = baseValue * ageFactor * kmFactor * fuelFactor * conditionFactor;

    return {
      low: Math.round((midPoint * 0.93) / 1000) * 1000,
      high: Math.round((midPoint * 1.07) / 1000) * 1000,
      mid: Math.round(midPoint / 1000) * 1000,
    };
  }, [brand, year, kilometers, fuelType, condition]);

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-6 pb-24 pt-36">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-sm font-bold uppercase tracking-[0.3em] text-[#ff4054]">
          Sell smarter
        </p>
        <h1 className="mt-3 text-center text-4xl font-black text-[#111] md:text-5xl">
          Instant Car Valuation
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-gray-500">
          Get a quick, ballpark estimate of what your car could sell for before you list it.
        </p>

        <Reveal>
          <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-[#111]">Brand</label>
                <select
                  value={brand}
                  onChange={(event) => setBrand(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ff4054]"
                >
                  {Object.keys(BRAND_BASE_VALUE).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-[#111]">Year of Purchase</label>
                <input
                  type="number"
                  min={1990}
                  max={new Date().getFullYear()}
                  value={year}
                  onChange={(event) => setYear(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ff4054]"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#111]">Kilometers Driven</label>
                <input
                  type="number"
                  min={0}
                  value={kilometers}
                  onChange={(event) => setKilometers(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ff4054]"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#111]">Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={(event) => setFuelType(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ff4054]"
                >
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>CNG</option>
                  <option>Electric</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-[#111]">Overall Condition</label>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {Object.keys(CONDITION_MULTIPLIER).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setCondition(option)}
                      className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                        condition === option
                          ? "border-[#ff4054] bg-[#ff4054]/10 text-[#ff4054]"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowResult(true)}
              className="mt-8 w-full rounded-full bg-[#ff4054] px-6 py-4 text-base font-bold text-white transition hover:bg-[#e63b4d]"
            >
              Get My Estimate
            </button>

            {showResult && (
              <div className="mt-8 rounded-2xl bg-[#f8f8f8] p-6 text-center">
                <p className="text-sm text-gray-500">Estimated Selling Price</p>
                <p className="mt-2 text-4xl font-black text-[#ff4054]">{formatINR(estimate.mid)}</p>
                <p className="mt-2 text-sm text-gray-500">
                  Typical range: {formatINR(estimate.low)} – {formatINR(estimate.high)}
                </p>

                <Link
                  to="/sell"
                  className="mt-6 inline-block rounded-full bg-[#111] px-7 py-4 font-bold text-white transition hover:bg-black"
                >
                  List This Car →
                </Link>
              </div>
            )}
          </div>
        </Reveal>

        <p className="mt-6 text-center text-xs text-gray-400">
          *This is a rough, automated estimate based on typical depreciation trends — not a
          guaranteed offer. Actual value depends on inspection, demand, and local market
          conditions.
        </p>
      </div>
    </main>
  );
};

export default Valuation;
