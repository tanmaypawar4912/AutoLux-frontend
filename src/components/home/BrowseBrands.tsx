import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../../utils/api";

interface Car {
  _id: string;
  brand: string;
  status: string;
}

const BrowseBrands = () => {
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(`${API}/cars`);
        const data = await res.json();

        if (data.success) {
          const uniqueBrands = Array.from(
            new Set(
              data.cars
                .filter((car: Car) => car.status === "approved")
                .map((car: Car) => car.brand)
            )
          ) as string[];

          setBrands(uniqueBrands);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchBrands();
  }, []);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-4xl font-black text-center">
          Browse By Brand
        </h2>

        <p className="mt-4 text-center text-gray-500">
          Explore premium cars by your favourite brand.
        </p>

        <div className="mt-14 flex flex-wrap justify-center gap-5">

          {brands.map((brand) => (

            <Link
              key={brand}
              to={`/cars?brand=${brand}`}
              className="
                rounded-2xl
                border
               border-[#ff4054]
                bg-white
                px-8
                py-5
                font-bold
                shadow-sm
                transition
                hover:-translate-y-1
                hover:border-[#ff4054]
                hover:text-[#ff4054]
                hover:shadow-lg
              "
            >
              {brand}
            </Link>

          ))}

        </div>

      </div>
    </section>
  );
};

export default BrowseBrands;