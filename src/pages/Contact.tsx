import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import type { FormEvent } from "react";
import Reveal from "../components/Reveal";

const Contact = () => {
  const {
    user,
    isLoaded: userLoaded,
  } = useUser();

  const [isSubmitted, setIsSubmitted] =
    useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // =========================================
    // LOGIN REQUIRED
    // Logged-out users can view this page only.
    // =========================================

    if (!userLoaded || !user) {
      return;
    }

    setIsSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 pb-16 pt-20 sm:px-6 lg:pt-24">
      <div className="mx-auto max-w-7xl">

        {/* ================================
            PAGE HEADER
        ================================= */}

        <Reveal>
          <div className="max-w-3xl">

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ff4054]">
              Get In Touch
            </p>

            <h1 className="mt-3 text-4xl font-black leading-[1.05] text-[#111] sm:text-5xl md:text-6xl">
              Let's Start Your{" "}
              <span className="text-[#ff4054]">
                Dream Drive.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
              Have a question about a vehicle, want to book a test drive,
              or simply want to talk cars? Our team is here to help.
            </p>

          </div>
        </Reveal>


        {/* ================================
            CONTACT SECTION
        ================================= */}

        <div className="mt-7 grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">

          {/* ================================
              CONTACT INFORMATION
          ================================= */}

          <Reveal>
            <div className="h-full rounded-3xl bg-[#111] p-7 text-white sm:p-8">

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ff4054]">
                Contact AutoLux
              </p>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                We Are Here To Help.
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400 sm:text-base">
                Our automotive experts are ready to help you find the
                perfect vehicle or answer any questions you may have.
              </p>


              {/* CONTACT DETAILS */}

              <div className="mt-7 space-y-5">

                {/* EMAIL */}

                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff4054] text-lg">
                    ✉
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Email Us
                    </p>

                    <p className="mt-1 text-sm font-bold sm:text-base">
                      hello@autolux.com
                    </p>
                  </div>

                </div>


                {/* PHONE */}

                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff4054] text-lg">
                    ☎
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Call Us
                    </p>

                    <p className="mt-1 text-sm font-bold sm:text-base">
                      +91 98765 43210
                    </p>
                  </div>

                </div>


                {/* LOCATION */}

                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff4054] text-lg">
                    ⌖
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Visit Us
                    </p>

                    <p className="mt-1 text-sm font-bold sm:text-base">
                      Pune, Maharashtra
                    </p>
                  </div>

                </div>

              </div>


              {/* ================================
                  OPENING HOURS
              ================================= */}

              <div className="mt-7 border-t border-white/10 pt-6">

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff4054]">
                  Opening Hours
                </p>

                <div className="mt-4 space-y-2 text-xs sm:text-sm">

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-gray-400">
                      Monday - Saturday
                    </span>

                    <span className="font-semibold text-white">
                      9:00 AM - 8:00 PM
                    </span>

                  </div>

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-gray-400">
                      Sunday
                    </span>

                    <span className="font-semibold text-white">
                      10:00 AM - 6:00 PM
                    </span>

                  </div>

                </div>

              </div>

            </div>
          </Reveal>


          {/* ================================
              CONTACT FORM
          ================================= */}

          <Reveal>
            <div className="h-full rounded-3xl bg-white p-6 shadow-sm sm:p-8">

              {isSubmitted ? (

                /* ================================
                   SUCCESS MESSAGE
                ================================= */

                <div className="flex min-h-[430px] flex-col items-center justify-center text-center">

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                    ✓
                  </div>

                  <h2 className="mt-6 text-2xl font-black text-[#111] sm:text-3xl">
                    Message Sent Successfully!
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
                    Thank you for contacting AutoLux. Our team will
                    get back to you as soon as possible.
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 rounded-xl bg-[#111] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#ff4054]"
                  >
                    Send Another Message
                  </button>

                </div>

              ) : !userLoaded ? (

                /* ================================
                   AUTHENTICATION LOADING
                ================================= */

                <div className="flex min-h-[430px] flex-col items-center justify-center text-center">

                  <h2 className="text-2xl font-black text-[#111] sm:text-3xl">
                    Checking Login...
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
                    Please wait while we check your login status.
                  </p>

                </div>

              ) : !user ? (

                /* ================================
                   LOGIN REQUIRED
                   Logged-out users can only view.
                ================================= */

                <div className="flex min-h-[430px] flex-col items-center justify-center text-center">

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff4054]/10 text-2xl">
                    🔒
                  </div>

                  <h2 className="mt-6 text-2xl font-black text-[#111] sm:text-3xl">
                    Login Required
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
                    Please login to send us a message.
                    You can continue viewing AutoLux and
                    our cars without logging in.
                  </p>

                </div>

              ) : (

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  {/* FORM HEADER */}

                  <div>

                    <h2 className="text-2xl font-black text-[#111] sm:text-3xl">
                      Send Us A Message
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Fill in the details below and we will get back to you.
                    </p>

                  </div>


                  {/* ================================
                      NAME + EMAIL
                  ================================= */}

                  <div className="grid gap-4 md:grid-cols-2">

                    <div>

                      <label className="mb-1.5 block text-xs font-bold text-gray-700">
                        Full Name
                      </label>

                      <input
                        type="text"
                        placeholder="Your name"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                      />

                    </div>


                    <div>

                      <label className="mb-1.5 block text-xs font-bold text-gray-700">
                        Email Address
                      </label>

                      <input
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                      />

                    </div>

                  </div>


                  {/* ================================
                      PHONE + SUBJECT
                  ================================= */}

                  <div className="grid gap-4 md:grid-cols-2">

                    <div>

                      <label className="mb-1.5 block text-xs font-bold text-gray-700">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                      />

                    </div>


                    <div>

                      <label className="mb-1.5 block text-xs font-bold text-gray-700">
                        Subject
                      </label>

                      <select
                        required
                        defaultValue=""
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054]"
                      >

                        <option value="" disabled>
                          Select a subject
                        </option>

                        <option value="test-drive">
                          Book a Test Drive
                        </option>

                        <option value="buy-car">
                          Enquiry About a Car
                        </option>

                        <option value="sell-car">
                          Sell My Car
                        </option>

                        <option value="general">
                          General Enquiry
                        </option>

                      </select>

                    </div>

                  </div>


                  {/* ================================
                      MESSAGE
                  ================================= */}

                  <div>

                    <label className="mb-1.5 block text-xs font-bold text-gray-700">
                      Message
                    </label>

                    <textarea
                      rows={4}
                      placeholder="Write your message..."
                      required
                      className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                    />

                  </div>


                  {/* ================================
                      SUBMIT
                  ================================= */}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#ff4054] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ff4054]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#e9364a]"
                  >
                    Send Message →
                  </button>

                </form>

              )}

            </div>
          </Reveal>

        </div>

      </div>
    </main>
  );
};

export default Contact;