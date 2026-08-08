import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useUser } from "@clerk/clerk-react";

import Reveal from "../components/Reveal";
import { API } from "../utils/api";

const STEPS = ["Vehicle Details", "Photos & Description"];

const SellCar = () => {
  const { user } = useUser();

  const formRef = useRef<HTMLFormElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Cloudinary states
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const uploadImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploadingImage(true);

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
      "upload_preset",
      import.meta.env.VITE_UPLOAD_PRESET
    );

    formData.append(
      "cloud_name",
      import.meta.env.VITE_CLOUD_NAME
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setImageUrl(data.secure_url);

      setImagePreview(data.secure_url);

    } catch (error) {
      console.log(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const carData = {
      sellerName: user?.fullName || "User",

      sellerEmail:
        user?.primaryEmailAddress?.emailAddress || "",

      brand: formData.get("brand"),

      model: formData.get("model"),

      year: Number(formData.get("year")),

      price: Number(formData.get("price")),

      kilometers: Number(formData.get("kilometers")),

      fuelType: formData.get("fuelType"),

      transmission: formData.get("transmission"),

      city: formData.get("city"),

      description: formData.get("description"),

      image: imageUrl,
    };

    try {
      const response = await fetch(`${API}/cars/add`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(carData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit car"
        );
      }

      setIsSubmitted(true);

      form.reset();
      setStep(1);

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-6 pb-24 pt-36">

      <div className="mx-auto max-w-7xl">

        <Reveal>

          <div className="max-w-3xl">

            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#ff4054]">
              Sell With AutoLux
            </p>

            <h1 className="mt-5 text-5xl font-black leading-tight text-gray-900 md:text-7xl">
              Sell Your
              <span className="text-[#ff4054]">
                {" "}Car.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-500">
              Get the best value for your vehicle with a smooth,
              transparent and premium selling experience.
            </p>

            <a
              href="/sell/estimate"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#ff4054] hover:underline"
            >
              Not sure about the price? Get an instant estimate →
            </a>

          </div>

        </Reveal>


        <div className="mt-16 grid gap-12 lg:grid-cols-3">


          {/* LEFT INFORMATION */}

          <Reveal>

            <div className="rounded-3xl bg-[#111] p-8 text-white">

              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#ff4054]">
                Why Sell With Us?
              </p>

              <h2 className="mt-5 text-3xl font-black">
                Your Car Deserves
                <span className="text-[#ff4054]">
                  {" "}More.
                </span>
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                At AutoLux, we connect your vehicle with serious buyers
                looking for quality premium cars.
              </p>


              <div className="mt-10 space-y-6">

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff4054]/10 text-[#ff4054]">
                    ✓
                  </div>

                  <div>

                    <h3 className="font-bold">
                      Premium Buyers
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      Reach verified and serious car buyers.
                    </p>

                  </div>

                </div>


                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff4054]/10 text-[#ff4054]">
                    ✓
                  </div>

                  <div>

                    <h3 className="font-bold">
                      Transparent Process
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      Simple and clear selling process.
                    </p>

                  </div>

                </div>


                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ff4054]/10 text-[#ff4054]">
                    ✓
                  </div>

                  <div>

                    <h3 className="font-bold">
                      Expert Support
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      Our team helps you throughout the process.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </Reveal>


          {/* FORM */}

          <Reveal>

            <div className="rounded-3xl bg-white p-8 shadow-xl lg:col-span-2">

              <div className="mb-8">

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff4054]">
                  Vehicle Information
                </p>

                <h2 className="mt-3 text-3xl font-black text-gray-900">
                  Tell Us About Your Car
                </h2>

                <p className="mt-2 text-gray-500">
                  Fill in the details below and our team will get back to you.
                </p>

              </div>


              {/* SELLER INFORMATION */}

              <div className="mb-8 rounded-2xl border border-[#ff4054]/20 bg-[#fff5f6] p-5">

                <p className="text-xs font-bold uppercase tracking-wider text-[#ff4054]">
                  Seller Information
                </p>

                <p className="mt-3 font-bold text-gray-900">
                  {user?.fullName || "User"}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>

              </div>


              {isSubmitted ? (

                <div className="rounded-2xl bg-green-50 p-8 text-center">

                  <div className="text-5xl">
                    ✓
                  </div>

                  <h3 className="mt-4 text-2xl font-black text-gray-900">
                    Request Submitted Successfully!
                  </h3>

                  <p className="mt-3 text-gray-500">
                    Your car details have been saved successfully.
                  </p>

                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 rounded-xl bg-[#ff4054] px-6 py-3 font-bold text-white transition hover:bg-[#e9364a]"
                  >
                    Submit Another Request
                  </button>

                </div>

              ) : (

                <>

                  {/* PROGRESS BAR */}

                  <div className="mb-8 flex items-center gap-3">
                    {STEPS.map((label, index) => {
                      const stepNumber = index + 1;
                      const isActive = step === stepNumber;
                      const isDone = step > stepNumber;

                      return (
                        <div key={label} className="flex flex-1 items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                              isActive || isDone
                                ? "bg-[#ff4054] text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {isDone ? "✓" : stepNumber}
                          </div>
                          <div className="hidden sm:block">
                            <p
                              className={`text-sm font-bold ${
                                isActive ? "text-[#111]" : "text-gray-400"
                              }`}
                            >
                              {label}
                            </p>
                          </div>
                          {stepNumber < STEPS.length && (
                            <div
                              className={`h-0.5 flex-1 ${
                                isDone ? "bg-[#ff4054]" : "bg-gray-100"
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  onKeyDown={(event) => {
                    // pressing Enter in any input implicitly submits the
                    // form natively — that runs full-form validation
                    // (including the still-hidden Step 2 fields) before we
                    // ever get a chance to intercept it. Block it unless
                    // we're actually on the final step.
                    if (event.key === "Enter" && step !== 2) {
                      event.preventDefault();
                    }
                  }}
                  className="space-y-6"
                >

                  {/* STEP 1: VEHICLE DETAILS */}
                  <div ref={step1Ref} className={step === 1 ? "space-y-6" : "hidden"}>

                  {/* ROW 1 */}

                  <div className="grid gap-6 md:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-sm font-bold text-gray-700">
                        Car Brand
                      </label>

                      <input
                        name="brand"
                        type="text"
                        placeholder="e.g. BMW"
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                      />

                    </div>


                    <div>

                      <label className="mb-2 block text-sm font-bold text-gray-700">
                        Car Model
                      </label>

                      <input
                        name="model"
                        type="text"
                        placeholder="e.g. BMW M4"
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                      />

                    </div>

                  </div>


                  {/* ROW 2 */}

                  <div className="grid gap-6 md:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-sm font-bold text-gray-700">
                        Manufacturing Year
                      </label>

                      <input
                        name="year"
                        type="number"
                        placeholder="e.g. 2024"
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                      />

                    </div>


                    <div>

                      <label className="mb-2 block text-sm font-bold text-gray-700">
                        Expected Price
                      </label>

                      <input
                        name="price"
                        type="number"
                        placeholder="e.g. 7500000"
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                      />

                    </div>

                  </div>


                  {/* ROW 3 */}

                  <div className="grid gap-6 md:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-sm font-bold text-gray-700">
                        Kilometers Driven
                      </label>

                      <input
                        name="kilometers"
                        type="number"
                        placeholder="e.g. 25000"
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                      />

                    </div>


                    <div>

                      <label className="mb-2 block text-sm font-bold text-gray-700">
                        Fuel Type
                      </label>

                      <select
                        name="fuelType"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                      >

                        <option value="">
                          Select Fuel Type
                        </option>

                        <option value="Petrol">
                          Petrol
                        </option>

                        <option value="Diesel">
                          Diesel
                        </option>

                        <option value="Electric">
                          Electric
                        </option>

                        <option value="Hybrid">
                          Hybrid
                        </option>

                      </select>

                    </div>

                  </div>


                  {/* TRANSMISSION + CITY */}

                  <div className="grid gap-6 md:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-sm font-bold text-gray-700">
                        Transmission
                      </label>

                      <select
                        name="transmission"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                      >

                        <option value="">
                          Select Transmission
                        </option>

                        <option value="Automatic">
                          Automatic
                        </option>

                        <option value="Manual">
                          Manual
                        </option>

                      </select>

                    </div>

                    <div>

                      <label className="mb-2 block text-sm font-bold text-gray-700">
                        City
                      </label>

                      <input
                        name="city"
                        type="text"
                        placeholder="e.g. Pune"
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                      />

                    </div>

                  </div>

                  </div>

                  {/* NEXT BUTTON (step 1 only) */}
                  {step === 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        // only check inputs/selects inside Step 1 — running
                        // reportValidity() on the whole form fails silently
                        // here because Step 2's required Description field
                        // is display:none at this point, and hidden required
                        // fields can't show their validation message
                        const step1Fields =
                          step1Ref.current?.querySelectorAll<
                            HTMLInputElement | HTMLSelectElement
                          >("input, select");

                        let isValid = true;
                        step1Fields?.forEach((field) => {
                          if (!field.reportValidity()) {
                            isValid = false;
                          }
                        });

                        if (isValid) {
                          setStep(2);
                        }
                      }}
                      className="w-full rounded-xl bg-[#111] px-6 py-4 font-bold text-white transition hover:bg-black"
                    >
                      Continue to Photos & Description →
                    </button>
                  )}

                  {/* STEP 2: DESCRIPTION + PHOTOS */}
                  <div className={step === 2 ? "space-y-6" : "hidden"}>

                  {/* DESCRIPTION */}

                  <div>

                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Additional Details
                    </label>

                    <textarea
                      name="description"
                      rows={5}
                      placeholder="Tell us more about your car..."
                      required
                      className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
                    />

                  </div>


                  {/* IMAGE URL */}
                  <div>

                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Upload Car Image
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={uploadImage}
                      className="w-full rounded-xl border border-gray-200 p-3"
                    />

                    {uploadingImage && (

                      <p className="mt-3 text-sm text-[#ff4054]">
                        Uploading image...
                      </p>

                    )}

                    {imagePreview && (

                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-4 h-56 w-full rounded-xl object-cover"
                      />

                    )}

                  </div>

                  {/* ERROR */}

                  {error && (

                    <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600">
                      {error}
                    </div>

                  )}


                  {/* SUBMIT */}

                  {step === 2 && (
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="rounded-xl border border-gray-200 px-6 py-4 font-bold text-gray-700 transition hover:border-[#ff4054]"
                      >
                        ← Back
                      </button>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 rounded-xl bg-[#ff4054] px-6 py-4 font-bold text-white shadow-lg shadow-[#ff4054]/20 transition duration-300 hover:-translate-y-1 hover:bg-[#e9364a] disabled:cursor-not-allowed disabled:opacity-60"
                      >

                        {isLoading
                          ? "Submitting..."
                          : "Submit Your Car →"
                        }

                      </button>
                    </div>
                  )}

                  </div>

                </form>

                </>

              )}

            </div>

          </Reveal>

        </div>

      </div>

    </main>
  );
};

export default SellCar;