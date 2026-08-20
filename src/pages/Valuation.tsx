import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import Reveal from "../components/Reveal";
import { API } from "../utils/api";

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
  Porsche: 5000000,
  Volvo: 3000000,
  Lexus: 4500000,
  Jaguar: 4200000,
  "Land Rover": 5500000,
  "Range Rover": 6500000,
};

const CONDITION_MULTIPLIER: Record<string, number> = {
  Excellent: 1.0,
  Good: 0.9,
  Fair: 0.78,
  Poor: 0.6,
};

const formatINR = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

const Valuation = () => {
  const currentYear = new Date().getFullYear();

  // ==========================================
  // FORM STATE
  // ==========================================

  const [brand, setBrand] = useState("Maruti");
  const [model, setModel] = useState("");

  const [year, setYear] = useState(
    currentYear - 3
  );

  const [kilometers, setKilometers] =
    useState(40000);

  const [fuelType, setFuelType] =
    useState("");

  const [transmission, setTransmission] =
    useState("");

  const [condition, setCondition] =
    useState("Good");

  const [showResult, setShowResult] =
    useState(false);

  const [optionsLoading, setOptionsLoading] =
    useState(true);

  const [fuelTypes, setFuelTypes] =
    useState<string[]>([]);

  const [transmissions, setTransmissions] =
    useState<string[]>([]);

  // ==========================================
  // LOAD DYNAMIC OPTIONS
  // ==========================================

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setOptionsLoading(true);

        const [
          fuelResponse,
          transmissionResponse,
        ] = await Promise.all([
          fetch(`${API}/options/fuel-types`),
          fetch(`${API}/options/transmissions`),
        ]);

        const fuelData =
          await fuelResponse.json();

        const transmissionData =
          await transmissionResponse.json();

        if (!fuelResponse.ok) {
          throw new Error(
            fuelData.message ||
              "Failed to load fuel types."
          );
        }

        if (!transmissionResponse.ok) {
          throw new Error(
            transmissionData.message ||
              "Failed to load transmissions."
          );
        }

        const dynamicFuelTypes =
          Array.isArray(
            fuelData.fuelTypes
          )
            ? fuelData.fuelTypes
                .map(
                  (item: {
                    name: string;
                  }) => item.name
                )
                .filter(Boolean)
            : [];

        const dynamicTransmissions =
          Array.isArray(
            transmissionData.transmissions
          )
            ? transmissionData.transmissions
                .map(
                  (item: {
                    name: string;
                  }) => item.name
                )
                .filter(Boolean)
            : [];

        setFuelTypes(
          dynamicFuelTypes
        );

        setTransmissions(
          dynamicTransmissions
        );

        if (
          dynamicFuelTypes.length > 0
        ) {
          setFuelType(
            dynamicFuelTypes[0]
          );
        }

        if (
          dynamicTransmissions.length >
          0
        ) {
          setTransmission(
            dynamicTransmissions[0]
          );
        }
      } catch (error) {
        console.error(
          "Valuation Options Error:",
          error
        );

        toast.error(
          "Unable to load vehicle options."
        );
      } finally {
        setOptionsLoading(false);
      }
    };

    loadOptions();
  }, []);

  // ==========================================
  // ESTIMATE CALCULATION
  // ==========================================

  const estimate = useMemo(() => {
    const baseValue =
      BRAND_BASE_VALUE[brand] ??
      800000;

    const age = Math.max(
      0,
      currentYear - year
    );

    // Depreciation
    const ageFactor = Math.max(
      0.25,
      Math.pow(0.88, age)
    );

    // Mileage
    const kmFactor = Math.max(
      0.7,
      1 - kilometers / 300000
    );

    // Fuel
    const normalizedFuel =
      fuelType.toLowerCase();

    const fuelFactor =
      normalizedFuel.includes(
        "diesel"
      )
        ? 1.03
        : normalizedFuel.includes(
            "electric"
          )
        ? 1.1
        : normalizedFuel.includes(
            "cng"
          )
        ? 1.02
        : 1;

    // Transmission
    const normalizedTransmission =
      transmission.toLowerCase();

    const transmissionFactor =
      normalizedTransmission.includes(
        "automatic"
      ) ||
      normalizedTransmission.includes(
        "dct"
      ) ||
      normalizedTransmission.includes(
        "cvt"
      )
        ? 1.05
        : 1;

    // Condition
    const conditionFactor =
      CONDITION_MULTIPLIER[
        condition
      ] ?? 0.9;

    // Model premium
    const normalizedModel =
      model.toLowerCase();

    let modelFactor = 1;

    if (
      /m3|m4|m5|q5|q7|q8|amg|glc|911|urus|huracan|roma|defender|range rover/.test(
        normalizedModel
      )
    ) {
      modelFactor = 1.2;
    }

    const midPoint =
      baseValue *
      ageFactor *
      kmFactor *
      fuelFactor *
      transmissionFactor *
      conditionFactor *
      modelFactor;

    return {
      low:
        Math.round(
          (midPoint * 0.93) / 1000
        ) * 1000,

      high:
        Math.round(
          (midPoint * 1.07) / 1000
        ) * 1000,

      mid:
        Math.round(
          midPoint / 1000
        ) * 1000,
    };
  }, [
    brand,
    model,
    year,
    kilometers,
    fuelType,
    transmission,
    condition,
    currentYear,
  ]);

  // ==========================================
  // GET ESTIMATE
  // ==========================================

  const handleEstimate = () => {
    if (!brand) {
      toast.warning(
        "Please select a brand."
      );
      return;
    }

    if (!model.trim()) {
      toast.warning(
        "Please enter the car model."
      );
      return;
    }

    if (
      !year ||
      year < 1990 ||
      year > currentYear
    ) {
      toast.warning(
        "Please enter a valid purchase year."
      );
      return;
    }

    if (
      kilometers < 0 ||
      !Number.isFinite(kilometers)
    ) {
      toast.warning(
        "Please enter valid kilometers."
      );
      return;
    }

    if (!fuelType) {
      toast.warning(
        "Please select fuel type."
      );
      return;
    }

    if (!transmission) {
      toast.warning(
        "Please select transmission."
      );
      return;
    }

    setShowResult(true);

    toast.success(
      "Your instant estimate is ready!"
    );
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 pb-24 pt-28 sm:px-6 lg:pt-32">

      <div className="mx-auto max-w-6xl">

        {/* =====================================
            PAGE HEADER
        ===================================== */}

        <div className="text-center">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ff4054]">
            Sell Smarter
          </p>

          <h1 className="mt-3 text-4xl font-black text-[#111] md:text-5xl">
            Instant Car Valuation
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-gray-500">
            Get a quick, ballpark estimate of what
            your car could sell for before you list it.
          </p>

        </div>

        {/* =====================================
            VALUATION AREA
        ===================================== */}

        <Reveal>

          <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1fr_360px]">

            {/* =================================
                LEFT — FORM
            ================================= */}

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-6">

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff4054]">
                  Vehicle Information
                </p>

                <h2 className="mt-2 text-2xl font-black text-[#111]">
                  Tell Us About Your Car
                </h2>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* BRAND */}

                <div>

                  <label className="text-sm font-semibold text-[#111]">
                    Brand Name
                  </label>

                  <select
                    value={brand}
                    onChange={(event) =>
                      setBrand(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#ff4054]"
                  >

                    {Object.keys(
                      BRAND_BASE_VALUE
                    ).map((option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ))}

                  </select>

                </div>

                {/* MODEL */}

                <div>

                  <label className="text-sm font-semibold text-[#111]">
                    Car Model
                  </label>

                  <input
                    type="text"
                    value={model}
                    onChange={(event) =>
                      setModel(
                        event.target.value
                      )
                    }
                    placeholder="e.g. M4, Creta, X5"
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#ff4054]"
                  />

                </div>

                {/* YEAR */}

                <div>

                  <label className="text-sm font-semibold text-[#111]">
                    Year of Purchase
                  </label>

                  <input
                    type="number"
                    min={1990}
                    max={currentYear}
                    value={year}
                    onChange={(event) =>
                      setYear(
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ff4054]"
                  />

                </div>

                {/* KM */}

                <div>

                  <label className="text-sm font-semibold text-[#111]">
                    Kilometers Driven
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={kilometers}
                    onChange={(event) =>
                      setKilometers(
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ff4054]"
                  />

                </div>

                {/* FUEL */}

                <div>

                  <label className="text-sm font-semibold text-[#111]">
                    Fuel Type
                  </label>

                  <select
                    value={fuelType}
                    disabled={
                      optionsLoading
                    }
                    onChange={(event) =>
                      setFuelType(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ff4054]"
                  >

                    <option value="">
                      {optionsLoading
                        ? "Loading..."
                        : "Select Fuel Type"}
                    </option>

                    {fuelTypes.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* TRANSMISSION */}

                <div>

                  <label className="text-sm font-semibold text-[#111]">
                    Transmission
                  </label>

                  <select
                    value={transmission}
                    disabled={
                      optionsLoading
                    }
                    onChange={(event) =>
                      setTransmission(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ff4054]"
                  >

                    <option value="">
                      {optionsLoading
                        ? "Loading..."
                        : "Select Transmission"}
                    </option>

                    {transmissions.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* CONDITION */}

                <div className="sm:col-span-2">

                  <label className="text-sm font-semibold text-[#111]">
                    Overall Condition
                  </label>

                  <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">

                    {Object.keys(
                      CONDITION_MULTIPLIER
                    ).map(
                      (option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setCondition(
                              option
                            )
                          }
                          className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                            condition ===
                            option
                              ? "border-[#ff4054] bg-[#ff4054]/10 text-[#ff4054]"
                              : "border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}
                        >
                          {option}
                        </button>
                      )
                    )}

                  </div>

                </div>

              </div>

              {/* GET ESTIMATE */}

              <button
                type="button"
                onClick={
                  handleEstimate
                }
                className="mt-8 w-full rounded-full bg-[#ff4054] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#ff4054]/20 transition hover:bg-[#e63b4d]"
              >
                Get My Estimate
              </button>

            </div>

            {/* =================================
                RIGHT — RESULT
            ================================= */}

            <div className="lg:sticky lg:top-28">

              {!showResult ? (

                <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-7 text-center shadow-sm">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff5f6] text-2xl">
                    ₹
                  </div>

                  <h3 className="mt-5 text-xl font-black text-[#111]">
                    Your Estimate
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Enter your vehicle details
                    and click{" "}
                    <strong>
                      Get My Estimate
                    </strong>{" "}
                    to see the estimated
                    selling price.
                  </p>

                </div>

              ) : (

                <div className="rounded-3xl bg-[#111] p-7 text-white shadow-xl">

                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff4054]">
                    Estimated Value
                  </p>

                  <h3 className="mt-3 text-xl font-black">
                    {brand} {model}
                  </h3>

                  <div className="mt-6">

                    <p className="text-sm text-gray-400">
                      Estimated Selling Price
                    </p>

                    <p className="mt-2 text-4xl font-black text-[#ff4054]">
                      {formatINR(
                        estimate.mid
                      )}
                    </p>

                  </div>

                  <div className="mt-5 rounded-2xl bg-white/5 p-4">

                    <p className="text-xs text-gray-400">
                      Typical Market Range
                    </p>

                    <p className="mt-1 text-sm font-bold">
                      {formatINR(
                        estimate.low
                      )}{" "}
                      –{" "}
                      {formatINR(
                        estimate.high
                      )}
                    </p>

                  </div>

                  {/* SUMMARY */}

                  <div className="mt-5 space-y-3 border-t border-white/10 pt-5">

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        Year
                      </span>
                      <span className="font-bold">
                        {year}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        Kilometers
                      </span>
                      <span className="font-bold">
                        {kilometers.toLocaleString(
                          "en-IN"
                        )} km
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        Fuel
                      </span>
                      <span className="font-bold">
                        {fuelType}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        Transmission
                      </span>
                      <span className="font-bold">
                        {transmission}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        Condition
                      </span>
                      <span className="font-bold">
                        {condition}
                      </span>
                    </div>

                  </div>

                  <Link
                    to="/sell"
                    className="mt-6 block rounded-full bg-[#ff4054] px-7 py-4 text-center text-sm font-bold text-white transition hover:bg-[#e63b4d]"
                  >
                    List This Car →
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      setShowResult(false)
                    }
                    className="mt-3 w-full rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/5"
                  >
                    Edit Details
                  </button>

                </div>

              )}

            </div>

          </div>

        </Reveal>

        {/* =====================================
            DISCLAIMER
        ===================================== */}

        <p className="mt-6 text-center text-xs text-gray-400">
          *This is a rough, automated estimate
          based on typical depreciation trends —
          not a guaranteed offer. Actual value
          depends on inspection, demand, and local
          market conditions.
        </p>

      </div>

    </main>
  );
};

export default Valuation;