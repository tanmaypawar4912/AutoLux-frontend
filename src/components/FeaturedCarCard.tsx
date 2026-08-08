import { Link } from "react-router-dom";

interface Car {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
}

interface FeaturedCarCardProps {
  car: Car;
}

const FeaturedCarCard = ({ car }: FeaturedCarCardProps) => {
  return (
    <div className="group relative">
      {/* CARD GLOW */}
      <div
        className="
          absolute
          -inset-1
          rounded-[2rem]
          bg-[#ff4054]/20
          opacity-0
          blur-xl
          transition
          duration-500
          group-hover:opacity-100
        "
      />

      {/* CARD */}
      <div
        className="
          relative
          overflow-hidden
          rounded-[2rem]
          border
          border-gray-100
          bg-white
          transition-all
          duration-500
          group-hover:-translate-y-3
          group-hover:border-[#ff4054]/30
          group-hover:shadow-2xl
        "
      >
        {/* IMAGE */}
        <div
          className="
            relative
            flex
            h-72
            items-center
            justify-center
            overflow-hidden
            bg-gradient-to-br
            from-gray-50
            to-gray-100
          "
        >
          <div
            className="
              absolute
              h-52
              w-52
              rounded-full
              bg-[#ff4054]/5
              transition
              duration-700
              group-hover:scale-150
            "
          />

          <img
            src={car.image || "/default-car.jpg"}
            alt={car.model}
            className="
              relative
              z-10
              h-full
              w-full
              object-contain
              px-6
              transition-all
              duration-700
              group-hover:scale-110
            "
          />

          <span
            className="
              absolute
              left-5
              top-5
              rounded-full
              bg-white/90
              px-4
              py-2
              text-xs
              font-bold
              uppercase
              shadow
            "
          >
            {car.brand}
          </span>

          <div
            className="
              absolute
              bottom-5
              left-1/2
              -translate-x-1/2
              translate-y-16
              opacity-0
              transition-all
              duration-500
              group-hover:translate-y-0
              group-hover:opacity-100
            "
          >
            <Link
              to={`/cars/${car._id}`}
              className="
                rounded-full
                bg-[#ff4054]
                px-5
                py-3
                text-sm
                font-bold
                text-white
              "
            >
              Quick View →
            </Link>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-7">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff4054]">
            {car.brand}
          </p>

          <h3 className="mt-3 text-2xl font-black">
            {car.model}
          </h3>

          <p className="mt-3 text-gray-500">
            {car.year}
          </p>

          <div className="mt-6 flex items-center justify-between border-t pt-5">
            <div>
              <p className="text-xs text-gray-400">
                Price
              </p>

              <p className="mt-1 text-xl font-black">
                ₹{Number(car.price).toLocaleString("en-IN")}
              </p>
            </div>

            <Link
              to={`/cars/${car._id}`}
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-gray-100
                text-xl
                transition
                hover:bg-[#ff4054]
                hover:text-white
              "
            >
              →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarCard;