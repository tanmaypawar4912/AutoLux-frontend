import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { API } from "../utils/api";

import {
  toggleWishlist,
  isWishlisted,
} from "../utils/storage";

import { getCompareList, toggleCompare, COMPARE_EVENT, MAX_COMPARE } from "../utils/compare";
import CompareBar from "../components/CompareBar";

import Reveal from "../components/Reveal";

// ==============================
// BACKEND CAR
// ==============================

interface BackendCar {
  _id: string;
  sellerName: string;
  sellerEmail: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  kilometers: number;
  fuelType: string;
  transmission: string;
  description: string;
  image?: string;
  status?: string;
  createdAt?: string;
  city?: string;
}

// ==============================
// DISPLAY CAR
// ==============================

interface DisplayCar {
  id: string;
  brand: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  kilometers: number;
  fuelType: string;
  transmission: string;
  year: number;
  priceValue: number;
  price: string;
  city: string;
}

const BuyCars = () => {

  const [searchParams] = useSearchParams();

  const brandFromUrl =
    searchParams.get("brand") || "All";

  const [backendCars, setBackendCars] =
    useState<BackendCar[]>([]);

  const [loading, setLoading] =
    useState(true);
  const [, forceUpdate] = useState(0);
  // Filters

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedBrand, setSelectedBrand] =
    useState(brandFromUrl);

  const [fuelFilter, setFuelFilter] =
    useState("All");

  const [transmissionFilter, setTransmissionFilter] =
    useState("All");

  const [yearFilter, setYearFilter] =
    useState("All");

  const [cityFilter, setCityFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("default");

  const [maxPrice, setMaxPrice] =
    useState(10000000);

  // Pagination

  const [currentPage, setCurrentPage] =
    useState(1);

  const carsPerPage = 9;

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareLimitNotice, setCompareLimitNotice] = useState(false);

  useEffect(() => {
    const syncCompare = () => setCompareIds(getCompareList());
    syncCompare();

    window.addEventListener(COMPARE_EVENT, syncCompare);
    window.addEventListener("storage", syncCompare);
    return () => {
      window.removeEventListener(COMPARE_EVENT, syncCompare);
      window.removeEventListener("storage", syncCompare);
    };
  }, []);

  const handleToggleCompare = (carId: string) => {
    const wasAlreadySelected = compareIds.includes(carId);
    const { list } = toggleCompare(carId);
    setCompareIds(list);

    if (!wasAlreadySelected && !list.includes(carId)) {
      setCompareLimitNotice(true);
      window.setTimeout(() => setCompareLimitNotice(false), 2500);
    }
  };

  useEffect(() => {
    setSelectedBrand(brandFromUrl);
  }, [brandFromUrl]);
  // ==============================
  // FETCH CARS
  // ==============================

  useEffect(() => {

    const fetchCars = async () => {

      try {

        const response = await fetch(`${API}/cars`);

        const data = await response.json();

        if (data.success) {

          const approvedCars = data.cars.filter(
            (car: BackendCar) =>
              car.status === "approved"
          );

          setBackendCars(approvedCars);

        }

      } catch (error) {

        console.error(
          "Error Fetching Cars:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    fetchCars();

  }, []);
  // ==============================
  // CONVERT BACKEND DATA
  // ==============================

  const allCars = useMemo<DisplayCar[]>(() => {

    return backendCars.map((car) => ({

      id: car._id,

      brand: car.brand,

      name: car.model,

      tagline: `${car.year} • ${car.fuelType} • ${car.transmission}`,

      description: car.description,

      image: car.image || "/default-car.jpg",

      kilometers: car.kilometers,

      fuelType: car.fuelType,

      transmission: car.transmission,

      year: car.year,

      priceValue: car.price,

      price: `₹${Number(car.price).toLocaleString("en-IN")}`,

      city: car.city || "Not specified",

    }));

  }, [backendCars]);

  // ==============================
  // FILTER OPTIONS
  // ==============================

  const brands = useMemo(() => [

    "All",

    ...new Set(allCars.map((car) => car.brand))

  ], [allCars]);

  const fuels = useMemo(() => [

    "All",

    ...new Set(allCars.map((car) => car.fuelType))

  ], [allCars]);

  const transmissions = useMemo(() => [

    "All",

    ...new Set(allCars.map((car) => car.transmission))

  ], [allCars]);

  const years = useMemo(() => [

    "All",

    ...new Set(
      allCars.map((car) => car.year.toString())
    )

  ], [allCars]);

  const cities = useMemo(() => [

    "All",

    ...new Set(
      allCars
        .map((car) => car.city)
        .filter((city) => city && city !== "Not specified")
    )

  ], [allCars]);
  // ==============================
  // FILTER + SORT
  // ==============================

  const filteredCars = useMemo(() => {

    let result = allCars.filter((car) => {

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        car.name.toLowerCase().includes(search) ||
        car.brand.toLowerCase().includes(search);

      const matchesBrand =
        selectedBrand === "All" ||
        car.brand === selectedBrand;

      const matchesFuel =
        fuelFilter === "All" ||
        car.fuelType === fuelFilter;

      const matchesTransmission =
        transmissionFilter === "All" ||
        car.transmission === transmissionFilter;

      const matchesYear =
        yearFilter === "All" ||
        car.year.toString() === yearFilter;

      const matchesCity =
        cityFilter === "All" ||
        car.city === cityFilter;

      const matchesPrice =
        car.priceValue <= maxPrice;

      return (
        matchesSearch &&
        matchesBrand &&
        matchesFuel &&
        matchesTransmission &&
        matchesYear &&
        matchesCity &&
        matchesPrice
      );

    });

    switch (sortBy) {

      case "name":
        result.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case "brand":
        result.sort((a, b) =>
          a.brand.localeCompare(b.brand)
        );
        break;

      case "price-low":
        result.sort(
          (a, b) =>
            a.priceValue - b.priceValue
        );
        break;

      case "price-high":
        result.sort(
          (a, b) =>
            b.priceValue - a.priceValue
        );
        break;

      default:
        break;
    }

    return result;

  }, [
    allCars,
    searchTerm,
    selectedBrand,
    fuelFilter,
    transmissionFilter,
    yearFilter,
    cityFilter,
    maxPrice,
    sortBy,
  ]);
  // ==============================
  // PAGINATION
  // ==============================

  const totalPages = Math.ceil(
    filteredCars.length / carsPerPage
  );

  const indexOfLastCar =
    currentPage * carsPerPage;

  const indexOfFirstCar =
    indexOfLastCar - carsPerPage;

  const currentCars =
    filteredCars.slice(
      indexOfFirstCar,
      indexOfLastCar
    );

  // Page change zalyavar top la scroll
  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }, [currentPage]);
  return (
    <main className="min-h-screen bg-[#f8f8f8] px-6 pb-24 pt-36">

      <div className="mx-auto max-w-7xl">

        {/* =========================
          HEADER
      ========================== */}

        <Reveal>

          <div className="max-w-3xl">

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ff4054]">
              Our Collection
            </p>

            <h1 className="mt-4 text-4xl md:text-6xl font-black text-[#111]">
              Find Your <span className="text-[#ff4054]">Perfect Drive.</span>
            </h1>

            <p className="mt-5 text-gray-500 max-w-2xl">
              Explore premium vehicles directly from verified sellers.
            </p>
          </div>

        </Reveal>

        {/* =========================
          FILTER BAR
      ========================== */}

        <Reveal>

          <div className="mt-8 grid gap-4 rounded-3xl bg-white p-4 shadow-sm sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">

            {/* Search */}

            <input
              type="text"
              placeholder="Search Cars..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none focus:border-[#ff4054]"
            />

            {/* Brand */}

            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4"
            >
              {brands.map((brand) => (
                <option
                  key={brand}
                  value={brand}
                >
                  {brand === "All"
                    ? "All Brands"
                    : brand}
                </option>
              ))}
            </select>

            {/* Fuel */}

            <select
              value={fuelFilter}
              onChange={(e) => {
                setFuelFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4"
            >
              {fuels.map((fuel) => (
                <option
                  key={fuel}
                  value={fuel}
                >
                  {fuel === "All"
                    ? "All Fuel Types"
                    : fuel}
                </option>
              ))}
            </select>

            {/* Transmission */}

            <select
              value={transmissionFilter}
              onChange={(e) => {
                setTransmissionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4"
            >
              {transmissions.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item === "All"
                    ? "Transmission"
                    : item}
                </option>
              ))}
            </select>

            {/* Year */}

            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4"
            >
              {years.map((year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year === "All"
                    ? "All Years"
                    : year}
                </option>
              ))}
            </select>

            {/* City */}

            <select
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4"
            >
              {cities.map((city) => (
                <option
                  key={city}
                  value={city}
                >
                  {city === "All" ? "All Cities" : city}
                </option>
              ))}
            </select>

            {/* Sort */}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4"
            >
              <option value="default">Sort By</option>
              <option value="price-low">Price Low → High</option>
              <option value="price-high">Price High → Low</option>
              <option value="name">Model A-Z</option>
              <option value="brand">Brand A-Z</option>
            </select>
            {/* Price */}

            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 sm:col-span-2 lg:col-span-2">

              <div className="flex justify-between text-sm">

                <span>Max Price</span>

                <span className="font-bold text-[#ff4054]">
                  ₹{maxPrice.toLocaleString("en-IN")}
                </span>

              </div>

              <input
                type="range"
                min={100000}
                max={10000000}
                step={50000}
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="mt-3 w-full accent-[#ff4054]"
              />

            </div>

          </div>

        </Reveal>

        {
/* =========================
    RESULT COUNT
========================= */}

        {!loading && (
          <div className="mt-10 flex items-center justify-between">

            <p className="text-sm font-semibold text-gray-500">
              Showing
              <span className="mx-2 font-black text-[#111]">
                {filteredCars.length}
              </span>
              Cars
            </p>

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedBrand("All");
                setFuelFilter("All");
                setTransmissionFilter("All");
                setYearFilter("All");
                setSortBy("default");
                setMaxPrice(10000000);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-semibold hover:border-[#ff4054]"
            >
              Clear Filters
            </button>

          </div>
        )}

        {/* =========================
    LOADING
========================= */}

        {loading ? (

          <div className="mt-24 text-center">

            <div className="text-6xl animate-bounce">
              🚗
            </div>

            <h2 className="mt-6 text-3xl font-black">
              Loading Cars...
            </h2>

          </div>

        ) : currentCars.length === 0 ? (

          <div className="mt-20 rounded-3xl bg-white p-16 text-center shadow">

            <h2 className="text-4xl font-black">
              No Cars Found
            </h2>

            <p className="mt-4 text-gray-500">
              Try changing your filters.
            </p>

          </div>

        ) : (

          <>

            {/* =========================
        CAR GRID
    ========================== */}

            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {currentCars.map((car) => (

                <Reveal key={car.id}>

                  <article className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-2xl">

                    <div className="relative h-56 overflow-hidden bg-[#f4f4f4]">
                      <button
                        onClick={() => {
                          toggleWishlist({
                            _id: car.id,
                            brand: car.brand,
                            model: car.name,
                            image: car.image,
                            price: car.priceValue,
                          });

                          forceUpdate((v) => v + 1);
                        }}
                        className="absolute right-4 top-4 z-20 rounded-full bg-white p-3 shadow-lg transition hover:scale-110"
                      >
                        <Heart
                          size={22}
                          className={
                            isWishlisted(car.id)
                              ? "fill-[#ff4054] text-[#ff4054]"
                              : "text-gray-500"
                          }
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleCompare(car.id)}
                        aria-label={
                          compareIds.includes(car.id) ? "Remove from compare" : "Add to compare"
                        }
                        className={`absolute right-4 top-16 z-20 rounded-full px-3 py-2 text-xs font-bold shadow-lg transition ${
                          compareIds.includes(car.id)
                            ? "bg-[#ff4054] text-white"
                            : "bg-white text-[#111] hover:scale-105"
                        }`}
                      >
                        {compareIds.includes(car.id) ? "✓ Compare" : "+ Compare"}
                      </button>

                      <img
                        src={car.image}
                        alt={car.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-110"
                      />

                    </div>

                    <div className="p-6">

                      <div className="flex items-start justify-between">

                        <div>

                          <h2 className="text-2xl font-black">
                            {car.name}
                          </h2>

                          <p className="mt-2 text-sm text-gray-500">
                            {car.tagline}
                          </p>

                        </div>

                        <span className="font-black text-[#ff4054]">
                          {car.price}
                        </span>

                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-4 border-y py-5">

                        <div>

                          <p className="font-bold">
                            {car.kilometers.toLocaleString()} km
                          </p>

                          <p className="text-xs uppercase text-gray-400">
                            Driven
                          </p>

                        </div>

                        <div>

                          <p className="font-bold">
                            {car.transmission}
                          </p>

                          <p className="text-xs uppercase text-gray-400">
                            Gearbox
                          </p>

                        </div>

                        <div>

                          <p className="font-bold">
                            {car.fuelType}
                          </p>

                          <p className="text-xs uppercase text-gray-400">
                            Fuel
                          </p>

                        </div>

                      </div>

                      <p className="mt-5 line-clamp-3 text-sm leading-7 text-gray-500">
                        {car.description}
                      </p>

                      <Link
                        to={`/cars/${car.id}`}
                        className="mt-7 flex w-full items-center justify-center rounded-xl bg-[#ff4054] py-4 font-bold text-white transition hover:bg-[#e6384b]"
                      >
                        View Details →
                      </Link>

                    </div>

                  </article>

                </Reveal>

              ))}

            </div>

            {/* =========================
        PAGINATION
    ========================== */}

            {totalPages > 1 && (

              <div className="mt-14 flex justify-center gap-3">

                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="rounded-xl border px-5 py-3 disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (

                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-11 w-11 rounded-full font-bold ${currentPage === i + 1
                      ? "bg-[#ff4054] text-white"
                      : "bg-white border"
                      }`}
                  >
                    {i + 1}
                  </button>

                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="rounded-xl bg-[#111] px-5 py-3 text-white disabled:opacity-40"
                >
                  Next
                </button>

              </div>

            )}

          </>

        )}

      </div>

      {compareLimitNotice && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#111] px-5 py-3 text-sm font-semibold text-white shadow-lg">
          You can compare up to {MAX_COMPARE} cars at a time
        </div>
      )}

      <CompareBar />

    </main>
  );

};

export default BuyCars;  