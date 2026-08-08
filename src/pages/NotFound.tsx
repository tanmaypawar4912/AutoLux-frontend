import { Link } from "react-router-dom";

const NotFound = () => {

  return (

    <div className="
      flex
      min-h-screen
      items-center
      justify-center
      bg-gray-50
      px-6
      text-center
    ">

      <div>

        <p className="
          text-8xl
          font-black
          text-[#ff4054]
        ">
          404
        </p>


        <h1 className="
          mt-6
          text-4xl
          font-black
          text-gray-900
        ">
          Page Not Found
        </h1>


        <p className="
          mx-auto
          mt-4
          max-w-md
          leading-7
          text-gray-500
        ">
          Sorry, the page you are looking for does not exist or may
          have been moved.
        </p>


        <Link
          to="/"
          className="
            mt-8
            inline-block
            rounded-xl
            bg-[#ff4054]
            px-7
            py-4
            font-bold
            text-white
            transition
            hover:bg-[#e9364a]
          "
        >
          Back To Home →
        </Link>

      </div>

    </div>

  );

};


export default NotFound;