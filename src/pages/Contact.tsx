import { useState } from "react";
import type { FormEvent } from "react";
import Reveal from "../components/Reveal";

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-6 pb-24 pt-36">
      <div className="mx-auto max-w-7xl">

        {/* PAGE HEADER */}

        <Reveal>
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ff4054]">
              Get In Touch
            </p>

            <h1 className="mt-5 text-5xl font-black leading-tight text-[#111] md:text-7xl">
              Let's Start Your
              <span className="text-[#ff4054]">
                {" "}Dream Drive.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-500">
              Have a question about a vehicle, want to book a test drive,
              or simply want to talk cars? Our team is here to help.
            </p>
          </div>
        </Reveal>


        {/* CONTACT CONTENT */}

        <div className="mt-16 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">

          {/* CONTACT INFO */}

          <Reveal>
            <div className="rounded-3xl bg-[#111] p-8 text-white md:p-10">

              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ff4054]">
                Contact AutoLux
              </p>

              <h2 className="mt-5 text-3xl font-black md:text-4xl">
                We Are Here To Help.
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                Our automotive experts are ready to help you find the
                perfect vehicle or answer any questions you may have.
              </p>


              <div className="mt-10 space-y-7">

                <div className="flex gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ff4054] text-xl">
                    ✉
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Email Us
                    </p>

                    <p className="mt-1 font-bold">
                      hello@autolux.com
                    </p>
                  </div>
                </div>


                <div className="flex gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ff4054] text-xl">
                    ☎
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Call Us
                    </p>

                    <p className="mt-1 font-bold">
                      +91 98765 43210
                    </p>
                  </div>
                </div>


                <div className="flex gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ff4054] text-xl">
                    ⌖
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Visit Us
                    </p>

                    <p className="mt-1 font-bold">
                      Pune, Maharashtra
                    </p>
                  </div>
                </div>

              </div>


              {/* BUSINESS HOURS */}

              <div className="mt-12 border-t border-white/10 pt-8">

                <p className="text-sm font-bold uppercase tracking-widest text-[#ff4054]">
                  Opening Hours
                </p>

                <div className="mt-5 space-y-3 text-sm text-gray-400">

                  <div className="flex justify-between">
                    <span>Monday - Saturday</span>
                    <span className="font-semibold text-white">
                      9:00 AM - 8:00 PM
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold text-white">
                      10:00 AM - 6:00 PM
                    </span>
                  </div>

                </div>

              </div>

            </div>
          </Reveal>


          {/* CONTACT FORM */}

          <Reveal>

            <div className="rounded-3xl bg-white p-6 shadow-sm md:p-10">

              {isSubmitted ? (

                <div className="flex min-h-[550px] flex-col items-center justify-center text-center">

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
                    ✓
                  </div>

                  <h2 className="mt-8 text-3xl font-black text-[#111]">
                    Message Sent Successfully!
                  </h2>

                  <p className="mt-4 max-w-md leading-7 text-gray-500">
                    Thank you for contacting AutoLux. Our team will
                    get back to you as soon as possible.
                  </p>

                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 rounded-xl bg-[#111] px-6 py-4 font-bold text-white transition hover:bg-[#ff4054]"
                  >
                    Send Another Message
                  </button>

                </div>

              ) : (

                <form
                  onSubmit={handleSubmit}
                  className="space-y-7"
                >

                  <div>
                    <h2 className="text-3xl font-black text-[#111]">
                      Send Us A Message
                    </h2>

                    <p className="mt-2 text-gray-500">
                      Fill in the details below and we will get back to you.
                    </p>
                  </div>


                  {/* NAME + EMAIL */}

                  <div className="grid gap-6 md:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-700">
                        Full Name
                      </label>

                      <input
                        type="text"
                        placeholder="Your name"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                      />
                    </div>


                    <div>
                      <label className="mb-2 block text-sm font-bold text-gray-700">
                        Email Address
                      </label>

                      <input
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                      />
                    </div>

                  </div>


                  {/* PHONE */}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                    />
                  </div>


                  {/* SUBJECT */}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Subject
                    </label>

                    <select
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition focus:border-[#ff4054]"
                    >
                      <option value="">
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


                  {/* MESSAGE */}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Message
                    </label>

                    <textarea
                      rows={6}
                      placeholder="Write your message..."
                      required
                      className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                    />
                  </div>


                  {/* SUBMIT */}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#ff4054] py-4 font-bold text-white shadow-lg shadow-[#ff4054]/20 transition duration-300 hover:-translate-y-1 hover:bg-[#e9364a]"
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