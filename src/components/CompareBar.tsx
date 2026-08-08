import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCompareList, removeFromCompare, clearCompare, COMPARE_EVENT } from "../utils/compare";
import { API } from "../utils/api";

const CARS_API = `${API}/cars`;

interface MiniCar {
  _id: string;
  brand: string;
  model: string;
  image: string;
}


const CompareBar = () => {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [cars, setCars] = useState<MiniCar[]>([]);

  useEffect(() => {
    const sync = () => setCompareIds(getCompareList());
    sync();

    window.addEventListener(COMPARE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(COMPARE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      if (compareIds.length === 0) {
        setCars([]);
        return;
      }
      try {
        const response = await fetch(CARS_API);
        const data = await response.json();
        if (data.success) {
          setCars(data.cars.filter((car: MiniCar) => compareIds.includes(car._id)));
        }
      } catch (error) {
        console.error("Failed to load compare cars", error);
      }
    };
    fetchCars();
  }, [compareIds]);

  if (compareIds.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {cars.map((car) => (
              <div
                key={car._id}
                className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow"
              >
                <img
                  src={car.image.split(",")[0]?.trim()}
                  alt={car.model}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCompareIds(removeFromCompare(car._id))}
                  aria-label={`Remove ${car.model} from compare`}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#111] text-[9px] font-bold text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-500">
            {compareIds.length}/3 cars selected
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              clearCompare();
              setCompareIds([]);
            }}
            className="text-sm font-semibold text-gray-400 hover:text-[#111]"
          >
            Clear all
          </button>
          <Link
            to="/compare"
            className={`rounded-full px-6 py-3 text-sm font-bold text-white transition ${
              compareIds.length >= 2
                ? "bg-[#ff4054] hover:bg-[#e63b4d]"
                : "pointer-events-none bg-gray-300"
            }`}
          >
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
