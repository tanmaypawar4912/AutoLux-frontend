import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import BookingModal from "../components/BookingModal";
import type { Car } from "../types";
import { API } from "../utils/api";
import { addRecentlyViewed } from "../utils/recentlyViewed";

import CarHeroGallery from "./CarHeroGallery";
import CarSpecsPrice from "./CarSpecsPrice";
import CarSellerCard from "./CarSellerCard";
import CarAboutFeatures from "./CarAboutFeatures";
import CarEmiCalculator from "./CarEmiCalculator";
import CarReviews from "./CarReviews";
import CarEnquiryWidget from "./CarEnquiryWidget";
import CarSimilarCars from "./CarSimilarCars";
import StickyActionBar from "./StickyActionBar";

const CARS_API = `${API}/cars`;

// =====================================================
// CAR DETAILS
// MongoDB is the single source of truth.
// No static/fallback car data.
// =====================================================

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [car, setCar] = useState<Car | null>(null);
  const [relatedCars, setRelatedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] =
    useState(false);

  // =====================================================
  // ALWAYS START PAGE FROM TOP
  // =====================================================

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [id]);

  // =====================================================
  // FETCH CAR DETAILS + SIMILAR CARS
  // =====================================================

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!id) {
        setCar(null);
        setRelatedCars([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setCar(null);
      setRelatedCars([]);

      try {
        // =================================================
        // 1. GET CURRENT CAR FROM MONGODB
        // =================================================

        const carResponse = await fetch(
          `${CARS_API}/${id}`
        );

        if (!carResponse.ok) {
          throw new Error(
            `Failed to fetch car: ${carResponse.status}`
          );
        }

        const carData = (await carResponse.json()) as {
          success: boolean;
          car?: Car;
        };

        if (!carData.success || !carData.car) {
          setCar(null);
          return;
        }

        const currentCar = carData.car;

        // =================================================
        // 2. ONLY APPROVED CAR SHOULD BE DISPLAYED
        // =================================================

        if (
          currentCar.status &&
          currentCar.status !== "approved"
        ) {
          setCar(null);
          return;
        }

        setCar(currentCar);

        // =================================================
        // 3. RECENTLY VIEWED
        // =================================================

        if (currentCar._id) {
          addRecentlyViewed(currentCar._id);
        }

        // =================================================
        // 4. INCREMENT VIEW COUNT
        // Non-critical request
        // =================================================

        if (currentCar._id) {
          fetch(
            `${CARS_API}/${currentCar._id}/view`,
            {
              method: "PATCH",
            }
          ).catch(() => {
            // View counter failure should not
            // break the details page.
          });
        }

        // =================================================
        // 5. GET ALL APPROVED CARS FROM MONGODB
        // =================================================

        const listResponse = await fetch(
          CARS_API
        );

        if (!listResponse.ok) {
          return;
        }

        const listData = (await listResponse.json()) as {
          success: boolean;
          cars?: Car[];
        };

        if (
          !listData.success ||
          !Array.isArray(listData.cars)
        ) {
          return;
        }

        // =================================================
        // 6. ONLY APPROVED + EXCLUDE CURRENT CAR
        // =================================================

        const approvedCars =
          listData.cars.filter(
            (item) =>
              item.status === "approved" &&
              item._id !== currentCar._id
          );

        // =================================================
        // NORMALIZED VALUES
        // =================================================

        const currentBrand =
          currentCar.brand
            ?.trim()
            .toLowerCase() || "";

        const currentCategory =
          currentCar.carCategory
            ?.trim()
            .toLowerCase() || "";

        const currentBodyType =
          currentCar.bodyType
            ?.trim()
            .toLowerCase() || "";

        const currentFuelType =
          currentCar.fuelType
            ?.trim()
            .toLowerCase() || "";

        const currentTransmission =
          currentCar.transmission
            ?.trim()
            .toLowerCase() || "";

        // =================================================
        // 7. SAME BRAND
        // Highest priority
        // =================================================

        const sameBrand =
          approvedCars.filter(
            (item) =>
              item.brand
                ?.trim()
                .toLowerCase() ===
              currentBrand
          );

        // =================================================
        // 8. SAME CATEGORY
        // Example:
        // SUV -> SUV
        // Sedan -> Sedan
        // =================================================

        const sameCategory =
          approvedCars.filter(
            (item) =>
              item.carCategory
                ?.trim()
                .toLowerCase() ===
                currentCategory &&
              !sameBrand.some(
                (carItem) =>
                  carItem._id === item._id
              )
          );

        // =================================================
        // 9. SAME BODY TYPE
        // =================================================

        const sameBodyType =
          approvedCars.filter(
            (item) =>
              item.bodyType
                ?.trim()
                .toLowerCase() ===
                currentBodyType &&
              !sameBrand.some(
                (carItem) =>
                  carItem._id === item._id
              ) &&
              !sameCategory.some(
                (carItem) =>
                  carItem._id === item._id
              )
          );

        // =================================================
        // 10. SAME FUEL TYPE
        // =================================================

        const sameFuelType =
          approvedCars.filter(
            (item) =>
              item.fuelType
                ?.trim()
                .toLowerCase() ===
                currentFuelType &&
              !sameBrand.some(
                (carItem) =>
                  carItem._id === item._id
              ) &&
              !sameCategory.some(
                (carItem) =>
                  carItem._id === item._id
              ) &&
              !sameBodyType.some(
                (carItem) =>
                  carItem._id === item._id
              )
          );

        // =================================================
        // 11. SAME TRANSMISSION
        // =================================================

        const sameTransmission =
          approvedCars.filter(
            (item) =>
              item.transmission
                ?.trim()
                .toLowerCase() ===
                currentTransmission &&
              !sameBrand.some(
                (carItem) =>
                  carItem._id === item._id
              ) &&
              !sameCategory.some(
                (carItem) =>
                  carItem._id === item._id
              ) &&
              !sameBodyType.some(
                (carItem) =>
                  carItem._id === item._id
              ) &&
              !sameFuelType.some(
                (carItem) =>
                  carItem._id === item._id
              )
          );

        // =================================================
        // 12. FINAL FALLBACK
        // Any other approved cars
        // =================================================

        const fallbackCars =
          approvedCars.filter(
            (item) =>
              !sameBrand.some(
                (carItem) =>
                  carItem._id === item._id
              ) &&
              !sameCategory.some(
                (carItem) =>
                  carItem._id === item._id
              ) &&
              !sameBodyType.some(
                (carItem) =>
                  carItem._id === item._id
              ) &&
              !sameFuelType.some(
                (carItem) =>
                  carItem._id === item._id
              ) &&
              !sameTransmission.some(
                (carItem) =>
                  carItem._id === item._id
              )
          );

        // =================================================
        // 13. BUILD SIMILAR CARS
        // MAX 6
        // =================================================

        const combinedCars = [
          ...sameBrand,
          ...sameCategory,
          ...sameBodyType,
          ...sameFuelType,
          ...sameTransmission,
          ...fallbackCars,
        ];

        // =================================================
        // REMOVE DUPLICATES
        // =================================================

        const uniqueCars: Car[] = [];

        const seenIds = new Set<string>();

        for (const item of combinedCars) {
          if (
            item._id &&
            !seenIds.has(item._id)
          ) {
            seenIds.add(item._id);
            uniqueCars.push(item);
          }

          if (uniqueCars.length >= 6) {
            break;
          }
        }

        setRelatedCars(uniqueCars);
      } catch (error) {
        console.error(
          "Car Details Fetch Error:",
          error
        );

        setCar(null);
        setRelatedCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f8] px-6 pt-28">
        <div className="text-center">
          <div className="text-6xl">
            🚗
          </div>

          <h2 className="mt-6 text-3xl font-black text-[#111] sm:text-4xl">
            Loading Car...
          </h2>

          <p className="mt-3 text-gray-500">
            Please wait while we load the
            vehicle details.
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // CAR NOT FOUND
  // =====================================================

  if (!car) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f8] px-6 pt-28">
        <div className="text-center">
          <div className="text-6xl">
            🚗
          </div>

          <h2 className="mt-6 text-3xl font-black text-[#111] sm:text-4xl">
            Car Not Found
          </h2>

          <p className="mt-3 text-gray-500">
            This vehicle may have been removed
            or is no longer available.
          </p>

          <Link
            to="/cars"
            className="mt-8 inline-flex rounded-xl bg-[#ff4054] px-7 py-4 font-bold text-white transition hover:bg-[#e63b4d]"
          >
            Browse Cars →
          </Link>
        </div>
      </main>
    );
  }

  // =====================================================
  // MAIN CAR DETAILS PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 pb-32 pt-28 sm:px-6 lg:pb-28 lg:pt-32">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            BACK TO COLLECTION
        ================================================= */}

        <Link
          to="/cars"
          className="mb-5 hidden items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#ff4054] lg:inline-flex"
        >
          ← Back to Collection
        </Link>

        {/* =================================================
            HERO SECTION
        ================================================= */}

        <section className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">

          {/* =================================================
              IMAGE GALLERY
          ================================================= */}

          <div className="min-w-0">
            <CarHeroGallery car={car} />
          </div>

          {/* =================================================
              PRICE / SPECS
          ================================================= */}

          <div className="min-w-0">
            <CarSpecsPrice
              car={car}
              onBookTestDrive={() =>
                setShowBookingModal(true)
              }
            />
          </div>
        </section>

        {/* =================================================
            SELLER + ENQUIRY + ABOUT
        ================================================= */}

        <section className="mt-10 grid gap-8 lg:grid-cols-3 lg:items-start">

          <div className="space-y-8 lg:col-span-1">
            <CarSellerCard car={car} />

            <CarEnquiryWidget car={car} />
          </div>

          <div className="lg:col-span-2">
            <CarAboutFeatures car={car} />
          </div>
        </section>

        {/* =================================================
            EMI CALCULATOR
        ================================================= */}

        <section className="mt-10">
          <CarEmiCalculator car={car} />
        </section>

        {/* =================================================
            REVIEWS
        ================================================= */}

        <section className="mt-10">
          <CarReviews car={car} />
        </section>

        {/* =================================================
            SIMILAR CARS
        ================================================= */}

        {relatedCars.length > 0 && (
          <section className="mt-14">
            <CarSimilarCars
              relatedCars={relatedCars}
            />
          </section>
        )}

        {/* =================================================
            FINAL CTA
        ================================================= */}

        <section className="mt-14 rounded-[2rem] bg-[#111] px-6 py-10 text-center text-white shadow-2xl sm:px-10 sm:py-12">

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ff4054] sm:text-sm">
            Ready for your next drive?
          </p>

          <h2 className="mt-4 text-3xl font-black sm:text-4xl">
            Reserve this car with just one click.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#d4d4d4] sm:text-base">
            Book a test drive or contact the
            seller directly to secure this
            vehicle before it's gone.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">

            <button
              type="button"
              onClick={() =>
                setShowBookingModal(true)
              }
              className="rounded-full bg-[#ff4054] px-8 py-4 text-sm font-bold transition hover:bg-[#e63b4d] sm:text-base"
            >
              Book Test Drive
            </button>

            <Link
              to="/contact"
              className="rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-bold transition hover:bg-white/20 sm:text-base"
            >
              Contact Seller
            </Link>

          </div>
        </section>

        {/* =================================================
            BOOKING MODAL
        ================================================= */}

        {showBookingModal && (
          <BookingModal
            car={{
              _id: car._id,
              brand: car.brand,
              model: car.model,
              image: car.image,
              sellerEmail:
                car.sellerEmail || "",
            }}
            onClose={() =>
              setShowBookingModal(false)
            }
          />
        )}
      </div>

      {/* =================================================
          STICKY ACTION BAR
      ================================================= */}

      <StickyActionBar
        car={car}
        onBookTestDrive={() =>
          setShowBookingModal(true)
        }
      />
    </main>
  );
};

export default CarDetails;