import { RotateCcw } from "lucide-react";

interface AdminFilterProps {
  status: string;
  setStatus: (status: string) => void;

  brand: string;
  setBrand: (brand: string) => void;

  fuelType: string;
  setFuelType: (fuelType: string) => void;

  transmission: string;
  setTransmission: (transmission: string) => void;

  year: string;
  setYear: (year: string) => void;

  brands: string[];
  fuelTypes: string[];
  transmissions: string[];
  years: number[];

  onReset: () => void;
}

const AdminFilter = ({
  status,
  setStatus,
  brand,
  setBrand,
  fuelType,
  setFuelType,
  transmission,
  setTransmission,
  year,
  setYear,
  brands,
  fuelTypes,
  transmissions,
  years,
  onReset,
}: AdminFilterProps) => {
  const statusFilters = [
    {
      id: "all",
      label: "All",
      activeClass: "bg-[#ff4054] text-white",
    },
    {
      id: "pending",
      label: "Pending",
      activeClass: "bg-yellow-500 text-white",
    },
    {
      id: "approved",
      label: "Approved",
      activeClass: "bg-green-500 text-white",
    },
    {
      id: "rejected",
      label: "Rejected",
      activeClass: "bg-red-500 text-white",
    },
  ];

  const hasActiveFilters =
    status !== "all" ||
    brand !== "all" ||
    fuelType !== "all" ||
    transmission !== "all" ||
    year !== "all";

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
      {/* HEADER */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-gray-900">
            Filters
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Filter cars using live database values.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="
              flex
              w-fit
              items-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-bold
              text-gray-700
              transition
              hover:border-[#ff4054]
              hover:text-[#ff4054]
            "
          >
            <RotateCcw size={16} />
            Reset Filters
          </button>
        )}
      </div>

      {/* STATUS */}
      <div>
        <p className="mb-3 text-sm font-bold text-gray-700">
          Status
        </p>

        <div className="flex flex-wrap gap-3">
          {statusFilters.map((filter) => {
            const isActive = status === filter.id;

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setStatus(filter.id)}
                className={`
                  rounded-xl
                  border
                  px-5
                  py-3
                  font-semibold
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? filter.activeClass
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* DATABASE FILTERS */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* BRAND */}
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Brand
          </label>

          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-3
              outline-none
              transition
              focus:border-[#ff4054]
              focus:ring-2
              focus:ring-[#ff4054]/10
            "
          >
            <option value="all">All Brands</option>

            {brands.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* FUEL TYPE */}
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Fuel Type
          </label>

          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-3
              outline-none
              transition
              focus:border-[#ff4054]
              focus:ring-2
              focus:ring-[#ff4054]/10
            "
          >
            <option value="all">All Fuel Types</option>

            {fuelTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* TRANSMISSION */}
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Transmission
          </label>

          <select
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-3
              outline-none
              transition
              focus:border-[#ff4054]
              focus:ring-2
              focus:ring-[#ff4054]/10
            "
          >
            <option value="all">All Transmissions</option>

            {transmissions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* YEAR */}
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Year
          </label>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-3
              outline-none
              transition
              focus:border-[#ff4054]
              focus:ring-2
              focus:ring-[#ff4054]/10
            "
          >
            <option value="all">All Years</option>

            {years.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ACTIVE FILTER INDICATOR */}
      {hasActiveFilters && (
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold text-gray-500">
            Active:
          </span>

          {status !== "all" && (
            <span className="rounded-full bg-[#ff4054]/10 px-3 py-1 font-semibold text-[#ff4054]">
              Status: {status}
            </span>
          )}

          {brand !== "all" && (
            <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-600">
              Brand: {brand}
            </span>
          )}

          {fuelType !== "all" && (
            <span className="rounded-full bg-purple-50 px-3 py-1 font-semibold text-purple-600">
              Fuel: {fuelType}
            </span>
          )}

          {transmission !== "all" && (
            <span className="rounded-full bg-green-50 px-3 py-1 font-semibold text-green-600">
              Transmission: {transmission}
            </span>
          )}

          {year !== "all" && (
            <span className="rounded-full bg-orange-50 px-3 py-1 font-semibold text-orange-600">
              Year: {year}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminFilter;