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

const FeaturedCarCard = ({
  car,
}: FeaturedCarCardProps) => {
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

        {/* BRAND / NAME - OUTSIDE IMAGE */}
        <div className="px-5 pt-5 sm:px-6 sm:pt-6">
          <span
            className="
              inline-flex
              rounded-full
              bg-gray-100
              px-4
              py-2
              text-[11px]
              font-black
              uppercase
              tracking-[0.18em]
              text-[#111]
            "
          >
            {car.brand}
          </span>
        </div>

        {/* IMAGE */}
        <div
          className="
            relative
            mt-3
            flex
            h-64
            items-center
            justify-center
            overflow-hidden
            bg-gradient-to-br
            from-gray-50
            to-gray-100
            sm:h-72
          "
        >
          {/* BACKGROUND CIRCLE */}
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

          {/* CAR IMAGE */}
          <img
            src={
              car.image ||
              "/default-car.jpg"
            }
            alt={`${car.brand} ${car.model}`}
            className="
              relative
              z-10
              h-full
              w-full
              object-contain
              px-4
              transition-all
              duration-700
              group-hover:scale-110
              sm:px-6
            "
          />

          {/* QUICK VIEW */}
          <div
            className="
              absolute
              bottom-5
              left-1/2
              z-20
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
                whitespace-nowrap
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
        <div className="p-6 sm:p-7">

          <h3
            className="
              text-xl
              font-black
              text-[#111]
              sm:text-2xl
            "
          >
            {car.model}
          </h3>

          <p className="mt-2 text-gray-500">
            {car.year}
          </p>

          {/* PRICE */}
          <div
            className="
              mt-6
              flex
              items-center
              justify-between
              gap-4
              border-t
              pt-5
            "
          >
            <div>
              <p className="text-xs text-gray-400">
                Price
              </p>

              <p
                className="
                  mt-1
                  text-lg
                  font-black
                  text-[#111]
                  sm:text-xl
                "
              >
                ₹
                {Number(
                  car.price
                ).toLocaleString("en-IN")}
              </p>
            </div>

            <Link
              to={`/cars/${car._id}`}
              className="
                flex
                h-11
                w-11
                shrink-0
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