import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cars } from "../../data/cars";

const Hero = () => {
  const [activeCar, setActiveCar] = useState(0);

  const car = cars[activeCar];

  // =============================
  // AUTO SLIDER
  // =============================

  useEffect(() => {
    const slider = setInterval(() => {
      setActiveCar((current) => (current + 1) % cars.length);
    }, 5000);

    return () => clearInterval(slider);
  }, []);

  return (
    <section
      className="
        relative
        min-h-[100vh]
        w-full
        overflow-hidden
        bg-black
        text-white
      "
    >
      {/* =================================
          FIXED FULL PAGE BACKGROUND CAR IMAGE
      ================================= */}

      <div className="pointer-events-none fixed inset-0 z-0">
        {cars.map((item, index) => (
          <img
            key={item.id}
            src={item.image}
            alt={item.name}
            className={`
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-center
              transition-all
              duration-[1500ms]
              ease-in-out
              ${
                activeCar === index
                  ? "scale-100 opacity-100"
                  : "scale-105 opacity-0"
              }
            `}
            style={{
              filter:
                activeCar === index
                  ? "brightness(1.3) contrast(1.08) saturate(1.15)"
                  : "brightness(1)",
            }}
          />
        ))}
      </div>

      {/* =================================
          PREMIUM DARK OVERLAY
      ================================= */}

      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/20" />

      {/* LEFT GRADIENT FOR TEXT */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[1]
          bg-gradient-to-r
          from-black/80
          via-black/35
          to-transparent
        "
      />

      {/* BOTTOM GRADIENT */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-[1]
          h-80
          bg-gradient-to-t
          from-black
          via-black/45
          to-transparent
        "
      />

      {/* TOP GRADIENT
          Navbar area blends with hero
      */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          z-[1]
          h-40
          bg-gradient-to-b
          from-black/60
          via-black/20
          to-transparent
        "
      />

      {/* =================================
          RED PREMIUM GLOW
      ================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-1/3
          z-[1]
          h-96
          w-96
          rounded-full
          bg-[#ff4054]/15
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          top-1/4
          z-[1]
          h-80
          w-80
          rounded-full
          bg-[#ff4054]/10
          blur-[120px]
        "
      />

      {/* =================================
          MAIN CONTENT
      ================================= */}

      <div
        className="
          relative
          z-10
          flex
          min-h-[115vh]
          w-full
          items-end
        "
      >
        <div
          className="
            w-full
            px-6
            pb-20
            sm:px-10
            sm:pb-24
            lg:px-16
            lg:pb-50
            xl:px-24
            2xl:px-32
          "
        >
          <div className="max-w-3xl">

            {/* SMALL TITLE */}

            <p
              className="
                mb-5
                text-xs
                font-bold
                uppercase
                tracking-[0.35em]
                text-[#ff4054]
                sm:text-sm
              "
            >
              Premium Automotive Experience
            </p>

            {/* MAIN TITLE */}

            <h1
              className="
                text-5xl
                font-black
                leading-[0.92]
                tracking-tight
                sm:text-6xl
                md:text-7xl
                lg:text-8xl
                xl:text-9xl
              "
            >
              Drive Your{" "}
              <span className="text-[#ff4054]">
                Dream.
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mt-6
                max-w-xl
                text-sm
                leading-7
                text-gray-100
                sm:text-base
                lg:text-lg
                lg:leading-8
              "
            >
              Discover a curated collection of premium
              vehicles selected for those who expect more
              from every drive.
            </p>

            {/* =================================
                BUTTONS
            ================================= */}

            <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">

              <Link
                to="/cars"
                className="
                  rounded-xl
                  bg-[#ff4054]
                  px-6
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  shadow-xl
                  shadow-[#ff4054]/30
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[#e9364a]
                  hover:shadow-[#ff4054]/50
                  sm:px-7
                  sm:py-4
                "
              >
                Explore Collection →
              </Link>

              <Link
                to="/sell"
                className="
                  rounded-xl
                  border
                  border-white/40
                  bg-black/25
                  px-6
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  backdrop-blur-md
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#ff4054]
                  hover:bg-black/40
                  hover:text-[#ff4054]
                  sm:px-7
                  sm:py-4
                "
              >
                Sell Your Car
              </Link>

            </div>

            {/* =================================
                CAR INFORMATION
            ================================= */}

            <div
              className="
                mt-10
                grid
                max-w-2xl
                grid-cols-2
                gap-5
                border-t
                border-white/25
                pt-6
                sm:grid-cols-4
                sm:gap-6
              "
            >

              {/* HORSEPOWER */}

              <div>
                <p
                  className="
                    text-xl
                    font-black
                    text-[#ff4054]
                    sm:text-2xl
                  "
                >
                  {car.horsepower}
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    uppercase
                    tracking-widest
                    text-gray-300
                    sm:text-xs
                  "
                >
                  Horsepower
                </p>
              </div>

              {/* ACCELERATION */}

              <div>
                <p
                  className="
                    text-xl
                    font-black
                    text-[#ff4054]
                    sm:text-2xl
                  "
                >
                  {car.acceleration}
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    uppercase
                    tracking-widest
                    text-gray-300
                    sm:text-xs
                  "
                >
                  0-100 km/h
                </p>
              </div>

              {/* TOP SPEED */}

              <div>
                <p
                  className="
                    text-xl
                    font-black
                    text-[#ff4054]
                    sm:text-2xl
                  "
                >
                  {car.topSpeed}
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    uppercase
                    tracking-widest
                    text-gray-300
                    sm:text-xs
                  "
                >
                  Top Speed
                </p>
              </div>

              {/* PRICE */}

              <div>
                <p
                  className="
                    text-xl
                    font-black
                    text-[#ff4054]
                    sm:text-2xl
                  "
                >
                  {car.price}
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    uppercase
                    tracking-widest
                    text-gray-300
                    sm:text-xs
                  "
                >
                  Starting Price
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

 
      {/* =================================
          SLIDE INDICATOR
      ================================= */}

      <div
        className="
          absolute
          bottom-7
          left-1/2
          z-20
          flex
          -translate-x-1/2
          gap-2
        "
      >
        {cars.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveCar(index)}
            aria-label={`Show ${item.name}`}
            className={`
              h-1
              rounded-full
              transition-all
              duration-500
              ${
                activeCar === index
                  ? "w-10 bg-[#ff4054]"
                  : "w-3 bg-white/50"
              }
            `}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;