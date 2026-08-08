import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import type { Car } from "../types";

interface CarSimilarCarsProps {
  relatedCars: Car[];
}

const CarSimilarCars = ({ relatedCars }: CarSimilarCarsProps) => {
  if (relatedCars.length === 0) return null;

  return (
    <Reveal>
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ff4054]">
              Related Cars
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#111]">You may also like</h2>
          </div>
          <Link
            to="/cars"
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold transition hover:border-[#ff4054]"
          >
            View all cars
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {relatedCars.map((related) => (
            <Link
              key={related._id}
              to={`/cars/${related._id}`}
              className="group overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-56 overflow-hidden bg-[#f4f4f4]">
                <img
                  src={related.image.split(",")[0]?.trim() || "https://placehold.co/700x500?text=Car+Image"}
                  alt={related.model}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-gray-400">{related.brand}</p>
                <h3 className="mt-2 text-xl font-black text-[#111]">{related.model}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-lg font-bold text-[#ff4054]">
                    ₹{Number(related.price).toLocaleString("en-IN")}
                  </p>
                  <span className="text-sm font-semibold text-gray-400 transition group-hover:text-[#ff4054]">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Reveal>
  );
};

export default CarSimilarCars;
