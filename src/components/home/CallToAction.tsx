import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#151515]
        px-6
        py-24
        text-center
        text-white
      "
    >

      {/* Background Glow */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-96
          w-96
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#ff4054]/10
          blur-[120px]
        "
      />


      {/* Content */}

      <div className="relative z-10 mx-auto max-w-4xl">

        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-[0.3em]
            text-[#ff4054]
          "
        >
          Your Next Drive Starts Here
        </p>


        <h2
          className="
            mt-6
            text-4xl
            font-black
            leading-tight
            md:text-6xl
          "
        >
          Find The Car

          <br />

          <span className="text-[#ff4054]">
            That Moves You.
          </span>
        </h2>


        <p
          className="
            mx-auto
            mt-6
            max-w-xl
            text-gray-400
          "
        >
          Explore our premium collection and discover a vehicle
          that matches your lifestyle, ambition and passion.
        </p>


        <Link
          to="/cars"
          className="
            mt-10
            inline-flex
            items-center
            gap-3
            rounded-xl
            bg-[#ff4054]
            px-8
            py-4
            font-bold
            text-white
            shadow-xl
            shadow-[#ff4054]/20
            transition
            duration-300
            hover:-translate-y-1
            hover:bg-[#e9364a]
            hover:shadow-[#ff4054]/40
          "
        >
          Explore Premium Cars

          <span className="transition duration-300 hover:translate-x-1">
            →
          </span>
        </Link>

      </div>

    </section>
  );
};

export default CallToAction;