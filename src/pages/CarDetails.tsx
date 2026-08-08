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

const CarDetails = () => {
  const { id } = useParams();

  const [car, setCar] = useState<Car | null>(null);
  const [relatedCars, setRelatedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);

      try {
        const carResponse = await fetch(`${CARS_API}/${id}`);
        const carData = (await carResponse.json()) as { success: boolean; car: Car };

        if (carData.success) {
          setCar(carData.car);

          // track for "Recently Viewed" and bump the listing's view counter
          addRecentlyViewed(carData.car._id);
          fetch(`${CARS_API}/${carData.car._id}/view`, { method: "PATCH" }).catch(() => {
            // non-critical — don't block the page if this fails
          });
        }

        const listResponse = await fetch(CARS_API);
        const listData = (await listResponse.json()) as { success: boolean; cars: Car[] };

        if (listData.success) {
          const approvedCars = listData.cars.filter((item) => item.status === "approved");
          const currentId = id || "";

          const sameBrand = approvedCars.filter(
            (item) => item._id !== currentId && item.brand === carData.car.brand
          );

          const fallback = approvedCars.filter((item: Car) => item._id !== currentId);

          setRelatedCars([
            ...sameBrand.slice(0, 3),
            ...fallback
              .filter((item) => !sameBrand.some((same) => same._id === item._id))
              .slice(0, Math.max(0, 3 - sameBrand.length)),
          ]);
        }
      } catch (error) {
        console.error("Car fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
        <div className="text-center">
          <div className="text-6xl">🚗</div>
          <h2 className="mt-6 text-4xl font-black text-[#111]">Loading Car...</h2>
        </div>
      </main>
    );
  }

  if (!car) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
        <div className="text-center">
          <div className="text-6xl">🚗</div>
          <h2 className="mt-6 text-4xl font-black">Car Not Found</h2>
          <Link
            to="/cars"
            className="mt-8 inline-block rounded-xl bg-[#ff4054] px-7 py-4 font-bold text-white"
          >
            Browse Cars →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-6 pb-28 pt-36 lg:pb-24">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/cars"
          className="hidden items-center gap-2 font-semibold text-gray-500 transition hover:text-[#ff4054] lg:inline-flex"
        >
          ← Back to Collection
        </Link>

        {/* Hero/Gallery + Specs/Price */}
        <div className="mt-6 grid gap-12 lg:grid-cols-2 lg:items-start">
          <CarHeroGallery car={car} />
          <CarSpecsPrice car={car} onBookTestDrive={() => setShowBookingModal(true)} />
        </div>

        {/* Seller card + Enquiry + About/Features */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:items-start">
          <div className="space-y-8 lg:col-span-1">
            <CarSellerCard car={car} />
            <CarEnquiryWidget car={car} />
          </div>
          <div className="lg:col-span-2">
            <CarAboutFeatures car={car} />
          </div>
        </div>

        {/* EMI Calculator */}
        <div className="mt-12">
          <CarEmiCalculator car={car} />
        </div>

        {/* Reviews & Ratings */}
        <div className="mt-12">
          <CarReviews car={car} />
        </div>

        {/* Similar Cars */}
        <div className="mt-16">
          <CarSimilarCars relatedCars={relatedCars} />
        </div>

        <div className="mt-16 rounded-[2.5rem] bg-[#111] px-8 py-12 text-center text-white shadow-2xl sm:px-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[#ff4054]">Ready for your next drive?</p>
          <h2 className="mt-4 text-4xl font-black">Reserve this car with just one click.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#d4d4d4]">
            Book a test drive or contact the seller directly to secure this vehicle before it's gone.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => setShowBookingModal(true)}
              className="rounded-full bg-[#ff4054] px-8 py-4 text-base font-bold transition hover:bg-[#e63b4d]"
            >
              Book Test Drive
            </button>
            <Link
              to="/contact"
              className="rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-bold transition hover:bg-white/20"
            >
              Contact Seller
            </Link>
          </div>
        </div>

        {showBookingModal && (
          <BookingModal
            car={{
              _id: car._id,
              brand: car.brand,
              model: car.model,
              image: car.image,
              sellerEmail: car.sellerEmail || "",
            }}
            onClose={() => setShowBookingModal(false)}
          />
        )}
      </div>

      <StickyActionBar car={car} onBookTestDrive={() => setShowBookingModal(true)} />
    </main>
  );
};

export default CarDetails;
