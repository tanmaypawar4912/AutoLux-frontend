import { useAuth } from "@clerk/clerk-react";
import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "sonner";
import { API } from "../utils/api";

// =====================================================
// TYPES
// =====================================================

interface CarImages {
  front: string;
  back: string;
  left: string;
  right: string;
}

interface CarForm {
  brand: string;
  model: string;
  year: number;
  price: number;
  kilometers: number;
  fuelType: string;
  transmission: string;
  city: string;
  description: string;

  // Old image field - kept for compatibility
  image: string;

  // New 4-image system
  images: CarImages;
}

// =====================================================
// EMPTY IMAGES
// =====================================================

const emptyImages: CarImages = {
  front: "",
  back: "",
  left: "",
  right: "",
};

// =====================================================
// COMPONENT
// =====================================================

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    isLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  // ===================================================
  // STATES
  // ===================================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [uploadingType, setUploadingType] =
    useState<keyof CarImages | "">("");

  const [error, setError] =
    useState("");

  const [carData, setCarData] =
    useState<CarForm>({
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      kilometers: 0,
      fuelType: "",
      transmission: "",
      city: "",
      description: "",
      image: "",
      images: {
        ...emptyImages,
      },
    });

  // ===================================================
  // GET AUTH TOKEN
  // ===================================================

  const getAuthToken = async () => {
    if (!isLoaded) {
      throw new Error(
        "Authentication is still loading."
      );
    }

    if (!isSignedIn) {
      throw new Error(
        "Please login first."
      );
    }

    const token = await getToken();

    if (!token) {
      throw new Error(
        "Authentication token not available. Please login again."
      );
    }

    return token;
  };

  // ===================================================
  // FETCH CAR DETAILS
  // ===================================================

  useEffect(() => {
    if (!id) {
      setError("Car ID is missing.");
      setLoading(false);

      toast.error(
        "Car ID is missing."
      );

      return;
    }

    const fetchCar = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API}/cars/${id}`,
          {
            method: "GET",
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success ||
          !data.car
        ) {
          throw new Error(
            data.message ||
              "Car not found."
          );
        }

        const car = data.car;

        // =================================================
        // OLD + NEW IMAGE COMPATIBILITY
        // =================================================

        const databaseImages =
          car.images || {};

        const frontImage =
          databaseImages.front ||
          car.image ||
          "";

        const backImage =
          databaseImages.back ||
          "";

        const leftImage =
          databaseImages.left ||
          "";

        const rightImage =
          databaseImages.right ||
          "";

        setCarData({
          brand:
            car.brand || "",

          model:
            car.model || "",

          year:
            Number(car.year) ||
            new Date().getFullYear(),

          price:
            Number(car.price) || 0,

          kilometers:
            Number(car.kilometers) || 0,

          fuelType:
            car.fuelType || "",

          transmission:
            car.transmission || "",

          city:
            car.city || "",

          description:
            car.description || "",

          image:
            frontImage,

          images: {
            front:
              frontImage,

            back:
              backImage,

            left:
              leftImage,

            right:
              rightImage,
          },
        });

      } catch (error) {
        console.error(
          "Fetch Car Error:",
          error
        );

        const message =
          error instanceof Error
            ? error.message
            : "Failed to load car details.";

        setError(message);

        toast.error(
          "Unable to load car.",
          {
            description: message,
          }
        );

      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  // ===================================================
  // INPUT CHANGE
  // ===================================================

  const handleChange = (
    event:
      ChangeEvent<
        HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
      >
  ) => {
    const {
      name,
      value,
      type,
    } = event.target;

    setCarData(
      (previous) => ({
        ...previous,

        [name]:
          type === "number"
            ? Number(value)
            : value,
      })
    );
  };

  // ===================================================
  // CLOUDINARY IMAGE UPLOAD
  // ===================================================

  const uploadImage = async (
    event: ChangeEvent<HTMLInputElement>,
    imageType: keyof CarImages
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // ===============================================
    // IMAGE TYPE VALIDATION
    // ===============================================

    if (
      !file.type.startsWith("image/")
    ) {
      const message =
        "Please select a valid image file.";

      setError(message);

      toast.warning(message);

      event.target.value = "";

      return;
    }

    // ===============================================
    // IMAGE SIZE VALIDATION
    // ===============================================

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      const message =
        "Image size must be less than 5MB.";

      setError(message);

      toast.warning(message);

      event.target.value = "";

      return;
    }

    try {
      setUploadingImage(true);
      setUploadingType(imageType);
      setError("");

      const cloudName =
        import.meta.env
          .VITE_CLOUD_NAME;

      const uploadPreset =
        import.meta.env
          .VITE_UPLOAD_PRESET;

      if (
        !cloudName ||
        !uploadPreset
      ) {
        throw new Error(
          "Cloudinary configuration is missing. Check VITE_CLOUD_NAME and VITE_UPLOAD_PRESET."
        );
      }

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "upload_preset",
        uploadPreset
      );

      const response =
        await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.secure_url
      ) {
        throw new Error(
          data.error?.message ||
            "Image upload failed."
        );
      }

      const uploadedUrl =
        data.secure_url;

      // =================================================
      // SAVE UPLOADED IMAGE IN CORRECT SLOT
      // =================================================

      setCarData(
        (previous) => ({
          ...previous,

          image:
            imageType === "front"
              ? uploadedUrl
              : previous.image,

          images: {
            ...previous.images,

            [imageType]:
              uploadedUrl,
          },
        })
      );

      // =================================================
      // SUCCESS TOAST
      // =================================================

      const imageName =
        imageType
          .charAt(0)
          .toUpperCase() +
        imageType.slice(1);

      toast.success(
        `${imageName} photo uploaded successfully.`
      );

    } catch (error) {
      console.error(
        "Cloudinary Upload Error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to upload image.";

      setError(message);

      toast.error(
        "Photo upload failed.",
        {
          description: message,
        }
      );

    } finally {
      setUploadingImage(false);
      setUploadingType("");
      event.target.value = "";
    }
  };

  // ===================================================
  // REMOVE IMAGE
  // ===================================================

  const removeImage = (
    imageType: keyof CarImages
  ) => {
    setCarData(
      (previous) => ({
        ...previous,

        image:
          imageType === "front"
            ? ""
            : previous.image,

        images: {
          ...previous.images,
          [imageType]: "",
        },
      })
    );

    setError("");

    const imageName =
      imageType
        .charAt(0)
        .toUpperCase() +
      imageType.slice(1);

    toast.info(
      `${imageName} photo removed.`
    );
  };

  // ===================================================
  // SAVE CHANGES
  // ===================================================

  const handleSave = async () => {
    if (!id) {
      const message =
        "Car ID is missing.";

      setError(message);

      toast.error(message);

      return;
    }

    // ===============================================
    // BASIC VALIDATION
    // ===============================================

    if (!carData.brand.trim()) {
      const message =
        "Please enter car brand.";

      setError(message);

      toast.warning(message);

      return;
    }

    if (!carData.model.trim()) {
      const message =
        "Please enter car model.";

      setError(message);

      toast.warning(message);

      return;
    }

    if (
      !carData.year ||
      carData.year < 1900
    ) {
      const message =
        "Please enter a valid manufacturing year.";

      setError(message);

      toast.warning(message);

      return;
    }

    if (
      !carData.price ||
      carData.price <= 0
    ) {
      const message =
        "Please enter a valid price.";

      setError(message);

      toast.warning(message);

      return;
    }

    if (
      carData.kilometers < 0
    ) {
      const message =
        "Kilometers cannot be negative.";

      setError(message);

      toast.warning(message);

      return;
    }

    if (!carData.fuelType) {
      const message =
        "Please select fuel type.";

      setError(message);

      toast.warning(message);

      return;
    }

    if (!carData.transmission) {
      const message =
        "Please select transmission.";

      setError(message);

      toast.warning(message);

      return;
    }

    if (!carData.description.trim()) {
      const message =
        "Please enter car description.";

      setError(message);

      toast.warning(message);

      return;
    }

    try {
      setSaving(true);
      setError("");

      // =================================================
      // AUTHENTICATION
      // =================================================

      const token =
        await getAuthToken();

      // =================================================
      // FRONT IMAGE
      // =================================================

      const frontImage =
        carData.images.front ||
        carData.image ||
        "";

      // =================================================
      // FINAL PAYLOAD
      // =================================================

      const payload = {
        brand:
          carData.brand,

        model:
          carData.model,

        year:
          Number(carData.year),

        price:
          Number(carData.price),

        kilometers:
          Number(carData.kilometers),

        fuelType:
          carData.fuelType,

        transmission:
          carData.transmission,

        city:
          carData.city,

        description:
          carData.description,

        image:
          frontImage,

        images: {
          front:
            frontImage,

          back:
            carData.images.back,

          left:
            carData.images.left,

          right:
            carData.images.right,
        },
      };

      console.log(
        "Updating car with payload:",
        payload
      );

      // =================================================
      // UPDATE API
      // =================================================

      const response =
        await fetch(
          `${API}/cars/${id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            credentials:
              "include",

            body:
              JSON.stringify(
                payload
              ),
          }
        );

      const data =
        await response.json();

      console.log(
        "Update response:",
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to update car."
        );
      }

      // =================================================
      // SUCCESS TOAST
      // =================================================

      toast.success(
        "Car updated successfully! 🚗",
        {
          description:
            "Your car details have been saved.",
        }
      );

      // Small delay so toast is visible
      setTimeout(() => {
        navigate("/my-cars");
      }, 500);

    } catch (error) {
      console.error(
        "Update Car Error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update car.";

      setError(message);

      toast.error(
        "Failed to update car.",
        {
          description: message,
        }
      );

    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // IMAGE UPLOAD CARD
  // ===================================================

  const ImageUploadCard = ({
    type,
    title,
    description,
  }: {
    type: keyof CarImages;
    title: string;
    description: string;
  }) => {
    const image =
      carData.images[type];

    const isUploading =
      uploadingImage &&
      uploadingType === type;

    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">

          <div>
            <h3 className="text-sm font-black text-gray-900">
              {title}
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              {description}
            </p>
          </div>

          <span className="rounded-full bg-[#ff4054]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#ff4054]">
            {type}
          </span>

        </div>

        {/* IMAGE */}

        <div className="p-4">

          {image ? (
            <div className="relative overflow-hidden rounded-xl">

              <img
                src={image}
                alt={title}
                className="h-52 w-full object-cover"
              />

              {/* IMAGE ACTIONS */}

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-3 pt-10">

                {/* CHANGE */}

                <label className="cursor-pointer rounded-lg bg-[#ff4054] px-4 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-[#e6364a]">

                  Change Photo

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(
                      event
                    ) =>
                      uploadImage(
                        event,
                        type
                      )
                    }
                    disabled={
                      uploadingImage
                    }
                  />

                </label>

                {/* REMOVE */}

                <button
                  type="button"
                  onClick={() =>
                    removeImage(
                      type
                    )
                  }
                  disabled={
                    uploadingImage
                  }
                  className="rounded-lg bg-white/95 px-4 py-2 text-xs font-bold text-red-600 shadow-lg transition hover:bg-white disabled:opacity-50"
                >
                  Remove
                </button>

              </div>

            </div>
          ) : (
            <label className="flex h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white text-center transition hover:border-[#ff4054] hover:bg-[#fff8f9]">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff4054]/10 text-2xl">
                📷
              </div>

              <p className="mt-3 text-sm font-black text-gray-800">
                Upload {title}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                PNG, JPG or WEBP
              </p>

              <p className="mt-2 text-[10px] text-gray-400">
                Click here to select photo
              </p>

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(
                  event
                ) =>
                  uploadImage(
                    event,
                    type
                  )
                }
                disabled={
                  uploadingImage
                }
              />

            </label>
          )}

          {/* UPLOADING */}

          {isUploading && (
            <div className="mt-3 rounded-lg bg-[#ff4054]/10 px-3 py-2 text-center">

              <p className="text-xs font-bold text-[#ff4054]">
                Uploading {title}...
              </p>

            </div>
          )}

        </div>

      </div>
    );
  };

  // ===================================================
  // LOADING SCREEN
  // ===================================================

  if (
    !isLoaded ||
    loading
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#ff4054]" />

          <h2 className="mt-4 text-xl font-black text-gray-900">
            Loading Car Details...
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Please wait.
          </p>

        </div>

      </div>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-28 sm:px-6">

      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-5 shadow-xl sm:p-8">

        {/* HEADER */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() =>
              navigate("/my-cars")
            }
            className="mb-4 text-sm font-semibold text-gray-500 transition hover:text-[#ff4054]"
          >
            ← Back to My Cars
          </button>

          <h1 className="text-3xl font-black text-gray-900 sm:text-4xl">
            Edit Car
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Update your car details and manage all four vehicle photos.
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

            <p className="text-sm font-semibold text-red-600">
              {error}
            </p>

          </div>
        )}

        {/* FOUR CAR PHOTOS */}

        <section className="mb-10">

          <div className="mb-5">

            <h2 className="text-2xl font-black text-gray-900">
              Car Photos
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Upload four clear photos of your car.
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <ImageUploadCard
              type="front"
              title="Front Image"
              description="Main front view of the car"
            />

            <ImageUploadCard
              type="back"
              title="Back Image"
              description="Rear view of the car"
            />

            <ImageUploadCard
              type="left"
              title="Left Side Image"
              description="Left side from front view"
            />

            <ImageUploadCard
              type="right"
              title="Right Side Image"
              description="Right side from front view"
            />

          </div>

        </section>

        {/* CAR DETAILS */}

        <section>

          <h2 className="mb-5 text-2xl font-black text-gray-900">
            Car Details
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <FormInput
              label="Brand"
              name="brand"
              value={
                carData.brand
              }
              onChange={
                handleChange
              }
              required
            />

            <FormInput
              label="Model"
              name="model"
              value={
                carData.model
              }
              onChange={
                handleChange
              }
              required
            />

            <FormInput
              label="Year"
              name="year"
              type="number"
              value={
                carData.year
              }
              onChange={
                handleChange
              }
              required
            />

            <FormInput
              label="Price"
              name="price"
              type="number"
              value={
                carData.price
              }
              onChange={
                handleChange
              }
              required
            />

            <FormInput
              label="Kilometers"
              name="kilometers"
              type="number"
              value={
                carData.kilometers
              }
              onChange={
                handleChange
              }
              required
            />

            <div>

              <label className="mb-2 block text-sm font-bold text-gray-700">
                Fuel Type
              </label>

              <select
                name="fuelType"
                value={
                  carData.fuelType
                }
                onChange={
                  handleChange
                }
                required
                className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
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

                <option value="CNG">
                  CNG
                </option>

                <option value="Electric">
                  Electric
                </option>

                <option value="Hybrid">
                  Hybrid
                </option>

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-bold text-gray-700">
                Transmission
              </label>

              <select
                name="transmission"
                value={
                  carData.transmission
                }
                onChange={
                  handleChange
                }
                required
                className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
              >

                <option value="">
                  Select Transmission
                </option>

                <option value="Manual">
                  Manual
                </option>

                <option value="Automatic">
                  Automatic
                </option>

                <option value="AMT">
                  AMT
                </option>

                <option value="CVT">
                  CVT
                </option>

                <option value="DCT">
                  DCT
                </option>

              </select>

            </div>

            <FormInput
              label="City"
              name="city"
              value={
                carData.city
              }
              onChange={
                handleChange
              }
              placeholder="e.g. Pune"
            />

          </div>

          {/* DESCRIPTION */}

          <div className="mt-6">

            <label className="mb-2 block text-sm font-bold text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={
                carData.description
              }
              onChange={
                handleChange
              }
              rows={5}
              required
              placeholder="Enter car description..."
              className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
            />

          </div>

        </section>

        {/* BUTTONS */}

        <div className="mt-10 flex flex-col gap-4 border-t border-gray-200 pt-7 sm:flex-row">

          <button
            type="button"
            onClick={
              handleSave
            }
            disabled={
              saving ||
              uploadingImage
            }
            className="flex-1 rounded-xl bg-[#ff4054] py-4 text-lg font-black text-white transition hover:bg-[#e6364a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Updating..."
              : uploadingImage
                ? "Uploading Photo..."
                : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/my-cars")
            }
            disabled={
              saving ||
              uploadingImage
            }
            className="flex-1 rounded-xl border-2 border-gray-300 py-4 text-lg font-bold text-gray-800 transition hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
};

// =====================================================
// FORM INPUT COMPONENT
// =====================================================

interface FormInputProps {
  label: string;
  name: string;
  value: string | number;
  type?: string;
  placeholder?: string;
  required?: boolean;

  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
}

const FormInput = ({
  label,
  name,
  value,
  type = "text",
  placeholder,
  required = false,
  onChange,
}: FormInputProps) => {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-[#ff4054] focus:ring-2 focus:ring-[#ff4054]/10"
      />

    </div>
  );
};

export default EditCar;