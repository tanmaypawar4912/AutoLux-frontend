import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cars } from "../../data/cars";

const Hero = () => {
  // =============================
  // ACTIVE CAR
  // =============================

  const [activeCar, setActiveCar] = useState(0);


  // =============================
  // MOUSE POSITION
  // =============================

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });


  // Current Car

  const car = cars[activeCar];


  // =============================
  // AUTOMATIC CAR SLIDER
  // =============================

  useEffect(() => {

    const slider = setInterval(() => {

      setActiveCar(
        (current) => (current + 1) % cars.length
      );

    }, 5000);


    return () => {

      clearInterval(slider);

    };

  }, []);


  // =============================
  // MOUSE MOVEMENT EFFECT
  // =============================

  useEffect(() => {

    const handleMouseMove = (
      event: MouseEvent
    ) => {

      const x =
        (event.clientX / window.innerWidth - 0.5) * 2;


      const y =
        (event.clientY / window.innerHeight - 0.5) * 2;


      setMousePosition({
        x,
        y,
      });

    };


    window.addEventListener(
      "mousemove",
      handleMouseMove
    );


    return () => {

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

    };

  }, []);


  return (

    <section className="
      relative
      min-h-screen
      overflow-hidden
      bg-[#0f0f0f]
      px-6
      py-32
      text-white
    ">


      {/* =============================
          ANIMATED BACKGROUND
      ============================== */}

      <div className="
        pointer-events-none
        absolute
        inset-0
        overflow-hidden
      ">


        {/* MOVING GLOW 1 */}

        <div className="
          absolute
          -left-32
          top-20
          h-72
          w-72
          rounded-full
          bg-[#ff4054]/10
          blur-3xl
          animate-[floatGlow_8s_ease-in-out_infinite]
        " />


        {/* MOVING GLOW 2 */}

        <div className="
          absolute
          -right-32
          bottom-20
          h-96
          w-96
          rounded-full
          bg-[#ff4054]/5
          blur-3xl
          animate-[floatGlowReverse_10s_ease-in-out_infinite]
        " />


        {/* GRID BACKGROUND */}

        <div className="
          absolute
          inset-0
          opacity-[0.04]
          [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]
          [background-size:80px_80px]
        " />

      </div>


      {/* =============================
          MAIN CONTENT
      ============================== */}

      <div className="
        relative
        z-10
        mx-auto
        max-w-7xl
      ">


        {/* =============================
            HERO CONTENT
        ============================== */}

        <div className="
          grid
          items-center
          gap-12
          lg:grid-cols-2
        ">


          {/* =============================
              LEFT SIDE
          ============================== */}

          <div>

            <p className="
              text-sm
              font-bold
              uppercase
              tracking-[0.35em]
              text-[#ff4054]
            ">
              Premium Automotive Experience
            </p>


            <h1 className="
              mt-6
              max-w-3xl
              text-5xl
              font-black
              leading-tight
              md:text-7xl
            ">

              Drive Your

              <span className="text-[#ff4054]">
                {" "}Dream.
              </span>

            </h1>


            <p className="
              mt-6
              max-w-xl
              text-lg
              leading-8
              text-gray-400
            ">
              Discover a curated collection of premium vehicles
              selected for those who expect more from every drive.
            </p>


            {/* BUTTONS */}

            <div className="
              mt-10
              flex
              flex-wrap
              gap-4
            ">


              <Link
                to="/cars"
                className="
                  rounded-xl
                  bg-[#ff4054]
                  px-7
                  py-4
                  font-bold
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[#e9364a]
                  hover:shadow-lg
                  hover:shadow-[#ff4054]/30
                "
              >
                Explore Collection →
              </Link>


              <Link
                to="/sell"
                className="
                  rounded-xl
                  border
                  border-white/20
                  px-7
                  py-4
                  font-bold
                  transition
                  duration-300
                  hover:border-[#ff4054]
                  hover:text-[#ff4054]
                "
              >
                Sell Your Car
              </Link>

            </div>

          </div>


          {/* =============================
              RIGHT SIDE
          ============================== */}

          <div className="
            relative
            flex
            min-h-[450px]
            items-center
            justify-center
          ">


            {/* CAR GLOW */}

            <div className="
              absolute
              h-80
              w-80
              rounded-full
              bg-[#ff4054]/10
              blur-3xl
            " />


            {/* CAR IMAGE */}

            <img
              key={car.id}
              src={car.image}
              alt={car.name}

              style={{
                transform: `
                  perspective(1000px)
                  rotateY(${mousePosition.x * 5}deg)
                  rotateX(${mousePosition.y * -5}deg)
                  translateX(${mousePosition.x * 10}px)
                  translateY(${mousePosition.y * 10}px)
                `,
              }}

              className="
                relative
                z-10
                w-full
                max-w-2xl
                object-contain
                animate-[carEnter_0.8s_ease-out]
                drop-shadow-[0_30px_40px_rgba(0,0,0,0.7)]
                transition-transform
                duration-300
                ease-out
              "
            />

          </div>

        </div>


        {/* =============================
            CAR SELECTOR
        ============================== */}

        <div className="
          mt-20
          flex
          flex-wrap
          justify-center
          gap-4
        ">

          {cars.map((item, index) => (

            <button
              key={item.id}

              onClick={() => setActiveCar(index)}

              className={`
                rounded-full
                px-5
                py-3
                text-sm
                font-bold
                transition
                duration-300

                ${
                  activeCar === index
                    ? "bg-[#ff4054] text-white"
                    : "border border-white/10 text-gray-400 hover:border-[#ff4054] hover:text-white"
                }
              `}
            >

              {item.name}

            </button>

          ))}

        </div>


        {/* =============================
            ACTIVE CAR INFO
        ============================== */}

        <div className="
          mt-10
          grid
          grid-cols-2
          gap-6
          border-t
          border-white/10
          pt-8
          md:grid-cols-4
        ">


          {/* HORSEPOWER */}

          <div>

            <p className="
              text-2xl
              font-black
              text-[#ff4054]
            ">
              {car.horsepower}
            </p>

            <p className="
              mt-1
              text-xs
              uppercase
              tracking-widest
              text-gray-500
            ">
              Horsepower
            </p>

          </div>


          {/* ACCELERATION */}

          <div>

            <p className="
              text-2xl
              font-black
              text-[#ff4054]
            ">
              {car.acceleration}
            </p>

            <p className="
              mt-1
              text-xs
              uppercase
              tracking-widest
              text-gray-500
            ">
              0-100 km/h
            </p>

          </div>


          {/* TOP SPEED */}

          <div>

            <p className="
              text-2xl
              font-black
              text-[#ff4054]
            ">
              {car.topSpeed}
            </p>

            <p className="
              mt-1
              text-xs
              uppercase
              tracking-widest
              text-gray-500
            ">
              Top Speed
            </p>

          </div>


          {/* PRICE */}

          <div>

            <p className="
              text-2xl
              font-black
              text-[#ff4054]
            ">
              {car.price}
            </p>

            <p className="
              mt-1
              text-xs
              uppercase
              tracking-widest
              text-gray-500
            ">
              Starting Price
            </p>

          </div>

        </div>

      </div>

    </section>

  );

};

export default Hero;