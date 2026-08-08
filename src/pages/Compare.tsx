import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCompareList, removeFromCompare } from "../utils/compare";
import { API } from "../utils/api";

const CARS_API = `${API}/cars`;

interface Car {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  kilometers: number;
  fuelType: string;
  transmission: string;
  description: string;
  image: string;
}


const specRows: { label: string; render: (car: Car) => string }[] = [
  { label: "Price", render: (car) => `₹${Number(car.price).toLocaleString("en-IN")}` },
  { label: "Year", render: (car) => `${car.year}` },
  { label: "Kilometers", render: (car) => `${Number(car.kilometers).toLocaleString()} km` },
  { label: "Fuel Type", render: (car) => car.fuelType },
  { label: "Transmission", render: (car) => car.transmission },
];

const Compare = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCars = async () => {
    const ids = getCompareList();
    if (ids.length === 0) {
      setCars([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(CARS_API);
      const data = await response.json();
      if (data.success) {
        const matched = data.cars.filter((car: Car) => ids.includes(car._id));
        // preserve the order the user picked them in
        setCars(ids.map((id) => matched.find((car: Car) => car._id === id)).filter(Boolean));
      }
    } catch (error) {
      console.error("Failed to load cars for comparison", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = (id: string) => {
    removeFromCompare(id);
    setCars((prev) => prev.filter((car) => car._id !== id));
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
        <div className="text-center">
          <div className="text-6xl">⚖️</div>
          <h2 className="mt-6 text-4xl font-black text-[#111]">Loading Comparison...</h2>
        </div>
      </main>
    );
  }

  if (cars.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f8f8] px-6">
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
          <div className="text-5xl">⚖️</div>
          <h2 className="mt-4 text-2xl font-bold text-[#111]">Nothing to compare yet</h2>
          <p className="mt-2 text-gray-500">
            Pick 2 or 3 cars from the listings page using "+ Compare" to see them side by side.
          </p>
          <Link
            to="/cars"
            className="mt-6 inline-block rounded-xl bg-[#ff4054] px-7 py-4 font-bold text-white transition hover:bg-[#e63b4d]"
          >
            Browse Cars →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-6 pb-24 pt-36">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ff4054]">
          Side by side
        </p>
        <h1 className="mt-3 text-4xl font-black text-[#111]">Compare Cars</h1>

        <div className="mt-10 overflow-x-auto rounded-3xl bg-white shadow-sm">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className="w-40 p-6 text-left text-sm text-gray-400"> </th>
                {cars.map((car) => (
                  <th key={car._id} className="p-6 text-left align-top">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => handleRemove(car._id)}
                        aria-label={`Remove ${car.model} from comparison`}
                        className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-200"
                      >
                        ×
                      </button>
                      <img
                        src={car.image.split(",")[0]?.trim()}
                        alt={car.model}
                        className="h-32 w-full rounded-2xl object-cover"
                      />
                      <p className="mt-3 text-xs font-bold uppercase tracking-widest text-[#ff4054]">
                        {car.brand}
                      </p>
                      <p className="text-lg font-black text-[#111]">{car.model}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specRows.map((row) => (
                <tr key={row.label} className="border-t border-gray-100">
                  <td className="p-6 text-sm font-semibold text-gray-400">{row.label}</td>
                  {cars.map((car) => (
                    <td key={car._id} className="p-6 font-bold text-[#111]">
                      {row.render(car)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-gray-100">
                <td className="p-6 text-sm font-semibold text-gray-400">Description</td>
                {cars.map((car) => (
                  <td key={car._id} className="p-6 text-sm text-gray-500">
                    {car.description}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-100">
                <td className="p-6"> </td>
                {cars.map((car) => (
                  <td key={car._id} className="p-6">
                    <Link
                      to={`/cars/${car._id}`}
                      className="inline-block rounded-full bg-[#ff4054] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e63b4d]"
                    >
                      View Details →
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Compare;
