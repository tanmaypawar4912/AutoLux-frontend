import { useState } from "react";
import { Link } from "react-router-dom";


const Pricing = () => {

  const [billing, setBilling] = useState("monthly");


  const plans = [
    {
      name: "Basic",
      description: "Perfect for individuals getting started.",
      monthlyPrice: "₹999",
      yearlyPrice: "₹9,999",

      features: [
        "Basic car listing",
        "Standard visibility",
        "Email support",
        "30 days listing",
      ],

      popular: false,
    },

    {
      name: "Professional",
      description: "Best for serious car sellers.",
      monthlyPrice: "₹1,999",
      yearlyPrice: "₹19,999",

      features: [
        "Premium car listing",
        "Priority visibility",
        "Featured placement",
        "Priority support",
        "90 days listing",
      ],

      popular: true,
    },

    {
      name: "Premium",
      description: "Maximum visibility for your vehicle.",
      monthlyPrice: "₹3,999",
      yearlyPrice: "₹39,999",

      features: [
        "Featured homepage placement",
        "Maximum visibility",
        "Premium promotion",
        "Dedicated support",
        "Unlimited listing period",
      ],

      popular: false,
    },
  ];


  return (

    <div className="min-h-screen bg-gray-50 pt-20">


      {/* =========================
          HERO
      ========================== */}

      <section className="
        bg-[#151515]
        px-6
        pb-24
        pt-40
        text-center
        text-white
      ">

        <p className="
          text-xs
          font-bold
          uppercase
          tracking-[0.35em]
          text-[#ff4054]
        ">
          Simple & Transparent
        </p>


        <h1 className="
          mt-6
          text-5xl
          font-black
          md:text-7xl
        ">
          Choose Your Plan
        </h1>


        <p className="
          mx-auto
          mt-6
          max-w-xl
          text-lg
          leading-8
          text-gray-400
        ">
          Choose the plan that works best for your automotive journey.
        </p>


        {/* BILLING TOGGLE */}

        <div className="
          mx-auto
          mt-10
          flex
          w-fit
          items-center
          gap-2
          rounded-full
          bg-white/10
          p-1
        ">


          <button
            onClick={() => setBilling("monthly")}
            className={`
              rounded-full
              px-6
              py-3
              text-sm
              font-bold
              transition

              ${
                billing === "monthly"
                  ? "bg-[#ff4054] text-white"
                  : "text-gray-400 hover:text-white"
              }
            `}
          >
            Monthly
          </button>


          <button
            onClick={() => setBilling("yearly")}
            className={`
              rounded-full
              px-6
              py-3
              text-sm
              font-bold
              transition

              ${
                billing === "yearly"
                  ? "bg-[#ff4054] text-white"
                  : "text-gray-400 hover:text-white"
              }
            `}
          >
            Yearly
          </button>

        </div>

      </section>


      {/* =========================
          PRICING CARDS
      ========================== */}

      <section className="
        px-6
        py-20
      ">

        <div className="
          mx-auto
          grid
          max-w-7xl
          gap-8
          lg:grid-cols-3
        ">


          {plans.map((plan) => (

            <div
              key={plan.name}
              className={`
                relative
                rounded-3xl
                p-8
                transition
                duration-300
                hover:-translate-y-2

                ${
                  plan.popular
                    ? "bg-[#151515] text-white shadow-2xl"
                    : "bg-white text-gray-900 shadow-sm"
                }
              `}
            >


              {/* POPULAR LABEL */}

              {plan.popular && (

                <div className="
                  absolute
                  right-6
                  top-6
                  rounded-full
                  bg-[#ff4054]
                  px-4
                  py-2
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                ">
                  Most Popular
                </div>

              )}


              {/* PLAN NAME */}

              <h2 className="
                text-2xl
                font-black
              ">
                {plan.name}
              </h2>


              <p className={`
                mt-3
                text-sm
                leading-6

                ${
                  plan.popular
                    ? "text-gray-400"
                    : "text-gray-500"
                }
              `}>
                {plan.description}
              </p>


              {/* PRICE */}

              <div className="
                mt-8
              ">

                <span className="
                  text-5xl
                  font-black
                ">
                  {
                    billing === "monthly"
                      ? plan.monthlyPrice
                      : plan.yearlyPrice
                  }
                </span>


                <span className={`
                  ml-2
                  text-sm

                  ${
                    plan.popular
                      ? "text-gray-400"
                      : "text-gray-500"
                  }
                `}>
                  /{billing === "monthly" ? "month" : "year"}
                </span>

              </div>


              {/* FEATURES */}

              <div className="
                mt-8
                space-y-4
              ">

                {plan.features.map((feature) => (

                  <div
                    key={feature}
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <span className="
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      rounded-full
                      bg-[#ff4054]
                      text-xs
                      text-white
                    ">
                      ✓
                    </span>


                    <span className={`
                      text-sm

                      ${
                        plan.popular
                          ? "text-gray-300"
                          : "text-gray-600"
                      }
                    `}>
                      {feature}
                    </span>

                  </div>

                ))}

              </div>


              {/* BUTTON */}

              <Link
                to="/contact"
                className={`
                  mt-10
                  block
                  rounded-xl
                  py-4
                  text-center
                  font-bold
                  transition

                  ${
                    plan.popular
                      ? "bg-[#ff4054] text-white hover:bg-[#e9364a]"
                      : "bg-gray-100 text-gray-900 hover:bg-[#ff4054] hover:text-white"
                  }
                `}
              >
                Get Started →
              </Link>

            </div>

          ))}

        </div>

      </section>


      {/* =========================
          BOTTOM CTA
      ========================== */}

      <section className="
        px-6
        pb-24
        text-center
      ">

        <h2 className="
          text-3xl
          font-black
          text-gray-900
          md:text-5xl
        ">
          Not Sure Which Plan Is Right For You?
        </h2>


        <p className="
          mx-auto
          mt-5
          max-w-xl
          text-gray-500
        ">
          Our team can help you choose the best option for your vehicle.
        </p>


        <Link
          to="/contact"
          className="
            mt-8
            inline-block
            rounded-xl
            bg-[#ff4054]
            px-8
            py-4
            font-bold
            text-white
            transition
            hover:-translate-y-1
            hover:bg-[#e9364a]
          "
        >
          Talk To Our Team →
        </Link>

      </section>

    </div>

  );
};


export default Pricing;