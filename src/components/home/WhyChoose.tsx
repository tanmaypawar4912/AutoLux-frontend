import Reveal from "../Reveal";

const WhyChoose = () => {
  const features = [
    {
      number: "01",
      title: "Curated Excellence",
      description:
        "Every vehicle is carefully selected and inspected to meet our premium quality standards.",
      icon: "✦",
    },

    {
      number: "02",
      title: "Transparent Pricing",
      description:
        "No hidden surprises. Get clear, honest and transparent pricing on every vehicle.",
      icon: "◇",
    },

    {
      number: "03",
      title: "Premium Experience",
      description:
        "From discovery to delivery, enjoy a smooth and personalised automotive experience.",
      icon: "◈",
    },

    {
      number: "04",
      title: "Trusted Support",
      description:
        "Our automotive experts are always here to help you make the right decision.",
      icon: "✧",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0f0f0f] px-6 py-28 text-white">

      {/* =========================
          BACKGROUND GLOW
      ========================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-1/2
          h-96
          w-96
          -translate-y-1/2
          rounded-full
          bg-[#ff4054]/10
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-0
          h-96
          w-96
          rounded-full
          bg-[#ff4054]/5
          blur-[120px]
        "
      />


      {/* =========================
          MAIN CONTAINER
      ========================== */}

      <div className="relative z-10 mx-auto max-w-7xl">


        {/* =========================
            HEADER
        ========================== */}

        <Reveal>

          <div className="max-w-2xl">

            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-[0.35em]
                text-[#ff4054]
              "
            >
              The Autolux Difference
            </p>


            <h2
              className="
                mt-5
                text-4xl
                font-black
                leading-tight
                md:text-6xl
              "
            >
              More Than Just

              <span className="text-[#ff4054]">
                {" "}A Car.
              </span>
            </h2>


            <p
              className="
                mt-6
                max-w-xl
                text-lg
                leading-8
                text-gray-400
              "
            >
              We believe buying a premium vehicle should feel as
              exceptional as driving one.
            </p>

          </div>

        </Reveal>


        {/* =========================
            FEATURES
        ========================== */}

        <div
          className="
            mt-20
            grid
            gap-6
            md:grid-cols-2
            lg:grid-cols-4
          "
        >

          {features.map((feature, index) => (

            <Reveal
              key={feature.number}
              className={
                index === 0
                  ? "delay-100"
                  : index === 1
                    ? "delay-200"
                    : index === 2
                      ? "delay-300"
                      : "delay-500"
              }
            >

              <div
                className="
                  group
                  relative
                  h-full
                  overflow-hidden
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  p-8
                  transition
                  duration-500
                  hover:-translate-y-3
                  hover:border-[#ff4054]/50
                  hover:bg-white/[0.06]
                  hover:shadow-2xl
                  hover:shadow-[#ff4054]/10
                "
              >

                {/* TOP CONTENT */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <span
                    className="
                      text-sm
                      font-bold
                      tracking-widest
                      text-[#ff4054]
                    "
                  >
                    {feature.number}
                  </span>


                  <span
                    className="
                      text-3xl
                      text-[#ff4054]
                      transition
                      duration-500
                      group-hover:rotate-180
                      group-hover:scale-125
                    "
                  >
                    {feature.icon}
                  </span>

                </div>


                {/* TITLE */}

                <h3
                  className="
                    mt-12
                    text-xl
                    font-black
                  "
                >
                  {feature.title}
                </h3>


                {/* DESCRIPTION */}

                <p
                  className="
                    mt-4
                    text-sm
                    leading-7
                    text-gray-400
                  "
                >
                  {feature.description}
                </p>


                {/* HOVER GLOW */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-40
                    w-40
                    rounded-full
                    bg-[#ff4054]/10
                    opacity-0
                    blur-3xl
                    transition
                    duration-500
                    group-hover:opacity-100
                  "
                />


                {/* BOTTOM LINE */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-1
                    w-0
                    bg-[#ff4054]
                    transition-all
                    duration-500
                    group-hover:w-full
                  "
                />

              </div>

            </Reveal>

          ))}

        </div>

      </div>

    </section>
  );
};

export default WhyChoose;