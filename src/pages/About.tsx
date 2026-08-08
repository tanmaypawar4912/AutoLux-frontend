import Reveal from "../components/Reveal";

const About = () => {
  const stats = [
    {
      value: "10+",
      label: "Years of Excellence",
    },
    {
      value: "500+",
      label: "Premium Vehicles",
    },
    {
      value: "98%",
      label: "Happy Customers",
    },
    {
      value: "24/7",
      label: "Expert Support",
    },
  ];

  const values = [
    {
      icon: "✦",
      title: "Curated Quality",
      description:
        "Every vehicle in our collection is carefully selected to meet our standards of quality, performance and reliability.",
    },
    {
      icon: "◇",
      title: "Complete Transparency",
      description:
        "We believe in honest pricing, clear communication and a buying experience without hidden surprises.",
    },
    {
      icon: "◈",
      title: "Customer First",
      description:
        "From your first visit to your final drive, our team is dedicated to making your automotive journey exceptional.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8f8f8]">

      {/* =========================
          HERO SECTION
      ========================== */}

      <section className="relative overflow-hidden bg-[#0f0f0f] px-6 pb-28 pt-40 text-white">

        {/* Background Glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-40
            top-20
            h-96
            w-96
            rounded-full
            bg-[#ff4054]/10
            blur-[120px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-40
            bottom-0
            h-96
            w-96
            rounded-full
            bg-[#ff4054]/5
            blur-[120px]
          "
        />


        <div className="relative z-10 mx-auto max-w-7xl">

          <Reveal>

            <div className="max-w-4xl">

              <p
                className="
                  text-sm
                  font-bold
                  uppercase
                  tracking-[0.35em]
                  text-[#ff4054]
                "
              >
                About AutoLux
              </p>


              <h1
                className="
                  mt-6
                  text-5xl
                  font-black
                  leading-tight
                  md:text-7xl
                "
              >
                Where Passion

                <br />

                Meets
                <span className="text-[#ff4054]">
                  {" "}Performance.
                </span>
              </h1>


              <p
                className="
                  mt-8
                  max-w-2xl
                  text-lg
                  leading-8
                  text-gray-400
                "
              >
                AutoLux is more than a premium car dealership.
                We are a destination for people who believe that
                driving should be an experience.
              </p>

            </div>

          </Reveal>

        </div>

      </section>


      {/* =========================
          OUR STORY
      ========================== */}

      <section className="px-6 py-28">

        <div
          className="
            mx-auto
            grid
            max-w-7xl
            gap-16
            lg:grid-cols-2
            lg:items-center
          "
        >

          {/* LEFT CONTENT */}

          <Reveal>

            <div>

              <p
                className="
                  text-sm
                  font-bold
                  uppercase
                  tracking-[0.3em]
                  text-[#ff4054]
                "
              >
                Our Story
              </p>


              <h2
                className="
                  mt-5
                  text-4xl
                  font-black
                  leading-tight
                  text-[#111]
                  md:text-6xl
                "
              >
                Driven By

                <span className="text-[#ff4054]">
                  {" "}Passion.
                </span>
              </h2>


              <div className="mt-8 space-y-5 text-lg leading-8 text-gray-500">

                <p>
                  At AutoLux, we believe buying a car should be
                  more than a transaction. It should be the beginning
                  of a new journey.
                </p>

                <p>
                  Our collection is carefully curated for drivers
                  who appreciate exceptional design, powerful
                  performance and uncompromising quality.
                </p>

                <p>
                  Whether you are looking for your dream performance
                  car or selling your current vehicle, our team is
                  here to make every step simple and memorable.
                </p>

              </div>

            </div>

          </Reveal>


          {/* RIGHT VISUAL */}

          <Reveal>

            <div
              className="
                relative
                flex
                min-h-[450px]
                items-center
                justify-center
                overflow-hidden
                rounded-3xl
                bg-[#111]
              "
            >

              <div
                className="
                  absolute
                  h-80
                  w-80
                  rounded-full
                  bg-[#ff4054]/10
                  blur-[100px]
                "
              />


              <div
                className="
                  relative
                  z-10
                  text-center
                "
              >

                <p
                  className="
                    text-8xl
                    font-black
                    text-[#ff4054]
                  "
                >
                  A
                </p>

                <p
                  className="
                    mt-4
                    text-2xl
                    font-black
                    tracking-widest
                    text-white
                  "
                >
                  DRIVE DIFFERENT
                </p>

                <p className="mt-3 text-gray-500">
                  Experience the AutoLux difference.
                </p>

              </div>

            </div>

          </Reveal>

        </div>

      </section>


      {/* =========================
          STATS
      ========================== */}

      <section className="bg-white px-6 py-20">

        <div
          className="
            mx-auto
            grid
            max-w-7xl
            grid-cols-2
            gap-8
            md:grid-cols-4
          "
        >

          {stats.map((stat, index) => (

            <Reveal
              key={stat.label}
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

              <div className="text-center">

                <p
                  className="
                    text-4xl
                    font-black
                    text-[#ff4054]
                    md:text-5xl
                  "
                >
                  {stat.value}
                </p>

                <p
                  className="
                    mt-3
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-400
                  "
                >
                  {stat.label}
                </p>

              </div>

            </Reveal>

          ))}

        </div>

      </section>


      {/* =========================
          OUR VALUES
      ========================== */}

      <section className="bg-[#0f0f0f] px-6 py-28 text-white">

        <div className="mx-auto max-w-7xl">

          <Reveal>

            <div className="max-w-2xl">

              <p
                className="
                  text-sm
                  font-bold
                  uppercase
                  tracking-[0.3em]
                  text-[#ff4054]
                "
              >
                What We Believe
              </p>


              <h2
                className="
                  mt-5
                  text-4xl
                  font-black
                  md:text-6xl
                "
              >
                Built On

                <span className="text-[#ff4054]">
                  {" "}Trust.
                </span>
              </h2>

            </div>

          </Reveal>


          <div
            className="
              mt-16
              grid
              gap-6
              md:grid-cols-3
            "
          >

            {values.map((value, index) => (

              <Reveal
                key={value.title}
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
                    h-full
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
                  "
                >

                  <div
                    className="
                      text-4xl
                      text-[#ff4054]
                      transition
                      duration-500
                      group-hover:rotate-180
                    "
                  >
                    {value.icon}
                  </div>


                  <h3 className="mt-8 text-2xl font-black">
                    {value.title}
                  </h3>


                  <p className="mt-4 leading-7 text-gray-400">
                    {value.description}
                  </p>

                </div>

              </Reveal>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
};

export default About;