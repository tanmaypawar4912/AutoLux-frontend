import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecentlyViewed } from "../utils/recentlyViewed";
import { API } from "../utils/api";

const CARS_API = `${API}/cars`;

interface Car {
  _id: string;
  brand: string;
  model: string;
  price: number;
  image: string;
}


const RecentlyViewed = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      const ids = getRecentlyViewed();
      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(CARS_API);
        const data = await response.json();
        if (data.success) {
          const matched = ids
            .map((id) => data.cars.find((car: Car) => car._id === id))
            .filter(Boolean);
          setCars(matched);
        }
      } catch (error) {
        console.error("Failed to load recently viewed cars", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  if (loading || cars.length === 0) return null;

  return (
    <section className="bg-[#f8f8f8] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ff4054]">
          Pick up where you left off
        </p>
        <h2 className="mt-3 text-3xl font-black text-[#111]">Recently Viewed</h2>

        <div className="mt-8 flex gap-5 overflow-x-auto pb-4">
          {cars.map((car) => (
            <Link
              key={car._id}
              to={`/cars/${car._id}`}
              className="group w-64 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-36 overflow-hidden bg-gray-100">
                <img
                  src={car.image.split(",")[0]?.trim()}
                  alt={car.model}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-widest text-gray-400">{car.brand}</p>
                <h3 className="mt-1 font-black text-[#111]">{car.model}</h3>
                <p className="mt-2 font-bold text-[#ff4054]">
                  ₹{Number(car.price).toLocaleString("en-IN")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
