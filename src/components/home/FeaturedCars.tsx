import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../../utils/api";
import Reveal from "../Reveal";

interface Car {
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
  image: string;
  status: string;
}

const FeaturedCars = () => {

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchCars = async () => {

      try {

        const response = await fetch(`${API}/cars`);

        const data = await response.json();

        if (data.success) {

          const featured = data.cars
            .filter((car: Car) => car.status === "approved")
            .slice(0, 6);

          setCars(featured);

        }

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    fetchCars();

  }, []);

  return (

    <section className="relative overflow-hidden bg-[#f8f8f8] px-6 py-28">

      {/* Background */}

      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#ff4054]/5 blur-3xl" />

      <div className="pointer-events-none absolute -left-40 bottom-0 h-72 w-72 rounded-full bg-[#ff4054]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Header */}

        <Reveal>

          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ff4054]">
                Our Collection
              </p>

              <h2 className="mt-4 text-4xl font-black text-[#111] md:text-6xl">
                Featured Cars
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                {cars.length} Premium Cars Available
              </p>

              <p className="mt-5 max-w-xl text-gray-500">
                Explore our latest approved premium cars directly from verified sellers.
              </p>

            </div>

            <Link
              to="/cars"
              className="group inline-flex items-center gap-3 font-bold text-[#111] transition hover:text-[#ff4054]"
            >
              View All Cars

              <span className="transition group-hover:translate-x-2">
                →
              </span>

            </Link>

          </div>

        </Reveal>

        {/* Loading */}

        {loading ? (

          <div className="py-24 text-center">

            <div className="text-6xl animate-bounce">
              🚗
            </div>

            <h2 className="mt-6 text-3xl font-black">
              Loading Cars...
            </h2>

          </div>

        ) : cars.length === 0 ? (
          <div className="py-20 text-center">

            <h2 className="text-4xl font-black">
              No Approved Cars Available
            </h2>

            <p className="mt-4 text-gray-500">
              Please check again later.
            </p>

          </div>
        ) : (

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car, index) => (

              <Reveal
                key={car._id}
                className={
                  index === 0
                    ? "delay-100"
                    : index === 1
                      ? "delay-200"
                      : "delay-300"
                }
              >

                <div
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-black/5
                    bg-white
                    shadow-sm
                    transition
                    duration-500
                    hover:-translate-y-3
                    hover:shadow-2xl
                  "
                >

                  {/* IMAGE */}

                  <div
                    className="
                      relative
                      flex
                      h-64
                      items-center
                      justify-center
                      overflow-hidden
                      bg-[#f1f1f1]
                    "
                  >

                    <div
                      className="
                        absolute
                        h-48
                        w-48
                        rounded-full
                        bg-[#ff4054]/10
                        blur-3xl
                        transition
                        duration-700
                        group-hover:scale-150
                      "
                    />

                    <img
                      src={car.image || "/images/audi-a6.png"}
                      alt={car.model}
                      className="
                        relative
                        z-10
                        w-[90%]
                        object-contain
                        transition
                        duration-700
                        group-hover:scale-110
                        group-hover:-rotate-2
                      "
                    />

                    <span
                      className="
                        absolute
                        left-5
                        top-5
                        rounded-full
                        bg-white/80
                        px-4
                        py-2
                        text-xs
                        font-bold
                        uppercase
                        tracking-widest
                        backdrop-blur
                      "
                    >
                      {car.brand}
                    </span>

                  </div>

                  {/* CONTENT */}

                  <div className="p-7">

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h3 className="text-2xl font-black text-[#111]">
                          {car.model}
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                          {car.year} • {car.fuelType} • {car.transmission}
                        </p>

                      </div>

                      <span className="text-sm font-black text-[#ff4054] whitespace-nowrap">
                        ₹{Number(car.price).toLocaleString("en-IN")}
                      </span>

                    </div>

                    {/* SPECS */}

                    <div
                      className="
                        mt-6
                        grid
                        grid-cols-3
                        gap-3
                        border-y
                        border-black/5
                        py-5
                      "
                    >

                      <div>

                        <p className="text-sm font-black">
                          {Number(car.kilometers).toLocaleString()} km
                        </p>

                        <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-400">
                          Driven
                        </p>

                      </div>

                      <div>

                        <p className="text-sm font-black">
                          {car.transmission}
                        </p>

                        <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-400">
                          Gearbox
                        </p>

                      </div>

                      <div>

                        <p className="text-sm font-black">
                          {car.fuelType}
                        </p>

                        <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-400">
                          Fuel
                        </p>

                      </div>

                    </div>

                    <p className="mt-5 line-clamp-3 text-sm leading-7 text-gray-500">
                      {car.description}
                    </p>

                    {/* BUTTON */}

                    <Link
                      to={`/cars/${car._id}`}
                      className="
                        mt-7
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[#111]
                        py-4
                        font-bold
                        text-white
                        transition
                        duration-300
                        hover:bg-[#ff4054]
                      "
                    >
                      View Details

                      <span className="transition group-hover:translate-x-1">
                        →
                      </span>

                    </Link>

                  </div>

                </div>

              </Reveal>

            ))}

          </div>

        )}

      </div>

    </section>

  );

};

export default FeaturedCars;