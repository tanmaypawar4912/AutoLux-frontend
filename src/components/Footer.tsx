import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f0f0f] px-6 pt-20 text-white">

      <div className="mx-auto max-w-7xl">

        {/* =========================
            MAIN FOOTER
        ========================== */}

        <div className="grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}

          <div className="lg:col-span-1">

            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff4054] text-2xl shadow-lg shadow-[#ff4054]/20">
                🚘
              </div>

              <div>

                <h2 className="text-2xl font-black">
                  Auto<span className="text-[#ff4054]">Lux</span>
                </h2>

                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-500">
                  Premium Cars
                </p>

              </div>

            </Link>


            <p className="mt-6 max-w-xs leading-7 text-gray-400">
              Discover exceptional vehicles, experience premium service
              and start your next unforgettable journey with AutoLux.
            </p>


            {/* SOCIAL LINKS */}

            <div className="mt-7 flex gap-3">

              <a
                href="#"
                aria-label="Instagram"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  text-sm
                  transition
                  duration-300
                  hover:border-[#ff4054]
                  hover:bg-[#ff4054]
                "
              >
                ◎
              </a>


              <a
                href="#"
                aria-label="Facebook"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  text-sm
                  transition
                  duration-300
                  hover:border-[#ff4054]
                  hover:bg-[#ff4054]
                "
              >
                f
              </a>


              <a
                href="#"
                aria-label="Twitter"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  text-sm
                  transition
                  duration-300
                  hover:border-[#ff4054]
                  hover:bg-[#ff4054]
                "
              >
                𝕏
              </a>

            </div>

          </div>


          {/* QUICK LINKS */}

          <div>

            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff4054]">
              Quick Links
            </h3>

            <div className="mt-6 space-y-4">

              <Link
                to="/"
                className="block text-gray-400 transition hover:translate-x-1 hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/cars"
                className="block text-gray-400 transition hover:translate-x-1 hover:text-white"
              >
                Buy Cars
              </Link>

              <Link
                to="/sell"
                className="block text-gray-400 transition hover:translate-x-1 hover:text-white"
              >
                Sell Your Car
              </Link>

              <Link
                to="/about"
                className="block text-gray-400 transition hover:translate-x-1 hover:text-white"
              >
                About Us
              </Link>

              <Link
                to="/contact"
                className="block text-gray-400 transition hover:translate-x-1 hover:text-white"
              >
                Contact
              </Link>

            </div>

          </div>


          {/* SERVICES */}

          <div>

            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff4054]">
              Services
            </h3>

            <div className="mt-6 space-y-4">

              <p className="text-gray-400">
                Premium Car Sales
              </p>

              <p className="text-gray-400">
                Car Valuation
              </p>

              <p className="text-gray-400">
                Test Drive Booking
              </p>

              <p className="text-gray-400">
                Vehicle Consultation
              </p>

              <p className="text-gray-400">
                Premium Support
              </p>

            </div>

          </div>


          {/* CONTACT */}

          <div>

            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff4054]">
              Get In Touch
            </h3>

            <div className="mt-6 space-y-5">

              <div>

                <p className="text-sm text-gray-500">
                  Email
                </p>

                <a
                  href="mailto:hello@autolux.com"
                  className="mt-1 block font-semibold transition hover:text-[#ff4054]"
                >
                  hello@autolux.com
                </a>

              </div>


              <div>

                <p className="text-sm text-gray-500">
                  Phone
                </p>

                <a
                  href="tel:+919876543210"
                  className="mt-1 block font-semibold transition hover:text-[#ff4054]"
                >
                  +91 98765 43210
                </a>

              </div>


              <div>

                <p className="text-sm text-gray-500">
                  Location
                </p>

                <p className="mt-1 font-semibold">
                  Pune, Maharashtra
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =========================
            BOTTOM FOOTER
        ========================== */}

        <div
          className="
            flex
            flex-col
            gap-4
            border-t
            border-white/10
            py-7
            text-sm
            text-gray-500
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <p>
            © {currentYear} AutoLux. All rights reserved.
          </p>


          <div className="flex gap-6">

            <a
              href="#"
              className="transition hover:text-white"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="transition hover:text-white"
            >
              Terms & Conditions
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;