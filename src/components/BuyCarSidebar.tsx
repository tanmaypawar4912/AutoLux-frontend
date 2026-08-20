import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  RotateCcw,
} from "lucide-react";

// =====================================================
// TYPES
// =====================================================

interface BuyCarSidebarProps {
  // ==========================
  // BASIC FILTERS
  // ==========================

  searchTerm: string;
  setSearchTerm: (value: string) => void;

  selectedBrand: string;
  setSelectedBrand: (value: string) => void;

  fuelFilter: string;
  setFuelFilter: (value: string) => void;

  transmissionFilter: string;
  setTransmissionFilter: (value: string) => void;

  yearFilter: string;
  setYearFilter: (value: string) => void;

  kilometersFilter: string;
  setKilometersFilter: (value: string) => void;

  // ==========================
  // PRICE
  // ==========================

  maxPrice: number;
  setMaxPrice: (value: number) => void;

  priceSliderMax: number;

  // ==========================
  // BASIC OPTIONS
  // ==========================

  brands: string[];
  models?: string[];
  fuels: string[];
  transmissions: string[];
  years: string[];
  kilometerRanges?: string[];

  optionsLoading?: boolean;

  // ==========================
  // RESET
  // ==========================

  onClearFilters: () => void;

  // ==========================
  // DYNAMIC CAR OPTIONS
  // ==========================

  bodyTypeFilter: string;
  setBodyTypeFilter: (value: string) => void;

  colorFilter: string;
  setColorFilter: (value: string) => void;

  seatsFilter: string;
  setSeatsFilter: (value: string) => void;

  ownersFilter: string;
  setOwnersFilter: (value: string) => void;

  hubFilter: string;
  setHubFilter: (value: string) => void;

  availabilityFilter: string;
  setAvailabilityFilter: (value: string) => void;

  carCategoryFilter: string;
  setCarCategoryFilter: (value: string) => void;

  safetyFilter?: string;
  setSafetyFilter?: (value: string) => void;

  featureFilter?: string;
  setFeatureFilter?: (value: string) => void;

  // ==========================
  // DYNAMIC OPTION ARRAYS
  // ==========================

  bodyTypes: string[];
  colors: string[];
  seats: string[];
  owners: string[];
  hubs: string[];
  availability: string[];
  carCategories: string[];
  safetyFeatures?: string[];
  features?: string[];
}

// =====================================================
// FILTER SECTION
// =====================================================

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: SectionProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-[15px] font-bold text-[#111]">
          {title}
        </span>

        {open ? (
          <ChevronUp size={16} />
        ) : (
          <ChevronDown size={16} />
        )}
      </button>

      {open && (
        <div className="px-5 pb-6">
          {children}
        </div>
      )}
    </div>
  );
};

// =====================================================
// RADIO OPTION
// =====================================================

interface CheckOptionProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  name?: string;
}

const CheckOption = ({
  label,
  checked,
  onChange,
  name,
}: CheckOptionProps) => {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-2">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-[#ff4054]"
      />

      <span
        className={`text-sm ${
          checked
            ? "font-bold text-[#111]"
            : "text-gray-600"
        }`}
      >
        {label}
      </span>
    </label>
  );
};

// =====================================================
// EMPTY MESSAGE
// =====================================================

const EmptyFilterMessage = ({
  text,
}: {
  text: string;
}) => {
  return (
    <p className="py-2 text-sm text-gray-400">
      {text}
    </p>
  );
};


// =====================================================
// DYNAMIC BRAND / MODEL SEARCH
// =====================================================

interface SearchCarsInputProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  brands: string[];
  models: string[];
  setSelectedBrand: (value: string) => void;
}

