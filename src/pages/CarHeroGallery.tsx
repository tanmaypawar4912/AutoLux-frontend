import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import type { Car } from "../types";
import { getWishlist, toggleWishlist } from "../utils/storage";

interface CarHeroGalleryProps {
  car: Car;
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill={filled ? "#ff4054" : "none"}
    stroke={filled ? "#ff4054" : "currentColor"}
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21s-7.5-4.9-10-9.3C.4 8.1 2 4.5 5.6 4c2-.3 3.9.6 5 2.2.9-1.6 2.9-2.5 4.9-2.2C19 4.5 20.6 8.1 19 11.7 16.5 16.1 12 21 12 21z"
    />
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.7 10.7L15.3 7.3M8.7 13.3l6.6 3.4" />
    <circle cx="6" cy="12" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="18" cy="6" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="18" cy="18" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronIcon = ({ direction }: { direction: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"}
    />
  </svg>
);

const CarHeroGallery = ({ car }: CarHeroGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const galleryImages = useMemo<string[]>(() => {
    const images = car.image
      .split(",")
      .map((src) => src.trim())
      .filter(Boolean);

    while (images.length < 4) {
      images.push(
        `https://placehold.co/700x500?text=${encodeURIComponent(car.model)}+${images.length + 1}`
      );
    }

    return images;
  }, [car]);

  useEffect(() => {
    setWishlist(getWishlist().map((item) => item._id));
  }, []);

  useEffect(() => {
    if (currentImageIndex >= galleryImages.length) {
      setCurrentImageIndex(0);
    }
  }, [currentImageIndex, galleryImages.length]);

  const isWishlistedCar = wishlist.includes(car._id);

  const handleWishlistToggle = () => {
    toggleWishlist({
      _id: car._id,
      brand: car.brand,
      model: car.model,
      image: car.image,
      price: car.price,
    });

    setWishlist(getWishlist().map((item) => item._id));
  };

  const handleShare = async () => {
    const shareData = {
      title: `${car.brand} ${car.model}`,
      text: `Check out this car: ${car.brand} ${car.model} priced at ₹${Number(
        car.price
      ).toLocaleString("en-IN")}.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("Shared successfully!");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus("Link copied to clipboard.");
      } else {
        window.prompt("Copy this link", window.location.href);
        setShareStatus("Copy the URL to share.");
      }
    } catch (error) {
      console.error(error);
      setShareStatus("Unable to share at this time.");
    }

    window.setTimeout(() => setShareStatus(null), 3000);
  };

  const showPrev = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));

  const showNext = () =>
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));

  return (
    <Reveal>
      <div className="space-y-4">
        <Link
          to="/cars"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#ff4054] lg:hidden"
        >
          ← Back to Collection
        </Link>

        <div className="group relative overflow-hidden rounded-3xl bg-[#eeeeee]">
          <img
            src={galleryImages[currentImageIndex]}
            alt={`${car.brand} ${car.model}`}
            className="h-[360px] w-full object-cover transition duration-700 sm:h-[440px] lg:h-[520px]"
          />

          {/* top-right overlay actions */}
          <div className="absolute right-4 top-4 flex gap-2">
            <button
              type="button"
              onClick={handleWishlistToggle}
              aria-label={isWishlistedCar ? "Remove from wishlist" : "Add to wishlist"}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#111] shadow-md backdrop-blur transition hover:scale-105"
            >
              <HeartIcon filled={isWishlistedCar} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share this car"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#111] shadow-md backdrop-blur transition hover:scale-105"
            >
              <ShareIcon />
            </button>
          </div>

          {/* image counter */}
          <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white">
            {currentImageIndex + 1} / {galleryImages.length}
          </div>

          {/* prev/next arrows */}
          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPrev}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#111] opacity-0 shadow-md transition group-hover:opacity-100"
              >
                <ChevronIcon direction="left" />
              </button>
              <button
                type="button"
                onClick={showNext}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#111] opacity-0 shadow-md transition group-hover:opacity-100"
              >
                <ChevronIcon direction="right" />
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-4 gap-3">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`View photo ${index + 1}`}
              className={`overflow-hidden rounded-2xl border p-1 transition ${
                currentImageIndex === index
                  ? "border-[#ff4054] ring-1 ring-[#ff4054]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="h-16 w-full rounded-xl object-cover sm:h-20 lg:h-24"
              />
            </button>
          ))}
        </div>

        {shareStatus && (
          <p className="text-sm font-medium text-[#111]">{shareStatus}</p>
        )}
      </div>
    </Reveal>
  );
};

export default CarHeroGallery;