const SearchCarsInput = ({
  searchTerm,
  setSearchTerm,
  brands,
  models,
  setSelectedBrand,
}: SearchCarsInputProps) => {
  const [focused, setFocused] = useState(false);

  const suggestions = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const brandItems = brands
      .filter((brand) => brand !== "All")
      .filter(
        (brand) =>
          !search ||
          brand.toLowerCase().includes(search)
      )
      .map((value) => ({
        type: "Brand" as const,
        value,
      }));

    const modelItems = models
      .filter(
        (model) =>
          !search ||
          model.toLowerCase().includes(search)
      )
      .map((value) => ({
        type: "Model" as const,
        value,
      }));

    return [...brandItems, ...modelItems]
      .filter(
        (item, index, array) =>
          array.findIndex(
            (other) =>
              other.type === item.type &&
              other.value.toLowerCase() ===
                item.value.toLowerCase()
          ) === index
      )
      .slice(0, 10);
  }, [brands, models, searchTerm]);

  return (
    <div className="relative">
      <Search
        size={15}
        className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      />

      <input
        type="text"
        value={searchTerm}
        onFocus={() => setFocused(true)}
        onBlur={() =>
          window.setTimeout(
            () => setFocused(false),
            150
          )
        }
        onChange={(event) =>
          setSearchTerm(event.target.value)
        }
        placeholder="Search brand or model..."
        className="
          w-full
          rounded-xl
          border
          border-gray-200
          px-9
          py-3
          text-sm
          outline-none
          focus:border-[#ff4054]
        "
      />

      {focused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {suggestions.map((item) => (
            <button
              key={`${item.type}-${item.value}`}
              type="button"
              onMouseDown={(event) =>
                event.preventDefault()
              }
              onClick={() => {
                if (item.type === "Brand") {
                  setSelectedBrand(item.value);
                  setSearchTerm("");
                } else {
                  setSearchTerm(item.value);
                }
                setFocused(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <span>{item.value}</span>
              <span className="text-[10px] uppercase tracking-wide text-gray-400">
                {item.type}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// =====================================================
// BUY CAR SIDEBAR
// =====================================================

const BuyCarSidebar = ({
  // ==========================
  // BASIC FILTERS
  // ==========================

  searchTerm,
  setSearchTerm,

  selectedBrand,
  setSelectedBrand,

  fuelFilter,
  setFuelFilter,

  transmissionFilter,
  setTransmissionFilter,

  yearFilter,
  setYearFilter,

  kilometersFilter = "All",
  setKilometersFilter,

  // ==========================
  // PRICE
  // ==========================

  maxPrice,
  setMaxPrice,

  priceSliderMax,

  // ==========================
  // OPTIONS
  // ==========================

  brands = [],
  models = [],
  fuels = ["All"],
  transmissions = ["All"],
  years = ["All"],
  kilometerRanges = ["All"],

  optionsLoading,

  // ==========================
  // RESET
  // ==========================

  onClearFilters,

  // ==========================
  // DYNAMIC FILTERS
  // ==========================

  bodyTypeFilter,
  setBodyTypeFilter,

  colorFilter,
  setColorFilter,

  seatsFilter,
  setSeatsFilter,

  ownersFilter,
  setOwnersFilter,

  hubFilter,
  setHubFilter,

  availabilityFilter,
  setAvailabilityFilter,

  carCategoryFilter,
  setCarCategoryFilter,

  safetyFilter = "All",
  setSafetyFilter,

  featureFilter = "All",
  setFeatureFilter,

  // ==========================
  // DYNAMIC ARRAYS
  // ==========================

  bodyTypes = ["All"],
  colors = ["All"],
  seats = ["All"],
  owners = ["All"],
  hubs = ["All"],
  availability = ["All"],
  carCategories = ["All"],
  safetyFeatures = ["All"],
  features = ["All"],
}: BuyCarSidebarProps) => {
  // ===================================================
  // BRAND SEARCH
  // ===================================================

  const [brandSearch, setBrandSearch] =
    useState("");

  const filteredBrands = useMemo(() => {
    const search = brandSearch
      .trim()
      .toLowerCase();

    if (!search) {
      return brands;
    }

    return brands.filter((brand) =>
      brand
        .toLowerCase()
        .includes(search)
    );
  }, [brands, brandSearch]);

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <aside
      className="
        sticky
        top-24
        max-h-[calc(100vh-120px)]
        overflow-y-auto
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-sm
      "
    >
      {/* =================================================
          SEARCH
      ================================================= */}

      <FilterSection title="Search Cars">
        <SearchCarsInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          brands={brands}
          models={models}
          setSelectedBrand={setSelectedBrand}
        />
      </FilterSection>

      {/* =================================================
          PRICE RANGE
      ================================================= */}

      <FilterSection title="Price Range">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            ₹1 Lakh
          </span>

          <span className="font-bold text-[#ff4054]">
            ₹
            {maxPrice.toLocaleString(
              "en-IN"
            )}
          </span>
        </div>

        <input
          type="range"
          min={Math.min(
            100000,
            priceSliderMax
          )}
          max={priceSliderMax}
          step={50000}
          value={Math.min(
            maxPrice,
            priceSliderMax
          )}
          onChange={(event) =>
            setMaxPrice(
              Number(event.target.value)
            )
          }
          className="
            mt-4
            w-full
            accent-[#ff4054]
          "
        />

        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>Minimum</span>
          <span>Maximum</span>
        </div>
      </FilterSection>

      {/* =================================================
          BRANDS
      ================================================= */}

      <FilterSection title="Brands & Models">
        <input
          type="text"
          value={brandSearch}
          onChange={(event) =>
            setBrandSearch(
              event.target.value
            )
          }
          placeholder="Search brand..."
          className="
            mb-3
            w-full
            rounded-lg
            border
            border-gray-200
            px-3
            py-2
            text-sm
            outline-none
            focus:border-[#ff4054]
          "
        />

        <CheckOption
          label="All Brands"
          checked={
            selectedBrand === "All"
          }
          onChange={() =>
            setSelectedBrand("All")
          }
        />

        <div className="max-h-64 overflow-y-auto">
          {filteredBrands
            .filter(
              (brand) =>
                brand !== "All"
            )
            .map((brand) => (
              <CheckOption
                key={brand}
                label={brand}
                checked={
                  selectedBrand ===
                  brand
                }
                onChange={() =>
                  setSelectedBrand(
                    brand
                  )
                }
              />
            ))}
        </div>
      </FilterSection>

      {/* =================================================
          YEAR
      ================================================= */}

      <FilterSection title="Year">
        {years.map((year) => (
          <CheckOption
            key={year}
            label={
              year === "All"
                ? "All Years"
                : `${year} & above`
            }
            checked={
              yearFilter === year
            }
            onChange={() =>
              setYearFilter(year)
            }
          />
        ))}
      </FilterSection>

      {/* =================================================
          KILOMETERS
      ================================================= */}

      <FilterSection title="Kms Driven">
        {kilometerRanges.length > 0 ? (
          kilometerRanges.map((range) => (
            <CheckOption
              key={range}
              label={range}
              checked={kilometersFilter === range}
              onChange={() =>
                setKilometersFilter(range)
              }
            />
          ))
        ) : (
          <EmptyFilterMessage
            text="No kilometer data available."
          />
        )}
      </FilterSection>

      {/* =================================================
          FUEL TYPE
      ================================================= */}

      <FilterSection title="Fuel Type">
        {optionsLoading ? (
          <p className="text-xs text-gray-400">
            Loading fuel types...
          </p>
        ) : fuels.length > 0 ? (
          fuels.map((fuel) => (
            <CheckOption
              key={fuel}
              label={
                fuel === "All"
                  ? "All Fuel Types"
                  : fuel
              }
              checked={
                fuelFilter === fuel
              }
              onChange={() =>
                setFuelFilter(fuel)
              }
            />
          ))
        ) : (
          <EmptyFilterMessage
            text="No fuel types available."
          />
        )}
      </FilterSection>

      {/* =================================================
          BODY TYPE
      ================================================= */}

      <FilterSection title="Body Type">
        {bodyTypes.length > 0 ? (
          bodyTypes.map((item) => (
            <CheckOption
              key={item}
              label={
                item === "All"
                  ? "All Body Types"
                  : item
              }
              checked={
                bodyTypeFilter === item
              }
              onChange={() =>
                setBodyTypeFilter(item)
              }
            />
          ))
        ) : (
          <EmptyFilterMessage
            text="No body types available."
          />
        )}
      </FilterSection>

      {/* =================================================
          TRANSMISSION
      ================================================= */}

      <FilterSection title="Transmission">
        {optionsLoading ? (
          <p className="text-xs text-gray-400">
            Loading transmissions...
          </p>
        ) : transmissions.length > 0 ? (
          transmissions.map(
            (item) => (
              <CheckOption
                key={item}
                label={
                  item === "All"
                    ? "All Transmissions"
                    : item
                }
                checked={
                  transmissionFilter ===
                  item
                }
                onChange={() =>
                  setTransmissionFilter(
                    item
                  )
                }
              />
            )
          )
        ) : (
          <EmptyFilterMessage
            text="No transmissions available."
          />
        )}
      </FilterSection>

      {/* =================================================
          CAR CATEGORY
      ================================================= */}

      <FilterSection
        title="Car Category"
        defaultOpen={false}
      >
        {carCategories.length > 0 ? (
          carCategories.map(
            (item) => (
              <CheckOption
                key={item}
                label={
                  item === "All"
                    ? "All Categories"
                    : item
                }
                checked={
                  carCategoryFilter ===
                  item
                }
                onChange={() =>
                  setCarCategoryFilter(
                    item
                  )
                }
              />
            )
          )
        ) : (
          <EmptyFilterMessage
            text="No categories available."
          />
        )}
      </FilterSection>

      {/* =================================================
          COLOR
      ================================================= */}

      <FilterSection title="Color">
        {colors.length > 0 ? (
          colors.map((item) => (
            <CheckOption
              key={item}
              label={
                item === "All"
                  ? "All Colors"
                  : item
              }
              checked={
                colorFilter === item
              }
              onChange={() =>
                setColorFilter(item)
              }
            />
          ))
        ) : (
          <EmptyFilterMessage
            text="No colors available."
          />
        )}
      </FilterSection>

      {/* =================================================
          SEATS
      ================================================= */}

      <FilterSection title="Seats">
        {seats.length > 0 ? (
          seats.map((item) => (
            <CheckOption
              key={item}
              label={
                item === "All"
                  ? "All Seats"
                  : `${item} seater`
              }
              checked={
                seatsFilter === item
              }
              onChange={() =>
                setSeatsFilter(item)
              }
            />
          ))
        ) : (
          <EmptyFilterMessage
            text="No seat options available."
          />
        )}
      </FilterSection>

      {/* =================================================
          OWNERS
      ================================================= */}

      <FilterSection title="Owner">
        {owners.length > 0 ? (
          owners.map((item) => (
            <CheckOption
              key={item}
              label={
                item === "All"
                  ? "All Owners"
                  : item
              }
              checked={
                ownersFilter === item
              }
              onChange={() =>
                setOwnersFilter(item)
              }
            />
          ))
        ) : (
          <EmptyFilterMessage
            text="No owner options available."
          />
        )}
      </FilterSection>

      {/* =================================================
          AUTOLUX HUB
      ================================================= */}

      <FilterSection title="AutoLux Hubs">
        {hubs.length > 0 ? (
          hubs.map((item) => (
            <CheckOption
              key={item}
              label={
                item === "All"
                  ? "All Hubs"
                  : item
              }
              checked={
                hubFilter === item
              }
              onChange={() =>
                setHubFilter(item)
              }
            />
          ))
        ) : (
          <EmptyFilterMessage
            text="No hubs available."
          />
        )}
      </FilterSection>

      {/* =================================================
          AVAILABILITY
      ================================================= */}

      <FilterSection title="Availability">
        {availability.length > 0 ? (
          availability.map(
            (item) => (
              <CheckOption
                key={item}
                label={
                  item === "All"
                    ? "All Availability"
                    : item
                }
                checked={
                  availabilityFilter ===
                  item
                }
                onChange={() =>
                  setAvailabilityFilter(
                    item
                  )
                }
              />
            )
          )
        ) : (
          <EmptyFilterMessage
            text="No availability options available."
          />
        )}
      </FilterSection>

      {/* =================================================
          SAFETY & FEATURES
      ================================================= */}

      <FilterSection
        title="Safety & Features"
        defaultOpen={false}
      >
        <p className="text-xs font-bold text-gray-700">
          Safety
        </p>

        <div className="mt-2 space-y-1">
          {safetyFeatures.length > 0 ? (
            safetyFeatures.map((item) => (
              <CheckOption
                key={item}
                name="safety-filter"
                label={
                  item === "All"
                    ? "All Safety"
                    : item
                }
                checked={
                  safetyFilter === item
                }
                onChange={() =>
                  setSafetyFilter?.(item)
                }
              />
            ))
          ) : (
            <EmptyFilterMessage
              text="No safety options available."
            />
          )}
        </div>

        <p className="mt-4 text-xs font-bold text-gray-700">
          Features
        </p>

        <div className="mt-2 space-y-1">
          {features.length > 0 ? (
            features.map((item) => (
              <CheckOption
                key={item}
                name="feature-filter"
                label={
                  item === "All"
                    ? "All Features"
                    : item
                }
                checked={
                  featureFilter === item
                }
                onChange={() =>
                  setFeatureFilter?.(item)
                }
              />
            ))
          ) : (
            <EmptyFilterMessage
              text="No feature options available."
            />
          )}
        </div>
      </FilterSection>

      {/* =================================================
          CLEAR FILTERS
      ================================================= */}

      <div className="p-4">
        <button
          type="button"
          onClick={onClearFilters}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-3
            text-sm
            font-bold
            text-gray-700
            transition
            hover:border-[#ff4054]
            hover:text-[#ff4054]
          "
        >
          <RotateCcw size={14} />

          Clear Filters
        </button>
      </div>
    </aside>
  );
};

export default BuyCarSidebar;